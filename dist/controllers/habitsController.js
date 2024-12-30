"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHabitStatusForDay = exports.getHabitPerformanceSummary = exports.getDailyHabitProgress = exports.markHabitDailyProgress = exports.deleteHabit = exports.getHabits = exports.updateHabitDays = exports.createHabit = void 0;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Criar um hábito com dias específicos
const createHabit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, days } = req.body;
    const user = yield prisma.users.findUnique({
        where: {
            email: req.user.email,
        },
    });
    const userId = user.id;
    try {
        const habit = yield prisma.habits.create({
            data: {
                user_id: userId,
                name,
                description,
                habitDays: {
                    create: days.map((day) => ({ day })),
                },
            },
            include: { habitDays: true },
        });
        res.status(201).json(habit);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.createHabit = createHabit;
// Atualizar dias de um hábito
const updateHabitDays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { habitId } = req.params;
    const { days } = req.body;
    try {
        // Remover os dias existentes
        yield prisma.habitDays.deleteMany({
            where: { habit_id: habitId },
        });
        // Adicionar os novos dias
        const updatedDays = yield prisma.habitDays.createMany({
            data: days.map((day) => ({
                habit_id: habitId,
                day,
            })),
        });
        res.status(200).json({ message: 'Dias atualizados com sucesso', updatedDays });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.updateHabitDays = updateHabitDays;
// Listar hábitos de um usuário com seus dias
const getHabits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const habits = yield prisma.habits.findMany({
            where: { user_id: userId },
            include: { habitDays: true },
        });
        res.status(200).json(habits);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.getHabits = getHabits;
// Deletar um hábito
const deleteHabit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { habitId } = req.params;
    try {
        yield prisma.habits.delete({
            where: { id: habitId },
        });
        res.status(200).json({ message: 'Hábito deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.deleteHabit = deleteHabit;
// Registrar a conclusão de um hábito
// Registrar ou atualizar o progresso diário de um hábito
const markHabitDailyProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { habitId } = req.params;
    const { date, status } = req.body;
    try {
        // Verifica se já existe um registro para o dia
        const existingRecord = yield prisma.habitRecords.findFirst({
            where: {
                habit_id: habitId,
                date: new Date(date),
            },
        });
        let habitRecord;
        if (existingRecord) {
            // Atualiza o registro existente
            habitRecord = yield prisma.habitRecords.update({
                where: { id: existingRecord.id },
                data: { status },
            });
        }
        else {
            // Cria um novo registro para o dia
            habitRecord = yield prisma.habitRecords.create({
                data: {
                    habit_id: habitId,
                    date: new Date(date),
                    status: status || "completed", // "completed" por padrão
                },
            });
        }
        res.status(200).json({ message: "Progresso registrado com sucesso", habitRecord });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao registrar progresso diário", details: error });
    }
});
exports.markHabitDailyProgress = markHabitDailyProgress;
// Obter progresso diário do hábito
const getDailyHabitProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { habitId } = req.params;
    const { startDate, endDate } = req.query;
    try {
        const progress = yield prisma.habitRecords.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar progresso diário", details: error });
    }
});
exports.getDailyHabitProgress = getDailyHabitProgress;
// Resumo do desempenho do hábito (Ex.: frequência mensal)
const getHabitPerformanceSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { habitId } = req.params;
    const { startDate, endDate } = req.query;
    try {
        const completedDays = yield prisma.habitRecords.count({
            where: {
                habit_id: habitId,
                status: "completed",
                date: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
        });
        const totalDays = yield prisma.habitRecords.count({
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
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao calcular desempenho do hábito", details: error });
    }
});
exports.getHabitPerformanceSummary = getHabitPerformanceSummary;
const checkHabitStatusForDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { habitId } = req.params; // ID do hábito
    const { date } = req.query; // Data passada como parâmetro na query (ex.: 2024-12-27)
    console.log("habitId", habitId);
    console.log("date", new Date(date));
    try {
        // Buscar o registro para o hábito na data fornecida
        const habitRecord = yield prisma.habitRecords.findMany({
            where: {
                habit_id: habitId,
                date: new Date(date), // Garantir que a data esteja no formato correto
            },
        });
        console.log("habitRecord", habitRecord);
        if (habitRecord) {
            res.status(200).json(habitRecord);
        }
        else {
            res.status(404).json({
                status: "not_found",
                message: `Nenhum registro encontrado para o hábito no dia ${date}.`,
            });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao verificar o status do hábito", details: error });
    }
});
exports.checkHabitStatusForDay = checkHabitStatusForDay;
