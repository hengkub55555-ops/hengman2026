import React from 'react';
import { PerformanceRow } from '../data/rfPerformanceData';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface PerformanceSummaryTableProps {
  rows: PerformanceRow[];
  statusFilter: 'all' | 'Achieved' | 'Below target';
  onStatusFilterChange: (filter: 'all' | 'Achieved' | 'Below target') => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedDate: string;
}

export const PerformanceSummaryTable: React.FC<PerformanceSummaryTableProps> = ({
  rows,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  selectedDate,
}) => {
  const filteredRows = rows.filter((row) => {
    const matchesStatus =
      statusFilter === 'all' ? true : row.status === statusFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      row.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.topicDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.periodLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const dailyRows = filteredRows.filter((r) => r.periodGroup === 'daily');
  const mtdRows = filteredRows.filter((r) => r.periodGroup === 'mtd');

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Table Title Banner matching the executive dark-blue header in the user's screenshot */}
      <div className="bg-[#08427a] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            RF PERFORMANCE SUMMARY
          </h2>
          <p className="text-xs text-sky-100/90 mt-0.5">
            ตารางสรุปผลการดำเนินงานสายการผลิต RF ประจำวันที่ {selectedDate} และยอดสะสมรายเดือน (Oct&apos;2026 MTD)
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="ค้นหาหัวข้อ (เช่น UPH-A, Idle)..."
            className="px-3 py-1.5 text-xs bg-white/10 text-white placeholder:text-sky-200/75 border border-white/20 rounded-lg focus:outline-none focus:border-white"
          />
          <div className="flex items-center gap-1 p-1 bg-[#06315c] rounded-lg border border-white/15">
            <button
              type="button"
              onClick={() => onStatusFilterChange('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900'
                  : 'text-sky-100 hover:text-white'
              }`}
            >
              ทั้งหมด ({rows.length})
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange('Achieved')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
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
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
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
              <th className="py-3 px-4 border-r border-white/20 text-center w-40">
                Date
              </th>
              <th className="py-3 px-5 border-r border-white/20">Topic</th>
              <th className="py-3 px-4 border-r border-white/20 text-center w-28">
                Target
              </th>
              <th className="py-3 px-4 border-r border-white/20 text-center w-28">
                Actual
              </th>
              <th className="py-3 px-4 border-r border-white/20 text-center w-28">
                Gap
              </th>
              <th className="py-3 px-5 text-center w-44">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 px-6 text-center text-slate-500 text-sm"
                >
                  ไม่พบรายการตัวชี้วัดที่ตรงกับเงื่อนไขการกรอง
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
                        className="py-4 px-4 text-center font-bold text-slate-900 bg-slate-50/60 border-r border-slate-200 align-middle"
                      >
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-sans">
                          Result
                        </div>
                        <div className="font-mono text-sm sm:text-base text-slate-900 mt-0.5">
                          {selectedDate}
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-5 border-r border-slate-200">
                      <div className="font-semibold text-slate-900">
                        {row.topic}
                      </div>
                      <div className="text-xs text-slate-500">
                        {row.topicDescription}
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
                      <span
                        className={`inline-flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm ${
                          row.status === 'Achieved'
                            ? 'text-slate-900'
                            : 'text-slate-900'
                        }`}
                      >
                        {row.status === 'Achieved' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>{row.status}</span>
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
                        className="py-4 px-4 text-center font-bold text-slate-900 bg-slate-50/60 border-r border-slate-200 align-middle"
                      >
                        <div className="font-mono text-sm sm:text-base text-slate-900">
                          Oct&apos;2026
                        </div>
                        <div className="text-xs text-slate-500 font-normal mt-0.5">
                          Month-to-Date
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-5 border-r border-slate-200">
                      <div className="font-semibold text-slate-900">
                        {row.topic}
                      </div>
                      <div className="text-xs text-slate-500">
                        {row.topicDescription}
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
                        <span>{row.status}</span>
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
