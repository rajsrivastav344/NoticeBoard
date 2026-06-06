// pages/api/notices/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateNotice } from "@/lib/validate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid notice ID." });
  }

  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) return res.status(404).json({ error: "Notice not found." });
      return res.status(200).json(notice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch notice." });
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    const errors = validateNotice({ title, body, category, priority, publishDate });
    if (errors.length > 0) {
      return res.status(422).json({ errors });
    }

    try {
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Notice not found." });

      const updated = await prisma.notice.update({
        where: { id },
        data: {
          title: (title as string).trim(),
          body: (body as string).trim(),
          category: (category ?? "General") as "Exam" | "Event" | "General",
          priority: (priority ?? "Normal") as "Normal" | "Urgent",
          publishDate: new Date(publishDate as string),
          imageUrl: imageUrl ? (imageUrl as string).trim() : null,
        },
      });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update notice." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Notice not found." });

      await prisma.notice.delete({ where: { id } });
      return res.status(200).json({ message: "Notice deleted successfully." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete notice." });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
}