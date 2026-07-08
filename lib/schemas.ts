import { z } from 'zod';

export const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  body: z.string().min(1, 'Body is required'),
  category: z.enum(['Exam', 'Event', 'General']),
  priority: z.enum(['Normal', 'Urgent']),
  publishDate: z.string().min(1, 'Publish date is required'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type NoticeFormValues = z.infer<typeof noticeSchema>;
