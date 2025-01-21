
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ajouter un like
export async function POST(request: Request) {
  try {
    const { userId, videoId } = await request.json();

    // Vérifier si l'utilisateur et la vidéo existent
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const video = await prisma.video.findUnique({ where: { id: videoId } });

    if (!user || !video) {
      return NextResponse.json(
        { error: 'User or Video not found' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà liké la vidéo
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'User has already liked this video' },
        { status: 400 }
      );
    }

    // Ajouter le like
    const like = await prisma.like.create({
      data: {
        userId,
        videoId,
      },
    });

    return NextResponse.json({ success: true, data: like }, { status: 201 });
  } catch (error) {
    console.error('Error adding like:', error);
    return NextResponse.json(
      { error: 'Failed to add like' },
      { status: 500 }
    );
  }
}

// Supprimer un like
export async function DELETE(request: Request) {
  try {
    const { userId, videoId } = await request.json();

    // Vérifier si le like existe
    const like = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    if (!like) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }

    // Supprimer le like
    await prisma.like.delete({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    return NextResponse.json(
      { success: true, message: 'Like removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json(
      { error: 'Failed to remove like' },
      { status: 500 }
    );
  }
}

// Récupérer les likes d'un utilisateur
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Récupérer les likes de l'utilisateur
    const likes = await prisma.like.findMany({
      where: { userId: parseInt(userId) },
      include: {
        video: true, // Inclure les détails de la vidéo
      },
    });

    return NextResponse.json({ success: true, data: likes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}