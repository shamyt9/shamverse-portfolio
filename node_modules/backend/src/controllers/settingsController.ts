import { Request, Response } from 'express';
import Settings from '../models/Settings';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({
        heroTitle: 'Welcome to ShamVerse',
        heroSubtitle: 'Full Stack Developer',
        bio: 'Building amazing web experiences.',
      });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { _id, ...updateData } = req.body;
    let settings = await Settings.findOne({});
    if (settings) {
      Object.assign(settings, updateData);
      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      const newSettings = await Settings.create(updateData);
      res.status(201).json(newSettings);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
