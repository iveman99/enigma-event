import { z } from "zod";

const name = z.string().trim().min(1, "Please enter your first and last name.").max(80);
export const emailSchema = z.string().trim().pipe(z.email("Please enter a valid email address.").max(254)).transform((value) => value.toLowerCase());
export const phoneSchema = z.string().trim().max(30).transform((value) => {
  const digits = value.replace(/[\s()-]/g, "");
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : digits;
}).pipe(z.string().regex(/^\+[1-9]\d{7,14}$/, "Enter a valid phone number, including the country code."));

export const basicProfileSchema = z.object({
  firstName: name,
  lastName: name,
  phone: phoneSchema,
});

export const requestOtpSchema = z.discriminatedUnion("mode", [
  basicProfileSchema.extend({ mode: z.literal("signup"), email: emailSchema }),
  z.object({ mode: z.literal("signin"), email: emailSchema }),
]);

export const verifyOtpSchema = z.object({
  email: emailSchema,
  token: z.string().regex(/^\d{6}$/, "Enter the six-digit code from your email."),
});

export const profileSchema = basicProfileSchema.extend({
  college: z.string().trim().max(200).optional(),
  course: z.string().trim().max(120).optional(),
  year: z.string().trim().max(80).optional(),
  prn: z.string().trim().max(80).optional(),
}).strict();

export type ProfileInput = z.infer<typeof profileSchema>;
