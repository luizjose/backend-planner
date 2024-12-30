import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "Token não fornecido" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);

    if (!decoded) {
      res.status(401).json({ error: "Token inválido ou expirado" });
      return;
    }

    // Anexar o usuário ao objeto da requisição
    req.user = decoded as { id: string; email: string };

    next(); // Prosseguir para o próximo middleware ou rota
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
