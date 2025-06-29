import { Router, Request, Response } from 'express';
import Expense from '../models/Expense';
import { requireRole } from '../middleware/role.middleware';
import { createExpenseSchema, updateExpenseStatusSchema } from '../validations/expense.validation';
import mongoose from 'mongoose';

const router = Router();

//--------------------------------------------------------------
// POST /api/expenses → Create a new expense (Employee only)
//--------------------------------------------------------------
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createExpenseSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: 'Validation failed', details: error.details });
    return;
  }

  try {
    const expense = await Expense.create(value);
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//--------------------------------------------------------------
// GET /api/expenses → Get expenses (Admin gets all, Employee gets own)
//--------------------------------------------------------------
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { role, userId } = req.query;

  const filter = role === 'admin' ? {} : { userId };

  try {
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//--------------------------------------------------------------
// PATCH /api/expenses/:id → Approve/Reject expense (Admin only)
//--------------------------------------------------------------
router.patch('/:id', requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400).json({ message: 'Invalid status value' });
    return;
  }

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedExpense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: 'Failed to update expense status' });
  }
});

//------------------------------------------------------------------
// GET /api/expenses/analytics → Grouped expenses by category (Admin only)
//------------------------------------------------------------------
router.get('/analytics', async (req: Request, res: Response): Promise<void> => {
  const { userId, role } = req.query;

  if (!userId) {
    res.status(403).json({ message: 'Missing userId token' });
    return;
  }

  let matchFilter: any;

  try {
    matchFilter = role === 'admin' ? {} : { userId: new mongoose.Types.ObjectId(userId as string) };
  } catch (err) {
    res.status(400).json({ message: 'Invalid userId format' });
    return;
  }

  try {
    const result = await Expense.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error('Error generating analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;