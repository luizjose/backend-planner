import jwt from "jsonwebtoken";

const JWT_SECRET = "SEGREDO_SUPER_SEGURO";

export const generateJwt = (user: { id: string; email: string }) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "15d",
  });
};

export const verifyJwt = (
  token: string
): { id: string; email: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    return null;
  }
};
