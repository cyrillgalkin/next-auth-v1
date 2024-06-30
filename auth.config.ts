import CredentialsProvider from 'next-auth/providers/credentials';

import { type NextAuthConfig } from 'next-auth';
import { LoginSchema } from './schemas';
import { ZodError } from 'zod';
import { getUserByEmail } from './data/user';
import bcrypt from 'bcryptjs';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const validatedFields = await LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }

          const isPasswordsMatched = await bcrypt.compare(
            password,
            user.password,
          );

          if (isPasswordsMatched) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
