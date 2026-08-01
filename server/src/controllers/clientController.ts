import { Request, Response } from 'express';
import Client from '../models/Client';

export const getClients = async (req: Request, res: Response) => {
  try {
    const filter: any = { companyId: req.user?.companyId };

    const clients = await Client.find(filter).sort({ createdAt: -1 });
    return res.json(clients);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching clients', error: (error as Error).message });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, companyName, email, phone } = req.body;

    const companyId = req.user?.companyId;

    if (!name || !companyName || !email) {
      return res.status(400).json({ message: 'Client name, company name, and email are required' });
    }

    const client = new Client({ companyId, name, companyName, email, phone: phone || '' });
    await client.save();

    return res.status(201).json(client);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating client', error: (error as Error).message });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (req.user?.companyId?.toString() !== client.companyId.toString()) {
      return res.status(403).json({ message: 'Unauthorized client edit' });
    }

    const updated = await Client.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating client', error: (error as Error).message });
  }
};
