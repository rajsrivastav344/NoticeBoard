// components/NoticeForm.tsx
import { useState, useEffect } from "react";
import { Notice, NoticeFormData } from "@/types/notice";

interface Props {
  initial?: Notice | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const empty: NoticeFormData = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: new Date().toISOString().slice(0, 10),
  imageUrl: "",
};

export default function NoticeForm({ initial, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<NoticeFormData>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        body: initial.body,
        category: initial.category,
        priority: initial.priority,
        publishDate: initial.publishDate.slice(0, 10),
        imageUrl: initial.imageUrl ?? "",
      });
    } else {
      setForm(empty);
    }
    setErrors({});
    setServerError("");
  }, [initial]);

  const set = (field: keyof NoticeFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");

    const payload = {
      ...form,
      imageUrl: form.imageUrl?.trim() || undefined,
    };

    const url = initial ? `/api/notices/${initial.id}` : "/api/notices";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const map: Record<string, string> = {};
          for (const err of data.errors) map[err.field] = err.message;
          setErrors(map);
        } else {
          setServerError(data.error || "Something went wrong.");
        }
        return;
      }

      onSuccess();
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? "border-red-300 focus:ring-red-200"
        : "border-slate-200 focus:ring-indigo-200 focus:border-indigo-400"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            {initial ? "Edit Notice" : "New Notice"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {serverError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls("title")}
              placeholder="Notice title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Body <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className={inputCls("body") + " resize-none"}
              placeholder="Notice content..."
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
            />
            {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
              <select
                className={inputCls("category")}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Priority</label>
              <select
                className={inputCls("priority")}
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Publish date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Publish Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={inputCls("publishDate")}
              value={form.publishDate}
              onChange={(e) => set("publishDate", e.target.value)}
            />
            {errors.publishDate && <p className="mt-1 text-xs text-red-600">{errors.publishDate}</p>}
          </div>

          {/* Image URL (bonus) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Image URL{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              className={inputCls("imageUrl")}
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
            >
              {submitting ? "Saving…" : initial ? "Save Changes" : "Create Notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
