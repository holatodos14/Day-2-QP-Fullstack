import { verifyToken as jwtVerify } from '../utils/jwtUtils.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const result = jwtVerify(token);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  req.user = result.decoded;
  next();
};