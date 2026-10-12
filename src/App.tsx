import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Save,
  Check,
  Clock,
  Edit3,
} from 'lucide-react';

const STORAGE_KEY = 'rf_performance_web_autosave_v1';

interface PersistedWebState {
  records: DailyRFRecord[];
  selectedDate: string;
  autoSaveEnabled: boolean;
  inlineEditEnabled: boolean;
  lastSavedAt: string;
  saveCount: number;
}

function formatThaiTime(date: Date): string {
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function App() {
  // Load initial state from Web localStorage if available
  const initialLoaded = useMemo((): PersistedWebState | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedWebState;
      if (Array.isArray(parsed.records) && parsed.records.length > 0) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const [records, setRecords] = useState<DailyRFRecord[]>(
    () => initialLoaded?.records || INITIAL_DAILY_RECORDS
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    () => initialLoaded?.selectedDate || '10/10/2026'
  );
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(
    () => initialLoaded?.autoSaveEnabled ?? true
  );
  const [inlineEditEnabled, setInlineEditEnabled] = useState<boolean>(
    () => initialLoaded?.inlineEditEnabled ?? true
  );
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved'
  );
  const [lastSavedAt, setLastSavedAt] = useState<string>(
    () => initialLoaded?.lastSavedAt || formatThaiTime(new Date())
  );
  const [saveCount, setSaveCount] = useState<number>(
    () => initialLoaded?.saveCount || 1
  );

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

  const isFirstMount = useRef(true);

  // Persist helper
  const persistToWebStorage = (
    nextRecords: DailyRFRecord[],
    nextSelectedDate: string,
    nextAutoSave: boolean,
    nextInlineEdit: boolean
  ) => {
    try {
      const nowStr = formatThaiTime(new Date());
      const nextCount = saveCount + 1;
      const payload: PersistedWebState = {
        records: nextRecords,
        selectedDate: nextSelectedDate,
        autoSaveEnabled: nextAutoSave,
        inlineEditEnabled: nextInlineEdit,
        lastSavedAt: nowStr,
        saveCount: nextCount,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLastSavedAt(nowStr);
      setSaveCount(nextCount);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    }
  };

  // Auto-Save Effect whenever records, selectedDate, or inlineEditEnabled change
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (!autoSaveEnabled) {
      setSaveStatus('unsaved');
      return;
    }

    setSaveStatus('saving');
    const timer = window.setTimeout(() => {
      persistToWebStorage(
        records,
        selectedDate,
        autoSaveEnabled,
        inlineEditEnabled
      );
    }, 220);

    return () => window.clearTimeout(timer);
  }, [records, selectedDate, autoSaveEnabled, inlineEditEnabled]);

  const handleManualSaveNow = () => {
    setSaveStatus('saving');
    persistToWebStorage(
      records,
      selectedDate,
      autoSaveEnabled,
      inlineEditEnabled
    );
  };

  const handleToggleAutoSave = () => {
    const nextState = !autoSaveEnabled;
    setAutoSaveEnabled(nextState);
    if (nextState) {
      persistToWebStorage(records, selectedDate, true, inlineEditEnabled);
    } else {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedWebState;
          parsed.autoSaveEnabled = false;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore storage error
      }
    }
  };

  const { dailyRecord, mtdAverages, rows } = useMemo(
    () => computeSummaryRows(records, selectedDate),
    [records, selectedDate]
  );

  // Inline update handler for any field of a specific date record
  const handleUpdateRecordField = (
    targetDate: string,
    field: 'uphA' | 'uphB' | 'upphAll' | 'idleTimePct' | 'shiftNote',
    value: number | string
  ) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.date !== targetDate) return rec;
        const updated = { ...rec, [field]: value };
        if (field === 'uphA' || field === 'uphB') {
          updated.uphAll = Math.round((updated.uphA + updated.uphB) / 2);
        }
        return updated;
      })
    );
  };

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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setLastSavedAt(formatThaiTime(new Date()));
    setSaveStatus('saved');
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
        {/* Workspace Control Bar, Auto-Save Panel & Headline */}
        <section className="space-y-6">
          {/* Web Auto-Save Control Bar */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Auto-Save Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={autoSaveEnabled}
                onClick={handleToggleAutoSave}
                className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  autoSaveEnabled
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span
                  className={`w-7 h-4 rounded-full p-0.5 transition-colors flex items-center ${
                    autoSaveEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-400 justify-start'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-white block" />
                </span>
                <span>
                  โหมดบันทึกอัตโนมัติบน Web (Auto-Save):{' '}
                  <strong>{autoSaveEnabled ? 'เปิดใช้งาน (ON)' : 'ปิดชั่วคราว (OFF)'}</strong>
                </span>
              </button>

              {/* Save Status & Timestamp */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                {saveStatus === 'saving' ? (
                  <span className="inline-flex items-center gap-1.5 text-blue-700 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    กำลังบันทึกข้อมูลลงเบราว์เซอร์อัตโนมัติ...
                  </span>
                ) : saveStatus === 'saved' ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    บันทึกอัตโนมัติล่าสุดเมื่อ{' '}
                    <span className="font-mono font-semibold">{lastSavedAt}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-amber-700 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    มีการแก้ไขที่ยังไม่ได้บันทึก (โหมด Auto-Save ปิดอยู่)
                  </span>
                )}
              </div>
            </div>

            {/* Right Controls inside Auto-Save Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {!autoSaveEnabled && (
                <button
                  type="button"
                  onClick={handleManualSaveNow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  บันทึกตอนนี้ (Save Now)
                </button>
              )}

              <button
                type="button"
                onClick={() => setInlineEditEnabled((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  inlineEditEnabled
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {inlineEditEnabled
                  ? 'แก้ไขตัวเลขในตารางได้ทันที: เปิด'
                  : 'แก้ไขตัวเลขในตารางได้ทันที: ปิด'}
              </button>
            </div>
          </div>

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
                {dailyRecord.uphA >= RF_TARGETS.uphA ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Achieved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Below target
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {dailyRecord.uphA}
                </div>
                <div className="text-xs font-mono tabular-nums text-right">
                  <span className="text-slate-500">Target: {RF_TARGETS.uphA}</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span
                    className={`font-bold ${
                      dailyRecord.uphA - RF_TARGETS.uphA >= 0
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    Gap{' '}
                    {dailyRecord.uphA - RF_TARGETS.uphA > 0
                      ? `+${dailyRecord.uphA - RF_TARGETS.uphA}`
                      : dailyRecord.uphA - RF_TARGETS.uphA}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Oct&apos;2026 MTD: {mtdAverages.uphA}</span>
                <span
                  className={
                    mtdAverages.uphA - RF_TARGETS.uphA >= 0
                      ? 'text-emerald-700'
                      : 'text-red-600'
                  }
                >
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
                {dailyRecord.uphB >= RF_TARGETS.uphB ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Achieved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Below target
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                  {dailyRecord.uphB}
                </div>
                <div className="text-xs font-mono tabular-nums text-right">
                  <span className="text-slate-500">Target: {RF_TARGETS.uphB}</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span
                    className={`font-bold ${
                      dailyRecord.uphB - RF_TARGETS.uphB >= 0
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    Gap{' '}
                    {dailyRecord.uphB - RF_TARGETS.uphB > 0
                      ? `+${dailyRecord.uphB - RF_TARGETS.uphB}`
                      : dailyRecord.uphB - RF_TARGETS.uphB}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Oct&apos;2026 MTD: {mtdAverages.uphB}</span>
                <span
                  className={
                    mtdAverages.uphB - RF_TARGETS.uphB >= 0
                      ? 'text-emerald-700'
                      : 'text-red-600'
                  }
                >
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
                {dailyRecord.upphAll >= RF_TARGETS.upphAll ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Achieved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Below target
                  </span>
                )}
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
                  <span
                    className={`font-bold ${
                      dailyRecord.upphAll >= RF_TARGETS.upphAll
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    Gap{' '}
                    {dailyRecord.upphAll - RF_TARGETS.upphAll >= 0 ? '+' : ''}
                    {(dailyRecord.upphAll - RF_TARGETS.upphAll).toFixed(2)}
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
                {dailyRecord.idleTimePct <= RF_TARGETS.idleTimePct ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Achieved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Below target
                  </span>
                )}
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
                  <span
                    className={`font-bold ${
                      dailyRecord.idleTimePct <= RF_TARGETS.idleTimePct
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    Gap{' '}
                    {RF_TARGETS.idleTimePct - dailyRecord.idleTimePct >= 0
                      ? '+'
                      : ''}
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

        {/* Section 1: RF PERFORMANCE SUMMARY TABLE (With Inline Auto-Save Editing) */}
        <section id="summary-table" className="scroll-mt-20">
          <PerformanceSummaryTable
            rows={rows}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedDate={dailyRecord.date}
            dailyRecord={dailyRecord}
            onInlineUpdateDaily={(field, value) =>
              handleUpdateRecordField(dailyRecord.date, field, value)
            }
            inlineEditEnabled={inlineEditEnabled}
            onToggleInlineEdit={() => setInlineEditEnabled((prev) => !prev)}
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

        {/* Section 3: DAILY HISTORICAL LOG TABLE (With Live Auto-Save Cell Editing) */}
        <section id="daily-log" className="scroll-mt-20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-blue-700">
                Daily Operations Log · ประวัติข้อมูลรายวันพร้อมบันทึกอัตโนมัติ (Oct&apos;2026)
              </p>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                ตารางบันทึกผลการใช้งานรายวัน (01/10/2026 – {records[records.length - 1]?.date})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                แก้ไขตัวเลขในแต่ละแถวได้โดยตรง ระบบจะบันทึกอัตโนมัติ (Auto-Save) และคำนวณกราฟพร้อมค่าเฉลี่ย MTD ทันที
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              เพิ่มวันใหม่ (Add Daily Row)
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
                        <td
                          className="py-2 px-4 text-right font-mono tabular-nums"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {inlineEditEnabled ? (
                            <input
                              type="number"
                              min={0}
                              max={500}
                              value={rec.uphA}
                              onChange={(e) => {
                                setSelectedDate(rec.date);
                                handleUpdateRecordField(
                                  rec.date,
                                  'uphA',
                                  Math.max(0, Number(e.target.value) || 0)
                                );
                              }}
                              className="w-16 px-1.5 py-1 text-right font-mono font-semibold text-slate-900 bg-white border border-slate-300 rounded focus:outline-none focus:border-blue-600"
                            />
                          ) : (
                            <span className="font-semibold text-slate-900">
                              {rec.uphA}
                            </span>
                          )}{' '}
                          <span className="text-red-600 text-xs">
                            ({rec.uphA - RF_TARGETS.uphA})
                          </span>
                        </td>
                        <td
                          className="py-2 px-4 text-right font-mono tabular-nums"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {inlineEditEnabled ? (
                            <input
                              type="number"
                              min={0}
                              max={500}
                              value={rec.uphB}
                              onChange={(e) => {
                                setSelectedDate(rec.date);
                                handleUpdateRecordField(
                                  rec.date,
                                  'uphB',
                                  Math.max(0, Number(e.target.value) || 0)
                                );
                              }}
                              className="w-16 px-1.5 py-1 text-right font-mono font-semibold text-slate-900 bg-white border border-slate-300 rounded focus:outline-none focus:border-blue-600"
                            />
                          ) : (
                            <span className="font-semibold text-slate-900">
                              {rec.uphB}
                            </span>
                          )}{' '}
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
                        <td
                          className="py-2 px-4 text-right font-mono tabular-nums text-emerald-700 font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {inlineEditEnabled ? (
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              max={5}
                              value={rec.upphAll}
                              onChange={(e) => {
                                setSelectedDate(rec.date);
                                handleUpdateRecordField(
                                  rec.date,
                                  'upphAll',
                                  Math.max(0, Number(e.target.value) || 0)
                                );
                              }}
                              className="w-16 px-1.5 py-1 text-right font-mono font-semibold text-emerald-800 bg-white border border-slate-300 rounded focus:outline-none focus:border-blue-600"
                            />
                          ) : (
                            rec.upphAll.toFixed(2)
                          )}
                        </td>
                        <td
                          className="py-2 px-4 text-right font-mono tabular-nums text-emerald-700 font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {inlineEditEnabled ? (
                            <div className="inline-flex items-center justify-end gap-0.5">
                              <input
                                type="number"
                                step="0.1"
                                min={0}
                                max={100}
                                value={rec.idleTimePct}
                                onChange={(e) => {
                                  setSelectedDate(rec.date);
                                  handleUpdateRecordField(
                                    rec.date,
                                    'idleTimePct',
                                    Math.max(
                                      0,
                                      Math.min(100, Number(e.target.value) || 0)
                                    )
                                  );
                                }}
                                className="w-14 px-1.5 py-1 text-right font-mono font-semibold text-emerald-800 bg-white border border-slate-300 rounded focus:outline-none focus:border-blue-600"
                              />
                              <span>%</span>
                            </div>
                          ) : (
                            `${rec.idleTimePct.toFixed(1)}%`
                          )}
                        </td>
                        <td
                          className="py-2 px-4 text-slate-600 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {inlineEditEnabled ? (
                            <input
                              type="text"
                              value={rec.shiftNote}
                              onChange={(e) =>
                                handleUpdateRecordField(
                                  rec.date,
                                  'shiftNote',
                                  e.target.value
                                )
                              }
                              className="w-full min-w-[200px] px-2 py-1 text-xs text-slate-700 bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                            />
                          ) : (
                            rec.shiftNote
                          )}
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
          <span>
            RF Performance Summary &amp; Daily Usage Analytics · Auto-Save{' '}
            {autoSaveEnabled ? 'Active' : 'Paused'} (Saved {lastSavedAt})
          </span>
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
                  ข้อมูลที่เพิ่มจะถูกจัดเก็บในโหมดบันทึกอัตโนมัติบน Web ทันที
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
