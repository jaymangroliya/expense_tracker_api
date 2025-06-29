import { Router, Request, Response } from 'express';
import Expense from '../models/Expense';
import { requireRole } from '../middleware/role.middleware';
import { createExpenseSchema, updateExpenseStatusSchema } from '../validations/expense.validation';

const router = Router();

//----------------------------------------------
// POST /api/expenses → Create a new expense
//----------------------------------------------
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

//------------------------------------------------
// GET /api/expenses → Get expenses (self or all)
//------------------------------------------------
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { role, userId } = req.query;

  // Restrict by userId if role is not admin
  const filter = role === 'admin' ? {} : { userId };

  try {
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//-------------------------------------------------------
// PATCH /api/expenses/:id → Approve or Reject expense
//-------------------------------------------------------
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateExpenseStatusSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: 'Invalid status value', details: error.details });
    return;
  }

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: value.status },
      { new: true }
    );

    if (!updatedExpense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error('Error updating expense status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//------------------------------------------------------
// GET /api/expenses/analytics → Expenses per category
//------------------------------------------------------
router.get('/analytics', async (req: Request, res: Response): Promise<void> => {
  const { userId, role } = req.query;

  if (!userId) {
    res.status(403).json({ message: 'Missing userId token' });
    return;
  }

  const matchFilter = role === 'admin' ? {} : { userId };

  try {
    const result = await Expense.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;