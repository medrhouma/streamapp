import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Schéma de validation pour les vidéos
const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().min(1, "URL is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  duration: z.string().min(1, "Duration is required"),
  views: z.string().min(1, "Views is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
});

// Fonction utilitaire pour les réponses d'erreur
function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function internalServerError(error: unknown) {
  console.error('Internal Server Error:', error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Internal Server Error' },
    { status: 500 }
  );
}

// Handler pour les requêtes POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    // Vérifier que le corps de la requête est présent
    if (!body) {
      return badRequest('Request body is missing');
    }

    // Valider les données de la requête
    const validatedData = videoSchema.safeParse(body);
    if (!validatedData.success) {
      console.log('Validation errors:', validatedData.error.errors);
      return badRequest(validatedData.error.errors.map(e => e.message).join(', '));
    }

    // Créer une nouvelle vidéo dans la base de données
    const newVideo = await prisma.video.create({
      data: validatedData.data,
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/video:', error);
    return internalServerError(error);
  }
}

// Handler pour les requêtes GET
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    console.log('Query parameters:', { page, limit });

    // Convertir les paramètres en nombres
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Valider les paramètres
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return badRequest('Parameters "page" and "limit" must be positive numbers');
    }

    // Récupérer les vidéos depuis la base de données
    const skip = (pageNumber - 1) * limitNumber;
    const videos = await prisma.video.findMany({
      skip,
      take: limitNumber,
    });

    // Compter le nombre total de vidéos
    const total = await prisma.video.count();

    // Retourner la réponse paginée
    return NextResponse.json({
      data: videos,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/video:', error);
    return internalServerError(error);
  }
}