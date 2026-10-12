import React, { useState, useMemo } from 'react';
import {
  INITIAL_DAILY_RECORDS,
  DailyRFRecord,
  RF_TARGETS,
  computeSummaryRows,
} from './data/rfPerformanceData';
import { PerformanceSummaryTable } from './components/PerformanceSummaryTable';
import { DailyAnalyticsCharts } from './components/DailyAnalyticsCharts';
import {
  Calendar,
  Download,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<DailyRFRecord[]>(INITIAL_DAILY_RECORDS);
  const [selectedDate, setSelectedDate] = useState<string>('10/10/2026');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'Achieved' | 'Below target'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // New/Edit Record Form State
  const [formIsoDate, setFormIsoDate] = useState<string>('2026-10-11');
  const [formUphA, setFormUphA] = useState<string>('148');
  const [formUphB, setFormUphB] = useState<string>('105');
  const [formUpphAll, setFormUpphAll] = useState<string>('0.25');
  const [formIdlePct, setFormIdlePct] = useState<string>('1.8');
  const [formNote, setFormNote] = useState<string>(
    'เพิ่มกำลังคนเสริมสถานี RF-A และปรับสมดุล Line B'
  );

  const { dailyRecord, mtdAverages, rows } = useMemo(
    () => computeSummaryRows(records, selectedDate),
    [records, selectedDate]
  );

  const handleExportCSV = () => {
    const headers = ['Date Group', 'Topic', 'Target', 'Actual', 'Gap', 'Status'];
    const csvLines = [
      headers.join(','),
      ...rows.map((r) =>
        [
          `"${r.periodLabel}"`,
          `"${r.topic}"`,
          `"${r.targetDisplay}"`,
          `"${r.actualDisplay}"`,
          `"${r.gapDisplay}"`,
          `"${r.status}"`,
        ].join(',')
      ),
    ];
    const blob = new Blob([csvLines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RF_Performance_Summary_${dailyRecord.isoDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    setRecords(INITIAL_DAILY_RECORDS);
    setSelectedDate('10/10/2026');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const handleSaveDailyRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = formIsoDate.split('-');
    if (parts.length !== 3) return;
    const [yyyy, mm, dd] = parts;
    const formattedDate = `${dd}/${mm}/${yyyy}`;
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const mIdx = Math.max(0, Math.min(11, parseInt(mm, 10) - 1));
    const shortDate = `${dd} ${monthNames[mIdx]}`;

    const uphA = Math.max(0, Math.round(Number(formUphA) || 0));
    const uphB = Math.max(0, Math.round(Number(formUphB) || 0));
    const uphAll = Math.round((uphA + uphB) / 2);
    const upphAll = Math.max(0, Number(Number(formUpphAll || 0).toFixed(2)));
    const idleTimePct = Math.max(0, Number(Number(formIdlePct || 0).toFixed(2)));

    const newRec: DailyRFRecord = {
      id: formIsoDate,
      date: formattedDate,
      isoDate: formIsoDate,
      shortDate,
      uphA,
      uphB,
      uphAll,
      upphAll,
      idleTimePct,
      activeOperatorsA: 28,
      activeOperatorsB: 20,
      shiftNote: formNote.trim() || 'บันทึกผลการปฏิบัติงานรายวัน',
    };

    setRecords((prev) => {
      const exists = prev.some((r) => r.isoDate === formIsoDate);
      if (exists) {
        return prev.map((r) => (r.isoDate === formIsoDate ? newRec : r));
      }
      return [...prev, newRec].sort((a, b) =>
        a.isoDate.localeCompare(b.isoDate)
      );
    });
    setSelectedDate(formattedDate);
    setIsLogModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            RF Performance Portal
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#summary-table"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Summary Table
            </a>
            <a
              href="#daily-analytics"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Daily Analytics
            </a>
            <a
              href="#daily-log"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Daily Log
            </a>
            <button
              type="button"
              onClick={handleResetData}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset Default
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#08427a] rounded-lg hover:bg-[#06315c] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Daily Result
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main
        id="top"
        className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-8 space-y-10"
      >
        {/* Workspace Control Bar & Headline */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Production Line Telemetry</span>
                <span aria-hidden="true">·</span>
                <span>October 2026 Cycle</span>
                <span aria-hidden="true">·</span>
                <span>Active Report: {dailyRecord.date}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 text-balance">
                RF Performance Summary &amp; Daily Usage Analytics
              </h1>
            </div>

            {/* Date Selector & CSV Export Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <label
                  htmlFor="date-select"
                  className="text-xs font-medium text-slate-600 whitespace-nowrap"
                >
                  วันที่แสดงผล (Result Date):
                </label>
                <select
                  id="date-select"
                  value={dailyRecord.date}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-mono font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  {records.map((rec) => (
                    <option key={rec.id} value={rec.date}>
                      {rec.date} ({rec.shortDate})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV
              </button>
            </div>
          </div>

          {/* Full-Width 4-Column KPI Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: UPH-A */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  UPH-A ({dailyRecord.date})
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Below target
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {dailyRecord.uphA}
                </div>
                <div className="text-xs font-mono tabular-nums text-right">
                  <span className="text-slate-500">Target: {RF_TARGETS.uphA}</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span className="font-bold text-red-600">
                    Gap {dailyRecord.uphA - RF_TARGETS.uphA}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Oct&apos;2026 MTD: {mtdAverages.uphA}</span>
                <span className="text-red-600">
                  Gap {mtdAverages.uphA - RF_TARGETS.uphA}
                </span>
              </div>
            </div>

            {/* KPI 2: UPH-B */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  UPH-B ({dailyRecord.date})
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Below target
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {dailyRecord.uphB}
                </div>
                <div className="text-xs font-mono tabular-nums text-right">
                  <span className="text-slate-500">Target: {RF_TARGETS.uphB}</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span className="font-bold text-red-600">
                    Gap {dailyRecord.uphB - RF_TARGETS.uphB}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Oct&apos;2026 MTD: {mtdAverages.uphB}</span>
                <span className="text-red-600">
                  Gap {mtdAverages.uphB - RF_TARGETS.uphB}
                </span>
              </div>
            </div>

            {/* KPI 3: UPPH All line */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  UPPH All line ({dailyRecord.date})
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Achieved
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {dailyRecord.upphAll.toFixed(2)}
                </div>
                <div className="text-xs font-mono tabular-nums text-right">
                  <span className="text-slate-500">
                    Target: {RF_TARGETS.upphAll.toFixed(2)}
                  </span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span className="font-bold text-emerald-700">
                    Gap +{(dailyRecord.upphAll - RF_TARGETS.upphAll).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Oct&apos;2026 MTD: {mtdAverages.upphAll.toFixed(2)}</span>
                <span className="text-emerald-700">
                  Gap +{(mtdAverages.upphAll - RF_TARGETS.upphAll).toFixed(2)}
                </span>
              </div>
            </div>

            {/* KPI 4: Idle Time All line */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  Idle Time All line ({dailyRecord.date})
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Achieved
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {dailyRecord.idleTimePct.toFixed(1)}%
                </div>
                <div className="text-xs font-mono tabular-nums text-right">
                  <span className="text-slate-500">
                    Target: ≤{RF_TARGETS.idleTimePct}%
                  </span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span className="font-bold text-emerald-700">
                    Gap +
                    {(RF_TARGETS.idleTimePct - dailyRecord.idleTimePct).toFixed(
                      2
                    )}
                    %
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Oct&apos;2026 MTD: {mtdAverages.idleTimePct.toFixed(2)}%</span>
                <span className="text-emerald-700">
                  Gap +
                  {(RF_TARGETS.idleTimePct - mtdAverages.idleTimePct).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: RF PERFORMANCE SUMMARY TABLE (Exact faithful web version of image.png) */}
        <section id="summary-table" className="scroll-mt-20">
          <PerformanceSummaryTable
            rows={rows}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedDate={dailyRecord.date}
          />
        </section>

        {/* Section 2: DAILY USAGE & PERFORMANCE ANALYTICS CHARTS */}
        <section id="daily-analytics" className="scroll-mt-20">
          <DailyAnalyticsCharts
            records={records}
            selectedDate={dailyRecord.date}
            onSelectDate={setSelectedDate}
            summaryRows={rows}
            mtdAverages={mtdAverages}
          />
        </section>

        {/* Section 3: DAILY HISTORICAL LOG TABLE (01/10/2026 - 10/10/2026) */}
        <section id="daily-log" className="scroll-mt-20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-blue-700">
                Daily Operations Log · ประวัติข้อมูลรายวัน (Oct&apos;2026)
              </p>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                ตารางบันทึกผลการใช้งานรายวัน (01/10/2026 – {records[records.length - 1]?.date})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              เพิ่ม/แก้ไขข้อมูลรายวัน
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">
                      UPH-A (เป้า 172)
                    </th>
                    <th className="py-3 px-4 text-right">
                      UPH-B (เป้า 115)
                    </th>
                    <th className="py-3 px-4 text-right">
                      UPH All line (เป้า 144)
                    </th>
                    <th className="py-3 px-4 text-right">
                      UPPH All line (เป้า 0.21)
                    </th>
                    <th className="py-3 px-4 text-right">
                      Idle Time (เป้า ≤5%)
                    </th>
                    <th className="py-3 px-4">หมายเหตุการเดินสายการผลิต (Shift Note)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {records.map((rec) => {
                    const isSelected = rec.date === dailyRecord.date;
                    return (
                      <tr
                        key={rec.id}
                        onClick={() => setSelectedDate(rec.date)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 font-medium'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                          {rec.date}
                          {isSelected && (
                            <span className="ml-2 text-[11px] font-sans font-normal text-blue-700">
                              · กำลังแสดงผล
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                          <span className="font-semibold text-slate-900">
                            {rec.uphA}
                          </span>{' '}
                          <span className="text-red-600 text-xs">
                            ({rec.uphA - RF_TARGETS.uphA})
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                          <span className="font-semibold text-slate-900">
                            {rec.uphB}
                          </span>{' '}
                          <span className="text-red-600 text-xs">
                            ({rec.uphB - RF_TARGETS.uphB})
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                          <span className="font-semibold text-slate-900">
                            {rec.uphAll}
                          </span>{' '}
                          <span className="text-red-600 text-xs">
                            ({rec.uphAll - RF_TARGETS.uphAll})
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-emerald-700 font-semibold">
                          {rec.upphAll.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-emerald-700 font-semibold">
                          {rec.idleTimePct.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 text-xs">
                          {rec.shiftNote}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-300 font-semibold text-slate-900">
                    <td className="py-3 px-4 font-mono">
                      Oct&apos;2026 MTD Avg ({mtdAverages.daysCount} วัน)
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {mtdAverages.uphA}{' '}
                      <span className="text-red-600 text-xs">
                        ({mtdAverages.uphA - RF_TARGETS.uphA})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {mtdAverages.uphB}{' '}
                      <span className="text-red-600 text-xs">
                        ({mtdAverages.uphB - RF_TARGETS.uphB})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {mtdAverages.uphAll}{' '}
                      <span className="text-red-600 text-xs">
                        ({mtdAverages.uphAll - RF_TARGETS.uphAll})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
                      {mtdAverages.upphAll.toFixed(2)} (+
                      {(mtdAverages.upphAll - RF_TARGETS.upphAll).toFixed(2)})
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
                      {mtdAverages.idleTimePct.toFixed(2)}% (+
                      {(
                        RF_TARGETS.idleTimePct - mtdAverages.idleTimePct
                      ).toFixed(2)}
                      %)
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 font-normal">
                      คำนวณค่าเฉลี่ยสะสมอัตโนมัติถึงวันที่ {dailyRecord.date}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 mt-12">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>RF Performance Summary &amp; Daily Usage Analytics</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleExportCSV}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Export CSV Report
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Default Data
            </button>
          </div>
        </div>
      </footer>

      {/* Modal for Logging / Updating Daily Result */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  บันทึกผลการใช้งานรายวัน (Log Daily RF Result)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  เพิ่มข้อมูลวันใหม่หรืออัปเดตตัวเลขเพื่อคำนวณกราฟและค่าเฉลี่ย MTD อัตโนมัติ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDailyRecord} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  วันที่ปฏิบัติงาน (Date)
                </label>
                <input
                  type="date"
                  required
                  value={formIsoDate}
                  onChange={(e) => setFormIsoDate(e.target.value)}
                  className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    UPH-A (Target: 172)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="300"
                    value={formUphA}
                    onChange={(e) => setFormUphA(e.target.value)}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    UPH-B (Target: 115)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="300"
                    value={formUphB}
                    onChange={(e) => setFormUphB(e.target.value)}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    UPPH All line (Target: 0.21)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    max="2"
                    value={formUpphAll}
                    onChange={(e) => setFormUpphAll(e.target.value)}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Idle Time % (Target: ≤5%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="0"
                    max="100"
                    value={formIdlePct}
                    onChange={(e) => setFormIdlePct(e.target.value)}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  หมายเหตุกะการทำงาน (Shift Note)
                </label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#08427a] rounded-lg hover:bg-[#06315c] transition-colors cursor-pointer"
                >
                  Save Daily Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
