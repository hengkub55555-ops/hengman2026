import React, { useState } from 'react';
import { PerformanceRow, DailyRFRecord } from '../data/rfPerformanceData';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Calendar,
  Check,
  Layers,
} from 'lucide-react';

interface PerformanceSummaryTableProps {
  lang: Language;
  rows: PerformanceRow[];
  statusFilter: 'all' | 'Achieved' | 'Below target';
  onStatusFilterChange: (filter: 'all' | 'Achieved' | 'Below target') => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedDate: string;
  dailyRecord: DailyRFRecord;
  monthLabel: string;
  availableDates: string[];
  onInlineUpdateDaily: (
    field: 'uphA' | 'uphB' | 'upphAll' | 'idleTimePct',
    value: number
  ) => void;
  onUpdateDate: (oldDate: string, newDate: string) => void;
  onUpdateMonth: (oldMonth: string, newMonth: string) => void;
  inlineEditEnabled: boolean;
  onToggleInlineEdit: () => void;
}

export const PerformanceSummaryTable: React.FC<PerformanceSummaryTableProps> = ({
  lang,
  rows,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  selectedDate,
  dailyRecord,
  monthLabel,
  availableDates,
  onInlineUpdateDaily,
  onUpdateDate,
  onUpdateMonth,
  inlineEditEnabled,
  onToggleInlineEdit,
}) => {
  const t = TRANSLATIONS[lang];

  // Inline editing states for Date and Month
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [customDateInput, setCustomDateInput] = useState(selectedDate);
  const [isEditingMonth, setIsEditingMonth] = useState(false);
  const [customMonthInput, setCustomMonthInput] = useState(monthLabel);

  const filteredRows = rows.filter((row) => {
    const matchesStatus =
      statusFilter === 'all' ? true : row.status === statusFilter;
    const localizedDesc =
      t.topicDescriptions[row.topic] || row.topicDescription;
    const matchesQuery =
      !searchQuery.trim() ||
      row.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      localizedDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.periodLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const dailyRows = filteredRows.filter((r) => r.periodGroup === 'daily');
  const mtdRows = filteredRows.filter((r) => r.periodGroup === 'mtd');

  const handleSaveDate = () => {
    const trimmed = customDateInput.trim();
    if (trimmed && trimmed !== selectedDate) {
      onUpdateDate(selectedDate, trimmed);
    }
    setIsEditingDate(false);
  };

  const handleSaveMonth = () => {
    const trimmed = customMonthInput.trim();
    if (trimmed && trimmed !== monthLabel) {
      onUpdateMonth(monthLabel, trimmed);
    }
    setIsEditingMonth(false);
  };

  const renderActualCell = (row: PerformanceRow) => {
    if (!inlineEditEnabled || row.periodGroup !== 'daily') {
      return <span>{row.actualDisplay}</span>;
    }

    if (row.id === 'daily-uph-a') {
      return (
        <input
          type="number"
          min={0}
          max={500}
          value={dailyRecord.uphA}
          onChange={(e) =>
            onInlineUpdateDaily('uphA', Math.max(0, Number(e.target.value) || 0))
          }
          aria-label="Actual UPH-A"
          className="w-20 px-2 py-1 text-center font-mono font-bold text-blue-900 bg-blue-50 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      );
    }

    if (row.id === 'daily-uph-b') {
      return (
        <input
          type="number"
          min={0}
          max={500}
          value={dailyRecord.uphB}
          onChange={(e) =>
            onInlineUpdateDaily('uphB', Math.max(0, Number(e.target.value) || 0))
          }
          aria-label="Actual UPH-B"
          className="w-20 px-2 py-1 text-center font-mono font-bold text-blue-900 bg-blue-50 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      );
    }

    if (row.id === 'daily-upph-all') {
      return (
        <input
          type="number"
          step="0.01"
          min={0}
          max={5}
          value={dailyRecord.upphAll}
          onChange={(e) =>
            onInlineUpdateDaily(
              'upphAll',
              Math.max(0, Number(e.target.value) || 0)
            )
          }
          aria-label="Actual UPPH All line"
          className="w-20 px-2 py-1 text-center font-mono font-bold text-blue-900 bg-blue-50 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      );
    }

    if (row.id === 'daily-idle-all') {
      return (
        <div className="inline-flex items-center justify-center gap-0.5">
          <input
            type="number"
            step="0.1"
            min={0}
            max={100}
            value={dailyRecord.idleTimePct}
            onChange={(e) =>
              onInlineUpdateDaily(
                'idleTimePct',
                Math.max(0, Math.min(100, Number(e.target.value) || 0))
              )
            }
            aria-label="Actual Idle Time All line"
            className="w-16 px-1.5 py-1 text-center font-mono font-bold text-blue-900 bg-blue-50 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <span className="font-mono text-xs text-slate-600">%</span>
        </div>
      );
    }

    return <span>{row.actualDisplay}</span>;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Table Title Banner matching the executive dark-blue header in the user's screenshot */}
      <div className="bg-[#08427a] px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            {t.summaryTableTitle}
          </h2>
          <p className="text-xs text-sky-100/90 mt-0.5">
            {t.summaryTableSub(selectedDate)}
          </p>
        </div>

        {/* Filter & Inline Edit Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleInlineEdit}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              inlineEditEnabled
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {inlineEditEnabled ? t.inlineEditActiveBtn : t.inlineEditToggleBtn}
          </button>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="px-3 py-1.5 text-xs bg-white/10 text-white placeholder:text-sky-200/75 border border-white/20 rounded-lg focus:outline-none focus:border-white"
          />
          <div className="flex items-center gap-1 p-1 bg-[#06315c] rounded-lg border border-white/15">
            <button
              type="button"
              onClick={() => onStatusFilterChange('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900'
                  : 'text-sky-100 hover:text-white'
              }`}
            >
              {t.allFilter} ({rows.length})
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange('Achieved')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === 'Achieved'
                  ? 'bg-white text-emerald-800'
                  : 'text-sky-100 hover:text-white'
              }`}
            >
              Achieved
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange('Below target')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === 'Below target'
                  ? 'bg-white text-red-700'
                  : 'text-sky-100 hover:text-white'
              }`}
            >
              Below target
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#0e6ba8] text-white text-xs sm:text-sm font-semibold border-b border-slate-300">
              <th className="py-3 px-4 border-r border-white/20 text-center w-48">
                {t.colDate}
              </th>
              <th className="py-3 px-5 border-r border-white/20">
                {t.colTopic}
              </th>
              <th className="py-3 px-4 border-r border-white/20 text-center w-28">
                {t.colTarget}
              </th>
              <th className="py-3 px-4 border-r border-white/20 text-center w-32">
                {t.colActual}
              </th>
              <th className="py-3 px-4 border-r border-white/20 text-center w-28">
                {t.colGap}
              </th>
              <th className="py-3 px-5 text-center w-52">{t.colStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 px-6 text-center text-slate-500 text-sm"
                >
                  {t.noMatchingRows}
                </td>
              </tr>
            ) : (
              <>
                {/* Daily Group */}
                {dailyRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/90 transition-colors"
                  >
                    {idx === 0 && (
                      <td
                        rowSpan={dailyRows.length}
                        className="py-4 px-3 text-center font-bold text-slate-900 bg-slate-50/70 border-r border-slate-200 align-middle"
                      >
                        <div className="flex items-center justify-center gap-1 text-xs uppercase tracking-wider text-slate-500 font-sans">
                          <span>{t.resultLabel}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomDateInput(selectedDate);
                              setIsEditingDate((prev) => !prev);
                            }}
                            className="p-0.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                            title={t.editDateTooltip}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Editable Date in cell */}
                        {isEditingDate || inlineEditEnabled ? (
                          <div className="mt-1 space-y-1">
                            <select
                              value={selectedDate}
                              onChange={(e) => {
                                onUpdateDate(selectedDate, e.target.value);
                                setCustomDateInput(e.target.value);
                              }}
                              className="w-full text-xs font-mono font-bold text-blue-900 bg-white border border-blue-400 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                            >
                              {availableDates.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>

                            <div className="flex items-center gap-1 justify-center">
                              <input
                                type="text"
                                value={customDateInput}
                                onChange={(e) =>
                                  setCustomDateInput(e.target.value)
                                }
                                placeholder="DD/MM/YYYY"
                                className="w-24 text-center text-xs font-mono bg-white border border-slate-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-600"
                              />
                              <button
                                type="button"
                                onClick={handleSaveDate}
                                className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                                title={t.saveDateBtn}
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setCustomDateInput(selectedDate);
                              setIsEditingDate(true);
                            }}
                            className="font-mono text-sm sm:text-base text-slate-900 mt-0.5 cursor-pointer hover:text-blue-700 hover:underline"
                            title={t.editDateTooltip}
                          >
                            {selectedDate}
                          </div>
                        )}
                      </td>
                    )}
                    <td className="py-3 px-5 border-r border-slate-200">
                      <div className="font-semibold text-slate-900">
                        {row.topic}
                      </div>
                      <div className="text-xs text-slate-500">
                        {t.topicDescriptions[row.topic] || row.topicDescription}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 text-center font-mono font-bold text-slate-900 tabular-nums">
                      {row.targetDisplay}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 text-center font-mono font-medium text-slate-900 tabular-nums">
                      {renderActualCell(row)}
                    </td>
                    <td
                      className={`py-3 px-4 border-r border-slate-200 text-center font-mono font-semibold tabular-nums ${
                        row.isFavorable ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {row.gapDisplay}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className="inline-flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                        {row.status === 'Achieved' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>
                          {row.status === 'Achieved'
                            ? t.statusAchieved
                            : t.statusBelowTarget}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Divider between Daily and MTD */}
                {dailyRows.length > 0 && mtdRows.length > 0 && (
                  <tr className="border-t-2 border-slate-400" />
                )}

                {/* MTD Group */}
                {mtdRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/90 transition-colors"
                  >
                    {idx === 0 && (
                      <td
                        rowSpan={mtdRows.length}
                        className="py-4 px-3 text-center font-bold text-slate-900 bg-slate-50/70 border-r border-slate-200 align-middle"
                      >
                        {/* Editable Month in cell */}
                        {isEditingMonth || inlineEditEnabled ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 justify-center">
                              <input
                                type="text"
                                value={customMonthInput}
                                onChange={(e) =>
                                  setCustomMonthInput(e.target.value)
                                }
                                placeholder="Oct'2026"
                                className="w-24 text-center text-xs font-mono font-bold bg-white border border-purple-400 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-purple-600"
                              />
                              <button
                                type="button"
                                onClick={handleSaveMonth}
                                className="p-1 bg-purple-600 hover:bg-purple-700 text-white rounded cursor-pointer"
                                title={t.saveMonthBtn}
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-[11px] text-slate-500 font-normal">
                              {t.mtdSubLabel}
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setCustomMonthInput(monthLabel);
                              setIsEditingMonth(true);
                            }}
                            className="group cursor-pointer"
                            title={t.editMonthTooltip}
                          >
                            <div className="flex items-center justify-center gap-1 font-mono text-sm sm:text-base text-slate-900 group-hover:text-purple-700 group-hover:underline">
                              <span>{monthLabel}</span>
                              <Layers className="w-3.5 h-3.5 text-purple-600 opacity-60 group-hover:opacity-100" />
                            </div>
                            <div className="text-xs text-slate-500 font-normal mt-0.5">
                              {t.mtdSubLabel}
                            </div>
                          </div>
                        )}
                      </td>
                    )}
                    <td className="py-3 px-5 border-r border-slate-200">
                      <div className="font-semibold text-slate-900">
                        {row.topic}
                      </div>
                      <div className="text-xs text-slate-500">
                        {t.topicDescriptions[row.topic] || row.topicDescription}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 text-center font-mono font-bold text-slate-900 tabular-nums">
                      {row.targetDisplay}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 text-center font-mono font-medium text-slate-900 tabular-nums">
                      {row.actualDisplay}
                    </td>
                    <td
                      className={`py-3 px-4 border-r border-slate-200 text-center font-mono font-semibold tabular-nums ${
                        row.isFavorable ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {row.gapDisplay}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className="inline-flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                        {row.status === 'Achieved' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>
                          {row.status === 'Achieved'
                            ? t.statusAchieved
                            : t.statusBelowTarget}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
