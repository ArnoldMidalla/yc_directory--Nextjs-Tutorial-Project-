import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(10),
  image: z
    .string()
    .url()
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }),
    pitch: z.string().min(0)
});
