// pages/index.tsx
import { useState, useCallback } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Notice } from "@/types/notice";
import NoticeCard from "@/components/NoticeCard";
import NoticeForm from "@/components/NoticeForm";
import ConfirmModal from "@/components/ConfirmModal";

interface Props {
  initialNotices: Notice[];
}

export default function Home({ initialNotices }: Props) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      setNotices(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = (notice: Notice) => {
    setEditTarget(notice);
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTarget(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await fetch(`/api/notices/${deleteTarget}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchNotices();
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditTarget(null);
    fetchNotices();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const filtered = filterCategory === "All"
    ? notices
    : notices.filter((n) => n.category === filterCategory);

  const urgentCount = notices.filter((n) => n.priority === "Urgent").length;

  return (
    <>
      <Head>
        <title>Notice Board · Reno Platforms</title>
        <meta name="description" content="Official notice board for announcements, exams and events." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">Notice Board</h1>
                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Reno Platforms</p>
              </div>
              {urgentCount > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {urgentCount} Urgent
                </span>
              )}
            </div>
            <button
              onClick={() => { setEditTarget(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Notice</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

        {/* Filter bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "General", "Exam", "Event"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  filterCategory === cat
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400">
              {filtered.length} notice{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 h-52 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No notices found</p>
              <p className="text-sm text-slate-400 mt-1">
                {filterCategory !== "All" ? "Try a different filter or " : ""}
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true); }}
                  className="text-indigo-600 hover:underline"
                >
                  add a new notice
                </button>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showForm && (
        <NoticeForm
          initial={editTarget}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {deleteTarget !== null && (
        <ConfirmModal
          title="Delete notice?"
          message="This action cannot be undone. The notice will be permanently removed."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
};
