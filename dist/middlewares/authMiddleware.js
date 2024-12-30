"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: "Token não fornecido" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyJwt)(token);
        if (!decoded) {
            res.status(401).json({ error: "Token inválido ou expirado" });
            return;
        }
        // Anexar o usuário ao objeto da requisição
        req.user = decoded;
        next(); // Prosseguir para o próximo middleware ou rota
    }
    catch (error) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};
exports.authenticate = authenticate;
