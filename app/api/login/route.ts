import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // Pour vérifier les mots de passe
import jwt from 'jsonwebtoken'; // Pour générer des tokens JWT

const prisma = new PrismaClient();
const JWT_SECRET = 'votre_secret_jwt'; // Remplacez par une clé secrète sécurisée

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Vérification des champs obligatoires
    if (!body || !body.emailOrUsername || !body.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { emailOrUsername, password } = body;

    // Trouver l'utilisateur par email ou username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email/username or password' }, { status: 400 });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email/username or password' }, { status: 400 });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Ne renvoyer que les informations nécessaires (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword, token }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}