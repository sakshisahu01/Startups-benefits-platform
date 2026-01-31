import { Router, Request, Response } from 'express';
import { Deal } from '../models/Deal.js';
import { sendError } from '../utils/errors.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { search, category, accessLevel } = req.query;
  const filter: Record<string, unknown> = { isActive: true };

  if (typeof category === 'string' && category.trim()) {
    filter.category = category.trim();
  }
  if (typeof accessLevel === 'string' && (accessLevel === 'public' || accessLevel === 'locked')) {
    filter.accessLevel = accessLevel;
  }
  if (typeof search === 'string' && search.trim()) {
    const term = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
    ];
  }

  const deals = await Deal.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ deals, total: deals.length });
});

router.get('/:slugOrId', async (req: Request, res: Response): Promise<void> => {
  const { slugOrId } = req.params;
  const isId = /^[a-f\d]{24}$/i.test(slugOrId);
  const deal = isId
    ? await Deal.findOne({ _id: slugOrId, isActive: true }).lean()
    : await Deal.findOne({ slug: slugOrId, isActive: true }).lean();

  if (!deal) {
    sendError(res, 'NOT_FOUND', 'Deal not found', 404);
    return;
  }
  res.json(deal);
});

export default router;
