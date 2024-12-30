const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar um hábito com dias específicos
export const createHabit = async (req:any, res:any) => {
  const { name, description, days } = req.body;
    const user = await prisma.users.findUnique({
        where: {
            email: req.user.email,
        },
        });
    const userId = user.id;

  try {
    const habit = await prisma.habits.create({
      data: {
        user_id: userId,
        name,
        description,
        habitDays: {
          create: days.map((day:any) => ({ day })),
        },
      },
      include: { habitDays: true },
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Atualizar dias de um hábito
export const updateHabitDays = async (req:any, res:any) => {
  const { habitId } = req.params;
  const { days } = req.body;

  try {
    // Remover os dias existentes
    await prisma.habitDays.deleteMany({
      where: { habit_id: habitId },
    });

    // Adicionar os novos dias
    const updatedDays = await prisma.habitDays.createMany({
      data: days.map((day:any) => ({
        habit_id: habitId,
        day,
      })),
    });

    res.status(200).json({ message: 'Dias atualizados com sucesso', updatedDays });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Listar hábitos de um usuário com seus dias
export const getHabits = async (req:any, res:any) => {
  const { userId } = req.params;

  try {
    const habits = await prisma.habits.findMany({
      where: { user_id: userId },
      include: { habitDays: true },
    });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Deletar um hábito
export const deleteHabit = async (req:any, res:any) => {
  const { habitId } = req.params;

  try {
    await prisma.habits.delete({
      where: { id: habitId },
    });
    res.status(200).json({ message: 'Hábito deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Registrar a conclusão de um hábito
// Registrar ou atualizar o progresso diário de um hábito
export const markHabitDailyProgress = async (req: any, res: any) => {
    const { habitId } = req.params;
    const { date, status } = req.body;
  
    try {
      // Verifica se já existe um registro para o dia
      const existingRecord = await prisma.habitRecords.findFirst({
        where: {
          habit_id: habitId,
          date: new Date(date),
        },
      });
  
      let habitRecord;
      if (existingRecord) {
        // Atualiza o registro existente
        habitRecord = await prisma.habitRecords.update({
          where: { id: existingRecord.id },
          data: { status },
        });
      } else {
        // Cria um novo registro para o dia
        habitRecord = await prisma.habitRecords.create({
          data: {
            habit_id: habitId,
            date: new Date(date),
            status: status || "completed", // "completed" por padrão
          },
        });
      }
  
      res.status(200).json({ message: "Progresso registrado com sucesso", habitRecord });
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar progresso diário", details: error });
    }
  };
  // Obter progresso diário do hábito
export const getDailyHabitProgress = async (req: any, res: any) => {
    const { habitId } = req.params;
    const { startDate, endDate } = req.query;
  
    try {
      const progress = await prisma.habitRecords.findMany({
        where: {
          habit_id: habitId,
          date: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
        orderBy: { date: "asc" }, // Ordena por data
      });
  
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar progresso diário", details: error });
    }
  };
  // Resumo do desempenho do hábito (Ex.: frequência mensal)
export const getHabitPerformanceSummary = async (req: any, res: any) => {
    const { habitId } = req.params;
    const { startDate, endDate } = req.query;
  
    try {
      const completedDays = await prisma.habitRecords.count({
        where: {
          habit_id: habitId,
          status: "completed",
          date: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
      });
  
      const totalDays = await prisma.habitRecords.count({
        where: {
          habit_id: habitId,
          date: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
      });
  
      res.status(200).json({
        totalDays,
        completedDays,
        completionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao calcular desempenho do hábito", details: error });
    }
  };
  
  export const checkHabitStatusForDay = async (req: any, res: any) => {
    const { habitId } = req.params; // ID do hábito
    const { date } = req.query; // Data passada como parâmetro na query (ex.: 2024-12-27)
  console.log("habitId", habitId);
    console.log("date", new Date(date));
    try {
      // Buscar o registro para o hábito na data fornecida
      const habitRecord = await prisma.habitRecords.findMany({
        where: {
          habit_id: habitId,
          date: new Date(date), // Garantir que a data esteja no formato correto
        },
      });
      console.log("habitRecord", habitRecord);
  
      if (habitRecord) {
        res.status(200).json(
           habitRecord,
          
        );
      } else {
        res.status(404).json({
          status: "not_found",
          message: `Nenhum registro encontrado para o hábito no dia ${date}.`,
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao verificar o status do hábito", details: error });
    }
  };