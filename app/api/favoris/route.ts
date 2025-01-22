import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST: Ajouter ou supprimer un favori
interface PostRequestBody {
  userId: string;
  videoId: string;
}

interface PostResponse {
  message?: string;
  error?: string;
  favorite?: Favorite;
}

export async function POST(request: Request): Promise<Response> {
  const { userId, videoId }: PostRequestBody = await request.json();

  try {
    // Vérifie si l'utilisateur a déjà ajouté la vidéo aux favoris
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: parseInt(userId),
        videoId: parseInt(videoId),
      },
    });

    if (existingFavorite) {
      // Supprime le favori s'il existe déjà
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      const response: PostResponse = { message: 'Favori supprimé' };
      return new Response(JSON.stringify(response), { status: 200 });
    } else {
      // Ajoute un favori
      const favorite = await prisma.favorite.create({
        data: {
          userId: parseInt(userId),
          videoId: parseInt(videoId),
        },
      });
      const response: PostResponse = { favorite };
      return new Response(JSON.stringify(response), { status: 201 });
    }
  } catch (error) {
    console.error('Erreur lors de la gestion du favori :', error);
    const response: PostResponse = { error: 'Erreur lors de la gestion du favori' };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}

// GET: Récupérer les favoris d'un utilisateur
interface Favorite {
  id: number;
  userId: number;
  videoId: number;
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: parseInt(userId as string),
      },
      include: {
        video: true, // Inclut les détails de la vidéo
      },
    });

    // Formate la réponse pour inclure les détails de la vidéo
    const formattedFavorites = favorites.map((favorite) => ({
      id: favorite.id,
      userId: favorite.userId,
      videoId: favorite.videoId,
      video: {
        id: favorite.video.id,
        title: favorite.video.title,
        url: favorite.video.url,
        thumbnail: favorite.video.thumbnail,
      },
    }));

    return new Response(JSON.stringify(formattedFavorites), { status: 200 });
  } catch (error) {
    console.error('Erreur lors du chargement des favoris :', error);
    return new Response(JSON.stringify({ error: 'Erreur lors du chargement des favoris' }), { status: 500 });
  }
}