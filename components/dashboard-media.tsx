"use client";

import { useId, useRef, useState } from "react";
import {
  Check,
  CloudUpload,
  Copy,
  ExternalLink,
  FileCode,
  FileIcon,
  FileImage,
  FileText,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import type { ProjectMedia } from "@/lib/project-types";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function CategoryIcon({ category }: { category: ProjectMedia["category"] }) {
  switch (category) {
    case "logo":
      return <FileCode className="h-4 w-4 text-amber-600" />;
    case "image":
      return <FileImage className="h-4 w-4 text-emerald-600" />;
    case "document":
      return <FileText className="h-4 w-4 text-blue-600" />;
    default:
      return <FileIcon className="h-4 w-4 text-muted" />;
  }
}

export function DashboardMedia({
  initialMedia = [],
  projectId,
  isAdmin = false,
}: {
  initialMedia?: ProjectMedia[];
  projectId?: string;
  isAdmin?: boolean;
}) {
  const [mediaList, setMediaList] = useState<ProjectMedia[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "logo" | "image" | "document">("all");
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const filteredMedia =
    filter === "all" ? mediaList : mediaList.filter((item) => item.category === filter);

  async function handleUpload(files: FileList | File[]) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const endpoint =
      isAdmin && projectId
        ? `/api/dashboard/media?projectId=${encodeURIComponent(projectId)}`
        : "/api/dashboard/media";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 25 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 25 MB limit.`);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        const data = await res.json().catch(() => null);

        if (res.ok && data?.ok && data?.media) {
          setMediaList((prev) => [data.media, ...prev]);
        } else {
          setError(data?.error || `Failed to upload "${file.name}".`);
        }
      } catch {
        setError(`Network error uploading "${file.name}".`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this file?")) return;

    const endpoint =
      isAdmin && projectId
        ? `/api/dashboard/media?projectId=${encodeURIComponent(projectId)}&id=${encodeURIComponent(id)}`
        : `/api/dashboard/media?id=${encodeURIComponent(id)}`;

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setMediaList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data?.error || "Could not delete this file.");
      }
    } catch {
      alert("Network error deleting file.");
    }
  }

  async function copyUrl(id: string, url: string) {
    try {
      const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Drag & Drop Surface */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files) {
            void handleUpload(e.dataTransfer.files);
          }
        }}
        className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
          isDragOver
            ? "border-ink bg-mist/80 scale-[1.005]"
            : "border-line bg-paper/60 hover:border-line-strong hover:bg-mist/30"
        }`}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          multiple
          accept="image/*,.svg,.pdf,.docx,.txt"
          onChange={(e) => {
            if (e.target.files) void handleUpload(e.target.files);
          }}
          className="sr-only"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist border border-line text-ink mb-3 shadow-xs">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-ink" />
            ) : (
              <CloudUpload className="h-6 w-6 stroke-[1.75]" />
            )}
          </div>

          <h3 className="text-base font-semibold text-ink">
            {uploading ? "Uploading your assets…" : "Upload brand media & assets"}
          </h3>
          <p className="mt-1 text-xs text-muted max-w-md text-pretty">
            Drag and drop logos (SVG, PNG), photography, copy docs, or PDF style guides. Up to 25 MB each.
          </p>

          <label
            htmlFor={inputId}
            className="btn3d btn3d-dark mt-4 inline-flex items-center gap-2 cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Upload className="h-3.5 w-3.5" />
            Select files from device
          </label>
        </div>
      </div>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      {/* Media Filter Tabs */}
      {mediaList.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-mist border border-line">
            {(
              [
                { id: "all", label: `All (${mediaList.length})` },
                {
                  id: "logo",
                  label: `Logos (${mediaList.filter((m) => m.category === "logo").length})`,
                },
                {
                  id: "image",
                  label: `Images (${mediaList.filter((m) => m.category === "image").length})`,
                },
                {
                  id: "document",
                  label: `Docs (${mediaList.filter((m) => m.category === "document").length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === tab.id
                    ? "bg-paper text-ink shadow-xs border border-line font-semibold"
                    : "text-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="font-mono text-[11px] text-muted">
            Powered by Cloudflare R2 object storage
          </span>
        </div>
      ) : null}

      {/* Media Gallery / Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedia.map((item) => {
            const isImage = item.category === "image" || item.category === "logo";
            const copied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-line bg-paper p-4 transition-all hover:border-line-strong hover:shadow-md"
              >
                <div>
                  {/* Thumbnail / Icon preview */}
                  <div className="relative mb-3 flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-line/60 bg-mist/60">
                    {isImage ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain p-2 transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4 text-muted">
                        <CategoryIcon category={item.category} />
                        <span className="text-[11px] font-mono uppercase tracking-wider">
                          {item.mimeType.split("/")[1] || "Document"}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="chip3d rounded-md border border-line/80 bg-paper/90 px-2 py-0.5 text-[10px] font-mono uppercase font-semibold text-ink backdrop-blur-xs">
                        {item.category}
                      </span>
                      {item.storage === "r2" ? (
                        <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-mono text-amber-700 font-medium">
                          R2
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* File title & meta */}
                  <h4
                    className="truncate text-xs font-semibold text-ink"
                    title={item.name}
                  >
                    {item.name}
                  </h4>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted">
                    <span>{formatBytes(item.size)}</span>
                    <span>{formatDate(item.uploadedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => copyUrl(item.id, item.url)}
                      className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11px] text-muted hover:border-line-strong hover:text-ink transition-colors"
                      title="Copy URL"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copied ? "Copied" : "Link"}</span>
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11px] text-muted hover:border-line-strong hover:text-ink transition-colors"
                      title="Open file"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-md p-1 text-muted/60 hover:text-red-600 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-line/70 bg-mist/30 p-8 text-center">
          <p className="text-xs text-muted">
            {mediaList.length === 0
              ? "No assets uploaded yet. Add your vector logos, brand colors, images, and content docs above so we can build your site faster."
              : "No assets match this category."}
          </p>
        </div>
      )}
    </div>
  );
}
