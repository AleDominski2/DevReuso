import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function authenticateToken(req, res, next) {
  // Espera token no header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });

    // Salva dados do usuário decodificado na requisição para usar depois
    req.user = user;

    next();
  });
}
