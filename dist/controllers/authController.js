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
exports.loginWithGoogle = void 0;
const google_auth_library_1 = require("google-auth-library");
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const client = new google_auth_library_1.OAuth2Client("556945227592-6adta6gbk4lt686ko9392a8kk1clmn5e.apps.googleusercontent.com");
const prisma = new client_1.PrismaClient();
const loginWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    if (!idToken) {
        res.status(400).json({ error: "Token não fornecido" });
        return;
    }
    try {
        // Validar o token com o Google
        const ticket = yield client.verifyIdToken({
            idToken,
            audience: "556945227592-6adta6gbk4lt686ko9392a8kk1clmn5e.apps.googleusercontent.com",
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
        let user = yield prisma.users.findUnique({
            where: {
                email,
            },
        });
        if (user) {
            user = yield prisma.users.update({
                where: {
                    email,
                },
                data: {
                    googleId,
                    profilePic: picture,
                },
            });
        }
        else {
            user = yield prisma.users.create({
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
            yield prisma.financialCategories.createMany({
                data: defaultCategories.map((name) => ({
                    name,
                    user_id: user === null || user === void 0 ? void 0 : user.id,
                })),
            });
        }
        console.log("Usuário logado com sucesso:", user);
        // Gerar JWT
        const token = (0, jwt_1.generateJwt)({ id: user.id, email: user.email });
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePic: user.profilePic,
            },
        });
    }
    catch (error) {
        console.error("Erro ao validar token:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});
exports.loginWithGoogle = loginWithGoogle;
