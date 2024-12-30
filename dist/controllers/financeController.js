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
exports.getFinRecordsByMonthYearController = exports.getFinRecordsController = exports.createFinRecordsController = exports.editFinCategoriesController = exports.getFinCategoriesController = exports.createFinCategoriesController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createFinCategoriesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = req.body;
    if (!req.user) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
    }
    try {
        const record = yield prisma.financialCategories.create({
            data: {
                name,
                user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        res.status(201).json(record);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno no servidor" });
        return;
    }
});
exports.createFinCategoriesController = createFinCategoriesController;
const getFinCategoriesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
    }
    try {
        const records = yield prisma.financialCategories.findMany({
            where: {
                user_id: req.user.id,
            },
        });
        res.status(200).json(records);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});
exports.getFinCategoriesController = getFinCategoriesController;
const editFinCategoriesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    console.log(req.body);
    if (!req.user) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
    }
    try {
        const record = yield prisma.financialCategories.update({
            where: {
                id: id,
            },
            data: {
                name,
            },
        });
        res.status(200).json(record);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});
exports.editFinCategoriesController = editFinCategoriesController;
const createFinRecordsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name, amount, type_id, category_id, date } = req.body;
    if (!req.user) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
    }
    const formattedDate = new Date(date);
    try {
        const record = yield prisma.financialRecords.create({
            data: {
                name,
                amount,
                type_id,
                category_id,
                date: formattedDate,
                description: "",
                user_id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        res.status(201).json(record);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno no servidor" });
        return;
    }
});
exports.createFinRecordsController = createFinRecordsController;
const getFinRecordsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
    }
    try {
        const records = yield prisma.financialRecords.findMany({
            where: {
                user_id: req.user.id,
            },
            include: {
                category: true,
                type: true
            }
        });
        res.status(200).json(records);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});
exports.getFinRecordsController = getFinRecordsController;
const getFinRecordsByMonthYearController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);
    if (isNaN(monthInt) || isNaN(yearInt)) {
        res
            .status(400)
            .json({ error: "Os parâmetros 'month' e 'year' devem ser números válidos." });
        return;
    }
    try {
        const startDate = new Date(yearInt, monthInt - 1, 1); // Primeiro dia do mês
        const endDate = new Date(yearInt, monthInt, 0); // Último dia do mês
        const records = yield prisma.financialRecords.findMany({
            where: {
                user_id: req.user.id,
                date: {
                    gte: startDate,
                    lte: endDate, // Data menor ou igual ao final do mês
                },
            },
            include: {
                category: true,
                type: true,
            },
        });
        res.status(200).json(records);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});
exports.getFinRecordsByMonthYearController = getFinRecordsByMonthYearController;
