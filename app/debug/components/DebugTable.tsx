"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

interface DebugTableProps<T extends { id: string }> {
  title: string;
  data: T[];
  columns: {
    key: keyof T | "select" | "actions";
    label: string;
    width?: string;
    render?: (item: T) => React.ReactNode;
  }[];
  color: "blue" | "purple" | "emerald" | "amber" | "teal" | "green" | "pink";
  onDelete: (ids: string[]) => Promise<{ success: boolean; error?: string }>;
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  teal: "bg-teal-100 text-teal-800",
  green: "bg-green-100 text-green-800",
  pink: "bg-pink-100 text-pink-800",
};

export function DebugTable<T extends { id: string }>({
  title,
  data,
  columns,
  color,
  onDelete,
}: DebugTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map((item) => item.id)));
    }
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Är du säker på att du vill radera ${selectedIds.size} ${title.toLowerCase()}?`)) {
      return;
    }

    startTransition(async () => {
      const result = await onDelete(Array.from(selectedIds));
      if (result.success) {
        setSelectedIds(new Set());
      } else {
        alert(`Fel: ${result.error}`);
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Radera {selectedIds.size} st
            </button>
          )}
          <span className={`${colorClasses[color]} px-4 py-1.5 rounded-full text-sm font-semibold`}>
            {data.length} st
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg font-medium">Inga {title.toLowerCase()} ännu</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((col) =>
                  col.key === "select" ? (
                    <th key="select" className="px-3 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === data.length && data.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                    </th>
                  ) : (
                    <th
                      key={String(col.key)}
                      className={`px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                        col.width || ""
                      }`}
                    >
                      {col.label}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col) =>
                    col.key === "select" ? (
                      <td key="select" className="px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                      </td>
                    ) : col.key === "actions" ? (
                      <td key="actions" className="px-6 py-4">
                        {col.render?.(item)}
                      </td>
                    ) : (
                      <td
                        key={String(col.key)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-900"
                      >
                        {col.render ? col.render(item) : String(item[col.key as keyof T])}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
