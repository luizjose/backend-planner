import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export const createFinCategoriesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.body;

  if (!req.user) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }

  try {
    const record = await prisma.financialCategories.create({
      data: {
        name,
        user_id: req.user?.id,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
    return;
  }
};
export const getFinCategoriesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }
  try {
    const records = await prisma.financialCategories.findMany({
      where: {
        user_id: req.user.id,
      },
    });

    res.status(200).json(records);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const editFinCategoriesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;
  console.log(req.body);

  if (!req.user) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }

  try {
    const record = await prisma.financialCategories.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    });

    res.status(200).json(record);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const createFinRecordsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, amount, type_id, category_id, date } = req.body;

  if (!req.user) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }
  const formattedDate = new Date(date);
  try {
    const record = await prisma.financialRecords.create({
      data: {
        name,
        amount,
        type_id,
        category_id,
        date: formattedDate,
        description: "",
        user_id: req.user?.id,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
    return;
  }
};

export const getFinRecordsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }
  try {
    const records = await prisma.financialRecords.findMany({
      where: {
        user_id: req.user.id,
      },
      include:{
        category: true,
        type: true
      }
    });

    res.status(200).json(records);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getFinRecordsByMonthYearController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }

  const { month, year } = req.query;
  console.log(req.query);

  if (!month || !year) {
    res
      .status(400)
      .json({ error: "Os parâmetros 'month' e 'year' são obrigatórios." });
    return;
  }

  const monthInt = parseInt(month as string, 10);
  const yearInt = parseInt(year as string, 10);

  if (isNaN(monthInt) || isNaN(yearInt)) {
    res
      .status(400)
      .json({ error: "Os parâmetros 'month' e 'year' devem ser números válidos." });
    return;
  }

  try {
    const startDate = new Date(yearInt, monthInt - 1, 1); // Primeiro dia do mês
    const endDate = new Date(yearInt, monthInt, 0); // Último dia do mês

    const records = await prisma.financialRecords.findMany({
      where: {
        user_id: req.user.id,
        date: {
          gte: startDate, // Data maior ou igual ao início do mês
          lte: endDate, // Data menor ou igual ao final do mês
        },
      },
      include: {
        category: true,
        type: true,
      },
    });

    res.status(200).json(records);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};