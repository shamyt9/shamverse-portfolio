import express from 'express';
import { getPrices, createPrice, updatePrice, deletePrice } from '../controllers/priceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getPrices)
  .post(protect, createPrice);

router.route('/:id')
  .put(protect, updatePrice)
  .delete(protect, deletePrice);

export default router;
