'use server';

import { LoginSchema } from '@/schemas';
import { z } from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  return { message: 'Email sent' };
};
