import React, { useState } from 'react';
import { UpdateHistoryEntry } from '../data/rfPerformanceData';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  X,
  History,
  Download,
  Trash2,
  RotateCcw,
  Search,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface UpdateHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  history: UpdateHistoryEntry[];
  onClearHistory: () => void;
  onRevertEntry: (entry: UpdateHistoryEntry) => void;
}

export const UpdateHistoryModal: React.FC<UpdateHistoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  history,
  onClearHistory,
  onRevertEntry,
}) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      actionFilter === 'all' ? true : item.actionType === actionFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.timestamp.toLowerCase().includes(query) ||
      item.targetDate.toLowerCase().includes(query) ||
      item.field.toLowerCase().includes(query) ||
      item.oldValue.toLowerCase().includes(query) ||
      item.newValue.toLowerCase().includes(query) ||
      (item.note && item.note.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'Timestamp',
      'Target Record',
      'Action Type',
      'Field',
      'Old Value',
      'New Value',
      'Note',
    ];
    const csvRows = history.map((h) =>
      [
        `"${h.timestamp}"`,
        `"${h.targetDate}"`,
        `"${h.actionType}"`,
        `"${h.field}"`,
        `"${h.oldValue}"`,
        `"${h.newValue}"`,
        `"${h.note || ''}"`,
      ].join(',')
    );
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RF_Update_Audit_History_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRevert = (entry: UpdateHistoryEntry) => {
    onRevertEntry(entry);
    setSuccessToast(t.revertSuccessMsg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2800);
  };

  const getActionBadge = (actionType: UpdateHistoryEntry['actionType']) => {
    switch (actionType) {
      case 'date_change':
        return (
          <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{t.actionDateChange}</span>
          </span>
        );
      case 'month_change':
        return (
          <span className="inline-flex items-center gap-1 text-purple-700 font-medium">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>{t.actionMonthChange}</span>
          </span>
        );
      case 'metric_update':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>{t.actionMetricUpdate}</span>
          </span>
        );
      case 'record_add':
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
            <span>{t.actionRecordAdd}</span>
          </span>
        );
      case 'revert':
        return (
          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>{t.actionRevert}</span>
          </span>
        );
      default:
        return <span>{actionType}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#08427a] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <History className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-wide">
                  {t.historyModalTitle}
                </h3>
                <span className="text-xs bg-white/20 text-white font-mono px-2 py-0.5 rounded">
                  {t.historyCount(history.length)}
                </span>
              </div>
              <p className="text-xs text-sky-100/90 mt-0.5">
                {t.historyModalSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-sky-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close history modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success toast notice */}
        {successToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-6 py-2.5 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Toolbar & Filter */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.historySearchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg">
              <button
                type="button"
                onClick={() => setActionFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  actionFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.historyFilterAll}
              </button>
              <button
                type="button"
                onClick={() => setActionFilter('date_change')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  actionFilter === 'date_change'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.actionDateChange}
              </button>
              <button
                type="button"
                onClick={() => setActionFilter('month_change')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  actionFilter === 'month_change'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.actionMonthChange}
              </button>
              <button
                type="button"
                onClick={() => setActionFilter('metric_update')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  actionFilter === 'metric_update'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.actionMetricUpdate}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={history.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer text-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.historyExportBtn}</span>
            </button>
            <button
              type="button"
              onClick={onClearHistory}
              disabled={history.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.historyClearBtn}</span>
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredHistory.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm space-y-2">
              <History className="w-10 h-10 text-slate-300 mx-auto" />
              <p>{t.historyEmpty}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3 whitespace-nowrap">
                      {t.historyColTime}
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">
                      {t.historyColTarget}
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">
                      {t.historyColAction}
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">
                      {t.historyColField}
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">
                      {t.historyColChange}
                    </th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">
                      {t.historyColActionBtn}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredHistory.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {entry.timestamp}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                        {entry.targetDate}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {getActionBadge(entry.actionType)}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                        {entry.field}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="line-through text-red-600 bg-red-50 px-1 py-0.5 rounded">
                            {entry.oldValue || '—'}
                          </span>
                          <span className="text-slate-400">➔</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {entry.newValue}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {entry.actionType !== 'revert' && (
                          <button
                            type="button"
                            onClick={() => handleRevert(entry)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 font-medium transition-colors cursor-pointer"
                            title={t.historyRevertBtn}
                          >
                            <RotateCcw className="w-3 h-3 text-slate-600" />
                            <span>{t.historyRevertBtn}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {t.historyModalSubtitle}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#08427a] hover:bg-[#06315c] text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            {t.modalCancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
