import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction utilitaire pour valider les paramètres
function validateParams(params: Record<string, any>, requiredFields: string[]) {
  const missingFields = requiredFields.filter((field) => !params[field]);
  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Les champs suivants sont requis : ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }
  return null;
}

// POST : Ajouter un nouveau commentaire
export async function POST(request: Request) {
  try {
    const { content, userId, videoId } = await request.json();

    // Validation des champs requis
    const validationError = validateParams({ content, userId, videoId }, ['content', 'userId', 'videoId']);
    if (validationError) return validationError;

    // Vérifier que l'utilisateur et la vidéo existent
    const userExists = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    const videoExists = await prisma.video.findUnique({ where: { id: parseInt(videoId) } });

    if (!userExists || !videoExists) {
      return NextResponse.json(
        { error: 'Utilisateur ou vidéo non trouvé' },
        { status: 404 }
      );
    }

    // Créer le commentaire
    const newComment = await prisma.comment.create({
      data: {
        content,
        userId: parseInt(userId),
        videoId: parseInt(videoId),
      },
      include: { user: true }, // Inclure les informations de l'utilisateur
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    console.error('Erreur lors de la création du commentaire :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du commentaire', details: error.message },
      { status: 500 }
    );
  }
}

// GET : Récupérer tous les commentaires d'une vidéo
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    // Validation du paramètre videoId
    const validationError = validateParams({ videoId }, ['videoId']);
    if (validationError) return validationError;

    // Récupérer les commentaires de la vidéo
    const comments = await prisma.comment.findMany({
      where: { videoId: parseInt(videoId!) },
      include: { user: true }, // Inclure les informations de l'utilisateur
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des commentaires :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commentaires', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE : Supprimer un commentaire
export async function DELETE(request: Request) {
    try {
      // Supprimer tous les commentaires
      await prisma.comment.deleteMany();
  
      return NextResponse.json(
        { message: ' le commentaires a été supprimés avec succès' },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Erreur lors de la suppression des commentaires :', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression des commentaires', details: error.message },
        { status: 500 }
      );
    }
  }