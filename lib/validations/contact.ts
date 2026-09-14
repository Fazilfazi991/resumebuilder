import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100, "Name is too long."),
  email: z.email("Enter a valid email address.").max(254),
  subject: z.string().trim().min(3, "Enter a subject.").max(160, "Subject is too long."),
  message: z.string().trim().min(10, "Please add a little more detail.").max(5000, "Message must be 5,000 characters or fewer."),
  website: z.string().max(0),
});
