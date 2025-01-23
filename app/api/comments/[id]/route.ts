
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function DELETE(request: Request ) {
    try {
        console.log('DELETE request received');
        const body = await request.json();
        const{
            id
        } = body;

      // Supprimer tous les commentaires
      await prisma.comment.deleteMany(
        {
            where: {
                id: parseInt(id)
    }});
  
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