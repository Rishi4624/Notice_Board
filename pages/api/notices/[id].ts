import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { noticeSchema } from '@/lib/schemas';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid notice ID' });
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      // Server-side validation
      const data = noticeSchema.parse(req.body);

      const updatedNotice = await prisma.notice.update({
        where: { id },
        data: {
          title: data.title,
          body: data.body,
          category: data.category,
          priority: data.priority,
          publishDate: data.publishDate,
          image: data.image || null,
        },
      });

      return res.status(200).json(updatedNotice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.format() });
      }
      console.error('Error updating notice:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({
        where: { id },
      });

      return res.status(204).end(); // No content
    } catch (error) {
      console.error('Error deleting notice:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['PUT', 'PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
