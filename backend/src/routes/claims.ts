import { Router, Response } from 'express';
import { Deal } from '../models/Deal.js';
import { Claim } from '../models/Claim.js';
import { sendError } from '../utils/errors.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/deals/:dealId/claim', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { dealId } = req.params;
  const userId = req.user!.id;

  const deal = await Deal.findOne({ _id: dealId, isActive: true });
  if (!deal) {
    sendError(res, 'NOT_FOUND', 'Deal not found', 404);
    return;
  }

  if (deal.accessLevel === 'locked' && !req.user!.isVerified) {
    sendError(res, 'FORBIDDEN', 'Verification required to claim this deal', 403);
    return;
  }

  const existing = await Claim.findOne({ userId, dealId: deal._id });
  if (existing) {
    sendError(res, 'CONFLICT', 'You have already claimed this deal', 409);
    return;
  }

  const claim = await Claim.create({
    userId,
    dealId: deal._id,
    status: 'pending',
  });
  const claimObj = claim.toObject();
  res.status(201).json({
    claim: {
      id: claimObj._id,
      dealId: claimObj.dealId,
      userId: claimObj.userId,
      status: claimObj.status,
      createdAt: claimObj.createdAt,
    },
  });
});

router.get('/me/claims', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const claims = await Claim.find({ userId })
    .populate('dealId', 'title slug description category accessLevel partnerName partnerLogoUrl')
    .sort({ createdAt: -1 })
    .lean();

  const items = claims.map((c) => ({
    id: c._id,
    status: c.status,
    createdAt: c.createdAt,
    deal: c.dealId,
  }));
  res.json({ claims: items });
});

export default router;
