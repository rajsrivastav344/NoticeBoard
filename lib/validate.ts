// lib/validate.ts

export interface NoticeInput {
  title?: unknown;
  body?: unknown;
  category?: unknown;
  priority?: unknown;
  publishDate?: unknown;
  imageUrl?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

const VALID_CATEGORIES = ["Exam", "Event", "General"] as const;
const VALID_PRIORITIES = ["Normal", "Urgent"] as const;

export function validateNotice(data: NoticeInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // title
  if (!data.title || typeof data.title !== "string" || data.title.trim() === "") {
    errors.push({ field: "title", message: "Title is required." });
  } else if (data.title.trim().length > 255) {
    errors.push({ field: "title", message: "Title must be 255 characters or fewer." });
  }

  // body
  if (!data.body || typeof data.body !== "string" || data.body.trim() === "") {
    errors.push({ field: "body", message: "Body is required." });
  }

  // category
  if (data.category !== undefined && !VALID_CATEGORIES.includes(data.category as typeof VALID_CATEGORIES[number])) {
    errors.push({ field: "category", message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}.` });
  }

  // priority
  if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority as typeof VALID_PRIORITIES[number])) {
    errors.push({ field: "priority", message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}.` });
  }

  // publishDate
  if (!data.publishDate || typeof data.publishDate !== "string" || data.publishDate.trim() === "") {
    errors.push({ field: "publishDate", message: "Publish date is required." });
  } else {
    const d = new Date(data.publishDate as string);
    if (isNaN(d.getTime())) {
      errors.push({ field: "publishDate", message: "Publish date must be a valid date." });
    }
  }

  return errors;
}
