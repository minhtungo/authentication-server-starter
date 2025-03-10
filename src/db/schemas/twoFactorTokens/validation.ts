import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { twoFactorTokens } from "./twoFactorTokens";

export const insertTwoFactorTokenSchema = createInsertSchema(twoFactorTokens);
export const TwoFactorTokenSchema = createSelectSchema(twoFactorTokens);

export type InsertTwoFactorToken = typeof twoFactorTokens.$inferInsert;
export type TwoFactorToken = typeof twoFactorTokens.$inferSelect;
