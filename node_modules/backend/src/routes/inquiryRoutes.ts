import express from 'express';
import { getInquiries, createInquiry, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getInquiries)
  .post(createInquiry);

router.route('/:id')
  .put(protect, updateInquiryStatus)
  .delete(protect, deleteInquiry);

export default router;
