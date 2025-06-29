import { Request, Response, NextFunction } from 'express';

export const requireRole = (requiredRole: 'admin' | 'employee') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.query.role;
    if (role !== requiredRole) {
      res.status(403).json({ message: 'Access denied: insufficient role' });
      return;
    }
    next();
  };
};

