import { Router, Request, Response } from 'express';
import User, { IUser } from '../models/User';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: 'Name and password are required.' });
    return;
  }

  try {
    const user = await User.findOne({ name }).lean(); // ✅ Use .lean() to get plain object

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    res.status(200).json({
      userId: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;