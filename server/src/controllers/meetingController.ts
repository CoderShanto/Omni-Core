import { Request, Response } from 'express';
import Meeting from '../models/Meeting';

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if (req.user?.role !== 'Super Admin') {
      if (!req.user?.companyId) return res.json([]);
      filter.companyId = req.user.companyId;
    }

    const { projectId } = req.query;
    if (projectId) filter.projectId = projectId;

    const meetings = await Meeting.find(filter)
      .populate('projectId', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json(meetings);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching meetings', error: (error as Error).message });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const { title, summary, actionItems, projectId } = req.body;

    const companyId = req.user?.role === 'Super Admin' ? req.body.companyId : req.user?.companyId;
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    if (!title || !summary) {
      return res.status(400).json({ message: 'Meeting title and summary are required' });
    }

    const meeting = new Meeting({
      companyId,
      title,
      summary,
      actionItems: actionItems || [],
      projectId: projectId || null,
      createdBy: req.user?.userId
    });

    await meeting.save();
    return res.status(201).json(meeting);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating meeting record', error: (error as Error).message });
  }
};

export const toggleActionItem = async (req: Request, res: Response) => {
  try {
    const { id, itemIndex } = req.params;
    const meeting = await Meeting.findById(id);

    if (!meeting) return res.status(404).json({ message: 'Meeting record not found' });

    if (req.user?.role !== 'Super Admin' && req.user?.companyId?.toString() !== meeting.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const idx = parseInt(itemIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= meeting.actionItems.length) {
      return res.status(400).json({ message: 'Invalid action item index' });
    }

    meeting.actionItems[idx].completed = !meeting.actionItems[idx].completed;
    await meeting.save();

    return res.json(meeting);
  } catch (error) {
    return res.status(500).json({ message: 'Error toggling action item', error: (error as Error).message });
  }
};
