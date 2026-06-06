// components/NoticeCard.tsx
import { Notice } from "@/types/notice";

interface Props {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (id: number) => void;
}

const categoryColors: Record<string, string> = {
  Exam: "bg-amber-100 text-amber-800 border-amber-200",
  Event: "bg-sky-100 text-sky-800 border-sky-200",
  General: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function NoticeCard({ notice, onEdit, onDelete }: Props) {
  const isUrgent = notice.priority === "Urgent";
  const dateStr = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        isUrgent ? "border-red-300 ring-1 ring-red-200" : "border-slate-200"
      }`}
    >
      {/* Urgent top stripe */}
      {isUrgent && <div className="h-1 bg-gradient-to-r from-red-500 to-rose-400" />}

      {/* Image */}
      {notice.imageUrl && (
        <div className="relative w-full h-40 overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={notice.imageUrl}
            alt={notice.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-5">
        {/* Top row: category + priority badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColors[notice.category]}`}
          >
            {notice.category}
          </span>
          {isUrgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Urgent
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-slate-900 leading-snug mb-2 line-clamp-2">
          {notice.title}
        </h2>

        {/* Body */}
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">{notice.body}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dateStr}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(notice)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(notice.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
