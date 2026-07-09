import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { noticeSchema } from '@/lib/schemas';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Urgent notices appear above all Normal notices regardless of date
      // Prisma orderBy allows multiple fields
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' }, // 'Urgent' > 'Normal' in alphabetical sorting? Wait, 'Urgent' is after 'Normal' alphabetically, so 'desc' puts 'Urgent' first.
          { publishDate: 'desc' }, // Then by date, newest first
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Server-side validation
      const data = noticeSchema.parse(req.body);

      const newNotice = await prisma.notice.create({
        data: {
          title: data.title,
          body: data.body,
          category: data.category,
          priority: data.priority,
          publishDate: data.publishDate,
          image: data.image || null, // convert empty string to null if needed, but schema allows optional string
        },
      });

      return res.status(201).json(newNotice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.format() });
      }
      console.error('Error creating notice:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
