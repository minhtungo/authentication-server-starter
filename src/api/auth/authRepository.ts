import { config } from "@/common/config/appConfig";
import { hashPassword } from "@/common/utils/password";
import { generateToken } from "@/common/utils/token";
import { db } from "@/db";
import { userSettings, verificationTokens } from "@/db/schemas";
import { type InsertUser, type User, users } from "@/db/schemas/users";
import { eq } from "drizzle-orm";

export class AuthRepository {
  async getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user;
  }

  async getVerificationTokenByUserId(userId: string) {
    const token = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.userId, userId),
    });

    return token;
  }

  async deleteVerificationTokenByToken(token: string, trx: typeof db = db) {
    await trx.delete(verificationTokens).where(eq(verificationTokens.token, token));
  }

  async createVerificationEmailToken(userId: string, trx: typeof db = db) {
    const token = await generateToken(config.verificationEmailToken.length);
    const expires = new Date(Date.now() + config.verificationEmailToken.maxAge);

    await trx
      .insert(verificationTokens)
      .values({
        userId,
        token,
        expires,
      })
      .onConflictDoUpdate({
        target: verificationTokens.id,
        set: {
          token,
          expires,
        },
      });

    return token;
  }

  async createUser(user: InsertUser, trx: typeof db = db): Promise<User | null> {
    const { password: plainPassword, ...userData } = user;

    const password = plainPassword ? await hashPassword(plainPassword) : undefined;

    const [newUser] = await trx
      .insert(users)
      .values({ ...userData, password })
      .returning();

    if (!newUser) {
      throw new Error("User not created");
    }

    // Create default user settings
    await trx.insert(userSettings).values({
      userId: newUser.id,
      // Add any default settings here
    });

    return newUser;
  }
}
