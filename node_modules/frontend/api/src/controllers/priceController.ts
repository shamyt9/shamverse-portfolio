import { Request, Response } from 'express';
import Price from '../models/Price';

export const getPrices = async (req: Request, res: Response) => {
  try {
    const prices = await Price.find({});
    res.json(prices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPrice = async (req: Request, res: Response) => {
  try {
    const price = new Price(req.body);
    const createdPrice = await price.save();
    res.status(201).json(createdPrice);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePrice = async (req: Request, res: Response) => {
  try {
    const price = await Price.findById(req.params.id);
    if (price) {
      Object.assign(price, req.body);
      const updatedPrice = await price.save();
      res.json(updatedPrice);
    } else {
      res.status(404).json({ message: 'Price not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePrice = async (req: Request, res: Response) => {
  try {
    const price = await Price.findById(req.params.id);
    if (price) {
      await price.deleteOne();
      res.json({ message: 'Price removed' });
    } else {
      res.status(404).json({ message: 'Price not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
