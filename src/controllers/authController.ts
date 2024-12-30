import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { generateJwt } from "../utils/jwt";
import { PrismaClient } from "@prisma/client";

const client = new OAuth2Client(
  "556945227592-6adta6gbk4lt686ko9392a8kk1clmn5e.apps.googleusercontent.com"
);
const prisma = new PrismaClient();

export const loginWithGoogle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400).json({ error: "Token não fornecido" });
    return;
  }

  try {
    // Validar o token com o Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        "556945227592-6adta6gbk4lt686ko9392a8kk1clmn5e.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }

    const { sub: googleId, name, email, picture } = payload;

    // Aqui você pode buscar ou criar o usuário no banco de dados
    if (!email || !name) {
      res.status(400).json({ error: "Nome ou email não fornecidos" });
      return;
    }

    let user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      user = await prisma.users.update({
        where: {
          email,
        },
        data: {
          googleId,
          profilePic: picture,
        },
      });
    } else {
      user = await prisma.users.create({
        data: {
          email,
          googleId,
          name,
          profilePic: picture,
        },
      });
      const defaultCategories = [
        "Alimentação",
        "Transporte",
        "Moradia",
        "Lazer",
        "Educação",
        "Outros",
      ];
      await prisma.financialCategories.createMany({
        data: defaultCategories.map((name) => ({
          name,
          user_id: user?.id,
        })),
      });
    }
    console.log("Usuário logado com sucesso:", user);
    // Gerar JWT
    const token = generateJwt({ id: user.id, email: user.email });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Erro ao validar token:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
