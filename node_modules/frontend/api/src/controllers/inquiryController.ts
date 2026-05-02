import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = new Inquiry(req.body);
    const createdInquiry = await inquiry.save();
    res.status(201).json(createdInquiry);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
      inquiry.status = req.body.status || 'read';
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
      await inquiry.deleteOne();
      res.json({ message: 'Inquiry removed' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
