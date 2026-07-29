import { Request, Response } from 'express';
import Note from '../models/Note';

export const getNotes = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if (req.user?.role !== 'Super Admin') {
      if (!req.user?.companyId) return res.json([]);
      filter.companyId = req.user.companyId;
    }

    const notes = await Note.find(filter)
      .populate('authorId', 'name email role')
      .sort({ createdAt: -1 });

    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notes', error: (error as Error).message });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;

    const companyId = req.user?.role === 'Super Admin' ? req.body.companyId : req.user?.companyId;
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Note title and content are required' });
    }

    const note = new Note({
      companyId,
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      authorId: req.user?.userId
    });

    await note.save();
    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating note', error: (error as Error).message });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (req.user?.role !== 'Super Admin' && req.user?.companyId?.toString() !== note.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized note deletion' });
    }

    await Note.findByIdAndDelete(id);
    return res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting note', error: (error as Error).message });
  }
};
