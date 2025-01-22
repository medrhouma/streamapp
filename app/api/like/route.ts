import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST: Ajouter ou supprimer un like
interface PostRequestBody {
  userId: string;
  videoId: string;
}

interface PostResponse {
  message?: string;
  error?: string;
  like?: Like;
}

export async function POST(request: Request): Promise<Response> {
  const { userId, videoId }: PostRequestBody = await request.json();

  try {
    // Vérifie si l'utilisateur a déjà liké la vidéo
    const existingLike: Like | null = await prisma.like.findFirst({
      where: {
        userId: parseInt(userId),
        videoId: parseInt(videoId),
      },
    });

    if (existingLike) {
      // Supprime le like s'il existe déjà
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      const response: PostResponse = { message: 'Like supprimé' };
      return new Response(JSON.stringify(response), { status: 200 });
    } else {
      // Ajoute un like
      const like: Like = await prisma.like.create({
        data: {
          userId: parseInt(userId),
          videoId: parseInt(videoId),
        },
      });
      const response: PostResponse = { like };
      return new Response(JSON.stringify(response), { status: 201 });
    }
  } catch (error) {
    const response: PostResponse = { error: 'Erreur lors de la gestion du like' };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}

// GET: Récupérer les likes d'un utilisateur
interface Like {
  id: number;
  userId: number;
  videoId: number;
}

interface RequestBody {
  userId: string;
  videoId: string;
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const likes: Like[] = await prisma.like.findMany({
      where: {
        userId: parseInt(userId as string),
      },
    });
    return new Response(JSON.stringify(likes), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erreur lors du chargement des likes' }), { status: 500 });
  }
}