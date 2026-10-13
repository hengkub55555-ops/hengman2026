import React, { useState } from 'react';
import {
  DailyRFRecord,
  PerformanceRow,
  RF_TARGETS,
} from '../data/rfPerformanceData';
import {
  Language,
  TRANSLATIONS,
  getLocalizedShiftNote,
} from '../i18n/translations';
import {
  BarChart3,
  TrendingUp,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface DailyAnalyticsChartsProps {
  lang: Language;
  records: DailyRFRecord[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  summaryRows: PerformanceRow[];
  mtdAverages: {
    uphAll: number;
    uphA: number;
    uphB: number;
    upphAll: number;
    idleTimePct: number;
    daysCount: number;
  };
}

type ChartViewMode = 'grouped-bar' | 'trend-line';
type LineFocus = 'all' | 'uphA' | 'uphB' | 'uphAll';

export const DailyAnalyticsCharts: React.FC<DailyAnalyticsChartsProps> = ({
  lang,
  records,
  selectedDate,
  onSelectDate,
  summaryRows,
  mtdAverages,
}) => {
  const t = TRANSLATIONS[lang];
  const [chartMode, setChartMode] = useState<ChartViewMode>('grouped-bar');
  const [lineFocus, setLineFocus] = useState<LineFocus>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [variancePeriod, setVariancePeriod] = useState<'daily' | 'mtd'>('daily');

  const sortedRecords = [...records].sort((a, b) =>
    a.isoDate.localeCompare(b.isoDate)
  );

  const activeRecord =
    sortedRecords.find((r) => r.date === selectedDate) ||
    sortedRecords[sortedRecords.length - 1];

  // SVG Chart dimensions for UPH Chart
  const svgWidth = 860;
  const svgHeight = 310;
  const padLeft = 48;
  const padRight = 28;
  const padTop = 28;
  const padBottom = 42;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const maxUphY = 200;

  const yToPx = (val: number) =>
    padTop + plotHeight - (Math.min(val, maxUphY) / maxUphY) * plotHeight;

  const xStep =
    sortedRecords.length > 1
      ? plotWidth / sortedRecords.length
      : plotWidth;

  const buildPolyline = (getter: (r: DailyRFRecord) => number) =>
    sortedRecords
      .map((r, idx) => {
        const x = padLeft + idx * xStep + xStep / 2;
        const y = yToPx(getter(r));
        return `${x},${y}`;
      })
      .join(' ');

  // SVG dimensions for UPPH & Idle Time Dual Chart
  const effWidth = 860;
  const effHeight = 270;
  const effPadLeft = 48;
  const effPadRight = 48;
  const effPadTop = 26;
  const effPadBottom = 38;
  const effPlotWidth = effWidth - effPadLeft - effPadRight;
  const effPlotHeight = effHeight - effPadTop - effPadBottom;

  const maxUpph = 0.32;
  const maxIdle = 6.0;

  const upphToY = (val: number) =>
    effPadTop + effPlotHeight - (Math.min(val, maxUpph) / maxUpph) * effPlotHeight;

  const idleToY = (val: number) =>
    effPadTop + effPlotHeight - (Math.min(val, maxIdle) / maxIdle) * effPlotHeight;

  const effXStep =
    sortedRecords.length > 1
      ? effPlotWidth / sortedRecords.length
      : effPlotWidth;

  const upphLinePoints = sortedRecords
    .map((r, idx) => {
      const x = effPadLeft + idx * effXStep + effXStep / 2;
      const y = upphToY(r.upphAll);
      return `${x},${y}`;
    })
    .join(' ');

  const hoveredRecord =
    hoveredIndex !== null && sortedRecords[hoveredIndex]
      ? sortedRecords[hoveredIndex]
      : activeRecord;

  const filteredVarianceRows = summaryRows.filter(
    (r) => r.periodGroup === variancePeriod
  );

  return (
    <div className="space-y-8">
      {/* Section Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-blue-700 tracking-wide">
            {t.analyticsKicker}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {t.analyticsTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.analyticsSubtitle(activeRecord.date)}
          </p>
        </div>

        {/* Interactive Chart Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Focus filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setLineFocus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lineFocus === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterAllLines}
            </button>
            <button
              type="button"
              onClick={() => setLineFocus('uphA')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lineFocus === 'uphA'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              UPH-A
            </button>
            <button
              type="button"
              onClick={() => setLineFocus('uphB')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lineFocus === 'uphB'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              UPH-B
            </button>
            <button
              type="button"
              onClick={() => setLineFocus('uphAll')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lineFocus === 'uphAll'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              UPH All line
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setChartMode('grouped-bar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartMode === 'grouped-bar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {t.chartGroupedBar}
            </button>
            <button
              type="button"
              onClick={() => setChartMode('trend-line')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartMode === 'trend-line'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {t.chartTrendLine}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart 1: Daily UPH Trend & Target Comparison */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.chart1Title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.chart1Subtitle}</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            {(lineFocus === 'all' || lineFocus === 'uphA') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
                <span>{t.legendUphA}</span>
              </div>
            )}
            {(lineFocus === 'all' || lineFocus === 'uphAll') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-700 inline-block" />
                <span>{t.legendUphAll}</span>
              </div>
            )}
            {(lineFocus === 'all' || lineFocus === 'uphB') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
                <span>{t.legendUphB}</span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="mt-4 overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[680px] select-none"
            role="img"
            aria-label={t.chart1Title}
          >
            {/* Horizontal grid lines */}
            {[0, 40, 80, 120, 160, 200].map((tick) => {
              const y = yToPx(tick);
              return (
                <g key={tick}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray={tick === 0 ? undefined : '3 3'}
                    strokeWidth={1}
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[11px] font-mono"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Target Reference Lines */}
            {(lineFocus === 'all' || lineFocus === 'uphA') && (
              <g>
                <line
                  x1={padLeft}
                  y1={yToPx(RF_TARGETS.uphA)}
                  x2={svgWidth - padRight}
                  y2={yToPx(RF_TARGETS.uphA)}
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                />
                <text
                  x={svgWidth - padRight - 4}
                  y={yToPx(RF_TARGETS.uphA) - 6}
                  textAnchor="end"
                  className="fill-blue-700 text-[10px] font-mono font-semibold"
                >
                  Target UPH-A: 172
                </text>
              </g>
            )}

            {(lineFocus === 'all' || lineFocus === 'uphAll') && (
              <g>
                <line
                  x1={padLeft}
                  y1={yToPx(RF_TARGETS.uphAll)}
                  x2={svgWidth - padRight}
                  y2={yToPx(RF_TARGETS.uphAll)}
                  stroke="#334155"
                  strokeWidth={1.25}
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft + 6}
                  y={yToPx(RF_TARGETS.uphAll) - 6}
                  textAnchor="start"
                  className="fill-slate-700 text-[10px] font-mono font-semibold"
                >
                  Target All Line: 144
                </text>
              </g>
            )}

            {(lineFocus === 'all' || lineFocus === 'uphB') && (
              <g>
                <line
                  x1={padLeft}
                  y1={yToPx(RF_TARGETS.uphB)}
                  x2={svgWidth - padRight}
                  y2={yToPx(RF_TARGETS.uphB)}
                  stroke="#d97706"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                />
                <text
                  x={svgWidth - padRight - 4}
                  y={yToPx(RF_TARGETS.uphB) - 6}
                  textAnchor="end"
                  className="fill-amber-700 text-[10px] font-mono font-semibold"
                >
                  Target UPH-B: 115
                </text>
              </g>
            )}

            {/* Bars or Lines */}
            {chartMode === 'grouped-bar' ? (
              sortedRecords.map((rec, idx) => {
                const groupCenterX = padLeft + idx * xStep + xStep / 2;
                const isSelected = rec.date === activeRecord.date;
                const isHovered = hoveredIndex === idx;

                const series: {
                  key: string;
                  val: number;
                  color: string;
                }[] = [];
                if (lineFocus === 'all' || lineFocus === 'uphA') {
                  series.push({ key: 'uphA', val: rec.uphA, color: '#2563eb' });
                }
                if (lineFocus === 'all' || lineFocus === 'uphAll') {
                  series.push({
                    key: 'uphAll',
                    val: rec.uphAll,
                    color: '#334155',
                  });
                }
                if (lineFocus === 'all' || lineFocus === 'uphB') {
                  series.push({ key: 'uphB', val: rec.uphB, color: '#f59e0b' });
                }

                const barWidth = series.length === 1 ? 28 : 15;
                const gapBetweenBars = 3;
                const totalGroupWidth =
                  series.length * barWidth +
                  (series.length - 1) * gapBetweenBars;
                const startX = groupCenterX - totalGroupWidth / 2;

                return (
                  <g
                    key={rec.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onSelectDate(rec.date)}
                  >
                    <rect
                      x={padLeft + idx * xStep + 4}
                      y={padTop}
                      width={xStep - 8}
                      height={plotHeight}
                      rx={6}
                      fill={
                        isSelected
                          ? '#eff6ff'
                          : isHovered
                          ? '#f8fafc'
                          : 'transparent'
                      }
                      stroke={isSelected ? '#bfdbfe' : 'transparent'}
                      strokeWidth={1}
                    />

                    {series.map((s, sIdx) => {
                      const bx = startX + sIdx * (barWidth + gapBetweenBars);
                      const by = yToPx(s.val);
                      const bh = padTop + plotHeight - by;
                      return (
                        <g key={s.key}>
                          <rect
                            x={bx}
                            y={by}
                            width={barWidth}
                            height={Math.max(bh, 2)}
                            rx={3}
                            fill={s.color}
                            opacity={isSelected || isHovered ? 1 : 0.85}
                          />
                          {(series.length === 1 || isSelected || isHovered) && (
                            <text
                              x={bx + barWidth / 2}
                              y={by - 5}
                              textAnchor="middle"
                              className="fill-slate-800 text-[10px] font-mono font-semibold"
                            >
                              {s.val}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    <text
                      x={groupCenterX}
                      y={svgHeight - 14}
                      textAnchor="middle"
                      className={`text-[11px] font-mono ${
                        isSelected
                          ? 'fill-blue-700 font-bold'
                          : 'fill-slate-600 font-medium'
                      }`}
                    >
                      {rec.shortDate}
                    </text>
                  </g>
                );
              })
            ) : (
              /* Trend Line Mode */
              <g>
                {(lineFocus === 'all' || lineFocus === 'uphA') && (
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    points={buildPolyline((r) => r.uphA)}
                  />
                )}
                {(lineFocus === 'all' || lineFocus === 'uphAll') && (
                  <polyline
                    fill="none"
                    stroke="#334155"
                    strokeWidth={2.5}
                    points={buildPolyline((r) => r.uphAll)}
                  />
                )}
                {(lineFocus === 'all' || lineFocus === 'uphB') && (
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    points={buildPolyline((r) => r.uphB)}
                  />
                )}

                {sortedRecords.map((rec, idx) => {
                  const cx = padLeft + idx * xStep + xStep / 2;
                  const isSelected = rec.date === activeRecord.date;
                  const isHovered = hoveredIndex === idx;

                  return (
                    <g
                      key={rec.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => onSelectDate(rec.date)}
                    >
                      <rect
                        x={padLeft + idx * xStep + 4}
                        y={padTop}
                        width={xStep - 8}
                        height={plotHeight}
                        fill={
                          isSelected
                            ? 'rgba(239, 246, 255, 0.7)'
                            : isHovered
                            ? 'rgba(248, 250, 252, 0.7)'
                            : 'transparent'
                        }
                      />
                      {(lineFocus === 'all' || lineFocus === 'uphA') && (
                        <g>
                          <circle
                            cx={cx}
                            cy={yToPx(rec.uphA)}
                            r={isSelected ? 5.5 : 4}
                            fill="#ffffff"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                          />
                          <text
                            x={cx}
                            y={yToPx(rec.uphA) - 8}
                            textAnchor="middle"
                            className="fill-blue-700 text-[10px] font-mono font-semibold"
                          >
                            {rec.uphA}
                          </text>
                        </g>
                      )}
                      {(lineFocus === 'all' || lineFocus === 'uphAll') && (
                        <circle
                          cx={cx}
                          cy={yToPx(rec.uphAll)}
                          r={isSelected ? 5 : 3.5}
                          fill="#ffffff"
                          stroke="#334155"
                          strokeWidth={2.5}
                        />
                      )}
                      {(lineFocus === 'all' || lineFocus === 'uphB') && (
                        <g>
                          <circle
                            cx={cx}
                            cy={yToPx(rec.uphB)}
                            r={isSelected ? 5.5 : 4}
                            fill="#ffffff"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                          />
                          <text
                            x={cx}
                            y={yToPx(rec.uphB) + 15}
                            textAnchor="middle"
                            className="fill-amber-700 text-[10px] font-mono font-semibold"
                          >
                            {rec.uphB}
                          </text>
                        </g>
                      )}
                      <text
                        x={cx}
                        y={svgHeight - 14}
                        textAnchor="middle"
                        className={`text-[11px] font-mono ${
                          isSelected
                            ? 'fill-blue-700 font-bold'
                            : 'fill-slate-600 font-medium'
                        }`}
                      >
                        {rec.shortDate}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Selected / Hovered Day Inspector Strip */}
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-xs">
          <div className="md:col-span-2">
            <span className="text-slate-500">{t.selectedDayLabel}</span>
            <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
              {hoveredRecord.date} ·{' '}
              <span className="font-sans font-normal text-slate-600">
                {getLocalizedShiftNote(
                  hoveredRecord.id,
                  hoveredRecord.shiftNote,
                  lang
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-start gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-600">UPH-A:</span>
            <span className="font-mono font-bold text-slate-900">
              {hoveredRecord.uphA}
            </span>
            <span className="font-mono text-red-600">
              ({hoveredRecord.uphA - RF_TARGETS.uphA})
            </span>
          </div>
          <div className="flex items-center justify-between md:justify-start gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-600">UPH-B:</span>
            <span className="font-mono font-bold text-slate-900">
              {hoveredRecord.uphB}
            </span>
            <span className="font-mono text-red-600">
              ({hoveredRecord.uphB - RF_TARGETS.uphB})
            </span>
          </div>
          <div className="flex items-center justify-between md:justify-start gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-600">UPPH / Idle:</span>
            <span className="font-mono font-bold text-emerald-700">
              {hoveredRecord.upphAll.toFixed(2)} ·{' '}
              {hoveredRecord.idleTimePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Analytics Row: Chart 2 (UPPH & Idle Time Trend) + Chart 3 (Target Gap Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Cols: UPPH & Idle Time Daily Efficiency Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.chart2Title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.chart2Subtitle}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
                  <span className="text-slate-700">{t.legendUpph}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-sky-500 inline-block" />
                  <span className="text-slate-700">{t.legendIdle}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <svg
                viewBox={`0 0 ${effWidth} ${effHeight}`}
                className="w-full h-auto min-w-[560px] select-none"
                role="img"
                aria-label={t.chart2Title}
              >
                {[0, 0.08, 0.16, 0.24, 0.32].map((uTick, i) => {
                  const y = upphToY(uTick);
                  const idleEquivalent = (i * 1.5).toFixed(1);
                  return (
                    <g key={uTick}>
                      <line
                        x1={effPadLeft}
                        y1={y}
                        x2={effWidth - effPadRight}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray={i === 0 ? undefined : '3 3'}
                      />
                      <text
                        x={effPadLeft - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-emerald-700 text-[10px] font-mono"
                      >
                        {uTick.toFixed(2)}
                      </text>
                      <text
                        x={effWidth - effPadRight + 8}
                        y={y + 4}
                        textAnchor="start"
                        className="fill-sky-700 text-[10px] font-mono"
                      >
                        {idleEquivalent}%
                      </text>
                    </g>
                  );
                })}

                {/* Target UPPH 0.21 line */}
                <line
                  x1={effPadLeft}
                  y1={upphToY(RF_TARGETS.upphAll)}
                  x2={effWidth - effPadRight}
                  y2={upphToY(RF_TARGETS.upphAll)}
                  stroke="#059669"
                  strokeDasharray="5 4"
                  strokeWidth={1.25}
                />
                <text
                  x={effPadLeft + 6}
                  y={upphToY(RF_TARGETS.upphAll) - 5}
                  className="fill-emerald-700 text-[10px] font-mono font-semibold"
                >
                  Target UPPH: 0.21
                </text>

                {/* Target Idle Time <= 5.0% line */}
                <line
                  x1={effPadLeft}
                  y1={idleToY(RF_TARGETS.idleTimePct)}
                  x2={effWidth - effPadRight}
                  y2={idleToY(RF_TARGETS.idleTimePct)}
                  stroke="#0284c7"
                  strokeDasharray="5 4"
                  strokeWidth={1.25}
                />
                <text
                  x={effWidth - effPadRight - 6}
                  y={idleToY(RF_TARGETS.idleTimePct) - 5}
                  textAnchor="end"
                  className="fill-sky-700 text-[10px] font-mono font-semibold"
                >
                  Max Idle Ceiling: 5.0%
                </text>

                {/* Idle Time Bars */}
                {sortedRecords.map((rec, idx) => {
                  const cx = effPadLeft + idx * effXStep + effXStep / 2;
                  const barW = 22;
                  const by = idleToY(rec.idleTimePct);
                  const bh = effPadTop + effPlotHeight - by;
                  const isSelected = rec.date === activeRecord.date;

                  return (
                    <g
                      key={rec.id}
                      className="cursor-pointer"
                      onClick={() => onSelectDate(rec.date)}
                    >
                      <rect
                        x={cx - barW / 2}
                        y={by}
                        width={barW}
                        height={Math.max(bh, 2)}
                        rx={3}
                        fill={isSelected ? '#0284c7' : '#38bdf8'}
                        opacity={isSelected ? 0.95 : 0.45}
                      />
                      <text
                        x={cx}
                        y={by - 5}
                        textAnchor="middle"
                        className="fill-sky-800 text-[10px] font-mono font-semibold"
                      >
                        {rec.idleTimePct.toFixed(1)}%
                      </text>
                      <text
                        x={cx}
                        y={effHeight - 12}
                        textAnchor="middle"
                        className={`text-[11px] font-mono ${
                          isSelected
                            ? 'fill-blue-700 font-bold'
                            : 'fill-slate-600'
                        }`}
                      >
                        {rec.shortDate}
                      </text>
                    </g>
                  );
                })}

                {/* UPPH Line Overlay */}
                <polyline
                  fill="none"
                  stroke="#059669"
                  strokeWidth={2.5}
                  points={upphLinePoints}
                />
                {sortedRecords.map((rec, idx) => {
                  const cx = effPadLeft + idx * effXStep + effXStep / 2;
                  const cy = upphToY(rec.upphAll);
                  const isSelected = rec.date === activeRecord.date;
                  return (
                    <g
                      key={`upph-${rec.id}`}
                      className="cursor-pointer"
                      onClick={() => onSelectDate(rec.date)}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 5.5 : 4}
                        fill="#ffffff"
                        stroke="#059669"
                        strokeWidth={2.5}
                      />
                      <text
                        x={cx}
                        y={cy - 8}
                        textAnchor="middle"
                        className="fill-emerald-800 text-[10px] font-mono font-bold"
                      >
                        {rec.upphAll.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Summary Insight Footer inside Chart 2 */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              {t.mtdUpphSummary}{' '}
              <strong className="font-mono text-emerald-700">
                {mtdAverages.upphAll.toFixed(2)}
              </strong>{' '}
              (+{(mtdAverages.upphAll - RF_TARGETS.upphAll).toFixed(2)}{' '}
              {t.aboveTargetSuffix})
            </span>
            <span>
              {t.mtdIdleSummary}{' '}
              <strong className="font-mono text-emerald-700">
                {mtdAverages.idleTimePct.toFixed(2)}%
              </strong>{' '}
              (+{(RF_TARGETS.idleTimePct - mtdAverages.idleTimePct).toFixed(2)}%{' '}
              {t.betterThanCeilingSuffix})
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Gap Variance Chart & Operational Root Cause Analysis */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.chart3Title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.chart3Subtitle}
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setVariancePeriod('daily')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    variancePeriod === 'daily'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.periodDailyBtn(activeRecord.shortDate)}
                </button>
                <button
                  type="button"
                  onClick={() => setVariancePeriod('mtd')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    variancePeriod === 'mtd'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.periodMtdBtn}
                </button>
              </div>
            </div>

            {/* Horizontal Progress / Variance Bars */}
            <div className="mt-4 space-y-4">
              {filteredVarianceRows.map((row) => {
                const isIdleMetric = row.topic.includes('Idle Time');
                const achievementPct = isIdleMetric
                  ? Math.min(
                      100,
                      Math.max(
                        15,
                        ((row.targetValue - row.actualValue + row.targetValue) /
                          row.targetValue) *
                          50
                      )
                    )
                  : Math.min(
                      120,
                      Math.round((row.actualValue / row.targetValue) * 100)
                    );

                return (
                  <div key={row.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {row.topic}
                      </span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-500">
                          {t.targetLabel}:{' '}
                          <strong className="text-slate-700">
                            {row.targetDisplay}
                          </strong>
                        </span>
                        <span className="text-slate-500">
                          {t.actualLabel}:{' '}
                          <strong className="text-slate-900">
                            {row.actualDisplay}
                          </strong>
                        </span>
                        <span
                          className={`font-bold inline-flex items-center gap-0.5 ${
                            row.isFavorable
                              ? 'text-emerald-700'
                              : 'text-red-600'
                          }`}
                        >
                          {row.isFavorable ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                          {row.gapDisplay}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-sm overflow-hidden relative">
                      <div
                        className={`h-full transition-transform duration-200 ${
                          row.isFavorable ? 'bg-emerald-600' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(100, achievementPct)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Executive Diagnostic Summary Box */}
          <div className="mt-6 pt-4 border-t border-slate-200 space-y-2.5 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-700" />
              <span>{t.diagnosticTitle}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong className="text-slate-900">
                {t.diagnosticPoint1Title}
              </strong>{' '}
              {t.diagnosticPoint1Body(
                activeRecord.upphAll.toFixed(2),
                activeRecord.idleTimePct.toFixed(1)
              )}
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong className="text-slate-900">
                {t.diagnosticPoint2Title}
              </strong>{' '}
              {t.diagnosticPoint2Body(
                activeRecord.uphA - RF_TARGETS.uphA,
                activeRecord.uphB - RF_TARGETS.uphB
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
