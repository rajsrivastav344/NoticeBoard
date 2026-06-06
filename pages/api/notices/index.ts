// pages/api/notices/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateNotice } from "@/lib/validate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          // Urgent first (database-level ordering)
          { priority: "desc" },
          { publishDate: "desc" },
        ],
      });
      return res.status(200).json(notices);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch notices." });
    }
  }

  if (req.method === "POST") {
    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    const errors = validateNotice({ title, body, category, priority, publishDate });
    if (errors.length > 0) {
      return res.status(422).json({ errors });
    }

    try {
      const notice = await prisma.notice.create({
        data: {
          title: (title as string).trim(),
          body: (body as string).trim(),
          category: (category ?? "General") as "Exam" | "Event" | "General",
          priority: (priority ?? "Normal") as "Normal" | "Urgent",
          publishDate: new Date(publishDate as string),
          imageUrl: imageUrl ? (imageUrl as string).trim() : null,
        },
      });
      return res.status(201).json(notice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create notice." });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
}