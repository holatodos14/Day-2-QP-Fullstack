import pool from '../config/config.js';
import { generateToken, verifyToken } from '../utils/jwtUtils.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      const token = generateToken({ userId: rows[0].id, username: rows[0].username });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verify = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const result = verifyToken(token);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }
  
  res.status(200).json({ message: 'Token is valid', userId: result.decoded.userId });
};