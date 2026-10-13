import React from 'react';
import {
  DailyRFRecord,
  PerformanceRow,
  RF_TARGETS,
} from '../data/rfPerformanceData';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  CheckCircle2,
  AlertTriangle,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DashboardSummaryViewProps {
  lang: Language;
  selectedDate: string;
  monthLabel: string;
  dailyRecord: DailyRFRecord;
  mtdAverages: {
    uphAll: number;
    uphA: number;
    uphB: number;
    upphAll: number;
    idleTimePct: number;
    daysCount: number;
  };
  rows: PerformanceRow[];
  onNavigateToRca: () => void;
  onNavigateToSummaryTable: () => void;
}

export const DashboardSummaryView: React.FC<DashboardSummaryViewProps> = ({
  lang,
  selectedDate,
  monthLabel,
  dailyRecord,
  mtdAverages,
  rows,
  onNavigateToRca,
  onNavigateToSummaryTable,
}) => {
  const t = TRANSLATIONS[lang];

  // Calculate composite adherence score
  const uphAScore = Math.min(100, Math.round((dailyRecord.uphA / RF_TARGETS.uphA) * 100));
  const uphBScore = Math.min(100, Math.round((dailyRecord.uphB / RF_TARGETS.uphB) * 100));
  const upphScore = Math.min(100, Math.round((dailyRecord.upphAll / RF_TARGETS.upphAll) * 100));
  const idleScore =
    dailyRecord.idleTimePct <= RF_TARGETS.idleTimePct
      ? 100
      : Math.round((RF_TARGETS.idleTimePct / dailyRecord.idleTimePct) * 100);
  const compositeScore = Math.round(
    uphAScore * 0.3 + uphBScore * 0.2 + upphScore * 0.3 + idleScore * 0.2
  );

  // Manning assumptions based on shift logs
  const plannedOperatorsA = 34;
  const plannedOperatorsB = 24;
  const actualOperatorsA = dailyRecord.activeOperatorsA || 28;
  const actualOperatorsB = dailyRecord.activeOperatorsB || 18;
  const totalPlanned = plannedOperatorsA + plannedOperatorsB;
  const totalActual = actualOperatorsA + actualOperatorsB;
  const manningRatio = Math.round((totalActual / totalPlanned) * 100);

  // Multilingual content for Dashboard
  const content = {
    th: {
      cockpitKicker: `ศูนย์ควบคุมการดำเนินงานฝ่ายผลิต · ${monthLabel}`,
      adherenceTarget: 'เกณฑ์ความสอดคล้องเป้าหมาย',
      coreKpis: '4 ดัชนีหลัก',
      statusNominal: 'ปกติ (อยู่ในเกณฑ์ดี)',
      statusAction: 'ต้องติดตามแก้ไข',
      laborMultiplier: 'ประสิทธิภาพแรงงานรายคน (+19.0%)',
      idleRecord: 'เวลารอคอยสูญเปล่าต่ำสุดของเดือน (1.6%)',
      manningRootCause: 'สาเหตุหลักที่ UPH ไม่ถึงเป้าหมาย',
      stationManningA: `พนักงานประจำสถานี ${actualOperatorsA} / ${plannedOperatorsA} คน`,
      stationManningB: `พนักงานประจำสถานี ${actualOperatorsB} / ${plannedOperatorsB} คน`,
      stationManningAll: `รวมประจำสถานี ${totalActual} / ${totalPlanned} คน`,
      deficitText: `ขาด ${totalPlanned - totalActual} คน (-${100 - manningRatio}% กำลังคน)`,
      winsSub: 'สถานะผลงานด้านบุคคลและความเร็วสายการผลิตอยู่ในเกณฑ์ดีเยี่ยม',
      bottlenecksSub: 'ข้อเสนอแนะ: เติมกำลังคนเสริมสถานี RF 12-14 ตำแหน่ง',
      wins: [
        {
          title: 'ประสิทธิภาพรายคน (UPPH) ทะลุเป้า:',
          desc: `ทำได้ 0.25 (เป้า 0.21) พนักงานแต่ละคนทำงานได้เร็วกว่ามาตรฐานถึง +19%`,
        },
        {
          title: 'เวลาสูญเปล่า (Idle Time) ต่ำสุดเป็นสถิติใหม่:',
          desc: `ลดลงเหลือเพียง 1.6% (ต่ำกว่าเพดาน ≤5.0% ถึง 3.40%) แทบไม่มีการรอคอยชิ้นงาน`,
        },
        {
          title: 'Line A ปรับความเร็วทดสอบสำเร็จ:',
          desc: `UPH-A แตะระดับ 142 สูงสุดในรอบเดือนตุลาคมหลังปรับสมดุลสถานีสแกน RF`,
        },
      ],
      bottlenecks: [
        {
          title: 'ขาดกำลังคนประจำสถานีรวม 14 คน:',
          desc: `Line A มี 28 จากแผน 34 คน (-6 คน), Line B มี 18 จากแผน 24 คน (-6 คน) ทำให้เปิดสถานีสแกนได้ไม่เต็มความจุ`,
        },
        {
          title: 'Line B ดึงคนช่วย Line A:',
          desc: `ทำให้ผลผลิต UPH-B ลดลงเหลือ 89 (เป้า 115, ขาด -26 UPH)`,
        },
        {
          title: 'เวลาเปลี่ยนล็อตงานทดสอบ (Changeover):',
          desc: `การสลับหัววัด RF ใช้เวลาเพิ่มขึ้นประมาณ 15-20 นาทีต่อกะ`,
        },
      ],
    },
    zh: {
      cockpitKicker: `生产运营管理驾驶舱 · ${monthLabel}`,
      adherenceTarget: '目标达成基准',
      coreKpis: '4项核心指标',
      statusNominal: '正常 (绩效良好)',
      statusAction: '需重点跟进',
      laborMultiplier: '人均劳动生产率提升 (+19.0%)',
      idleRecord: '本月最低闲置率记录 (1.6%)',
      manningRootCause: 'UPH未达标的核心诱因',
      stationManningA: `工位在岗人员 ${actualOperatorsA} / ${plannedOperatorsA} 人`,
      stationManningB: `工位在岗人员 ${actualOperatorsB} / ${plannedOperatorsB} 人`,
      stationManningAll: `全线在岗人员 ${totalActual} / ${totalPlanned} 人`,
      deficitText: `缺编 ${totalPlanned - totalActual} 人 (编制缺口 -${100 - manningRatio}%)`,
      winsSub: '人员技能与产线运转速率均表现优异',
      bottlenecksSub: '改善建议：补充射频工位缺口人员 12-14 人',
      wins: [
        {
          title: '人均产能 (UPPH) 显著超越目标:',
          desc: `实绩 0.25 (目标 0.21)，每位员工的工作产出比标准提升 +19%`,
        },
        {
          title: '闲置工时率 (Idle Time) 创月度新低:',
          desc: `降至 1.6% (远低于 ≤5.0% 的控制上限，优于标准 3.40%)，几乎无工位等待浪费`,
        },
        {
          title: 'A 线测试节拍提速成功:',
          desc: `UPH-A 达到 142，为10月产能平衡调整后的最高水平`,
        },
      ],
      bottlenecks: [
        {
          title: '工位缺编总计 14 人:',
          desc: `A线在岗 28/34 人 (缺6人)，B线在岗 18/24 人 (缺6人)，导致测试工位无法全开`,
        },
        {
          title: 'B 线借调人员支援 A 线:',
          desc: `导致 B 线连续性受损，UPH-B 下降至 89 (目标 115，差距 -26 UPH)`,
        },
        {
          title: '批次切换耗时 (Changeover):',
          desc: `射频探针校准与批次切换每班增加约 15-20 分钟`,
        },
      ],
    },
    en: {
      cockpitKicker: `Executive Operations Cockpit · ${monthLabel}`,
      adherenceTarget: 'Target Adherence',
      coreKpis: '4 Core KPIs',
      statusNominal: 'Nominal (Healthy)',
      statusAction: 'Action Required',
      laborMultiplier: 'Labor Efficiency Multiplier (+19.0%)',
      idleRecord: 'Lowest Monthly Idle Record (1.6%)',
      manningRootCause: 'Primary Root Cause for UPH Gap',
      stationManningA: `Station Operators ${actualOperatorsA} / ${plannedOperatorsA}`,
      stationManningB: `Station Operators ${actualOperatorsB} / ${plannedOperatorsB}`,
      stationManningAll: `Total Operators ${totalActual} / ${totalPlanned}`,
      deficitText: `Deficit ${totalPlanned - totalActual} operators (-${100 - manningRatio}% staffing)`,
      winsSub: 'Personnel productivity and line pace are in exceptional condition',
      bottlenecksSub: 'Recommendation: Onboard 12-14 RF station operators',
      wins: [
        {
          title: 'Individual Productivity (UPPH) Exceeded Target:',
          desc: `Achieved 0.25 (target 0.21), individual operator throughput is +19% faster than benchmark`,
        },
        {
          title: 'Idle Time Reached Monthly Record Low:',
          desc: `Down to 1.6% (comfortably below ≤5.0% ceiling by 3.40%), minimal waiting between stations`,
        },
        {
          title: 'Line A Test Cadence Optimization:',
          desc: `UPH-A reached 142, the highest mark in October following station balancing`,
        },
      ],
      bottlenecks: [
        {
          title: 'Station Manning Deficit of 14 Operators:',
          desc: `Line A staffed at 28/34 (-6 ops), Line B at 18/24 (-6 ops); full test capacity cannot open`,
        },
        {
          title: 'Line B Operators Reassigned to Line A:',
          desc: `Compromised Line B continuity, dropping UPH-B to 89 (target 115, gap -26 UPH)`,
        },
        {
          title: 'Test Batch Changeover Time:',
          desc: `RF probe calibration and batch switchover added approx 15-20 mins per shift`,
        },
      ],
    },
  }[lang];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase">
            <Activity className="w-3.5 h-3.5" />
            <span>{content.cockpitKicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t.dashSummaryTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.dashSummarySubtitle(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateToSummaryTable}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <span>{t.navSummary}</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToRca}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t.dashViewRcaCta}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 Cockpit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Composite Health Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {t.dashOverallHealth}
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{compositeScore >= 80 ? content.statusNominal : content.statusAction}</span>
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-4xl font-bold text-slate-900 tabular-nums">
                {compositeScore}%
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                {t.dashOverallScore(compositeScore)}
              </div>
            </div>

            {/* Circular mini gauge */}
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={compositeScore >= 80 ? 'text-blue-600' : 'text-amber-500'}
                  strokeDasharray={`${compositeScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-slate-700">
                RF
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{content.adherenceTarget}</span>
            <span className="font-mono font-semibold text-slate-700">{content.coreKpis}</span>
          </div>
        </div>

        {/* Card 2: Labor Productivity (UPPH) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {t.dashLaborCardTitle}
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.statusAchieved}</span>
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-4xl font-bold text-slate-900 tabular-nums">
                {dailyRecord.upphAll.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{(dailyRecord.upphAll - RF_TARGETS.upphAll).toFixed(2)} ({upphScore}%)</span>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <div>{t.targetLabel}: {RF_TARGETS.upphAll.toFixed(2)}</div>
              <div className="text-slate-400 mt-0.5">MTD: {mtdAverages.upphAll.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{content.laborMultiplier}</span>
          </div>
        </div>

        {/* Card 3: Idle Time Control */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {t.dashIdleCardTitle}
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.statusAchieved}</span>
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-4xl font-bold text-slate-900 tabular-nums">
                {dailyRecord.idleTimePct.toFixed(1)}%
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{(RF_TARGETS.idleTimePct - dailyRecord.idleTimePct).toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <div>{t.targetLabel}: ≤{RF_TARGETS.idleTimePct}%</div>
              <div className="text-slate-400 mt-0.5">MTD: {mtdAverages.idleTimePct.toFixed(2)}%</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{content.idleRecord}</span>
          </div>
        </div>

        {/* Card 4: Staffing & Capacity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {t.dashCapacityTitle}
            </span>
            <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>{manningRatio}%</span>
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-4xl font-bold text-slate-900 tabular-nums">
                {totalActual} <span className="text-lg font-sans font-normal text-slate-500">/ {totalPlanned}</span>
              </div>
              <div className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>{content.deficitText}</span>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <div>Line A: {actualOperatorsA}/{plannedOperatorsA}</div>
              <div className="mt-0.5">Line B: {actualOperatorsB}/{plannedOperatorsB}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{content.manningRootCause}</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Line Throughput Breakdown vs Targets */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.dashLineThroughputTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedDate}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-600 rounded-xs" />
              <span>Line A ({t.targetLabel} 172)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 rounded-xs" />
              <span>Line B ({t.targetLabel} 115)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-700 rounded-xs" />
              <span>All Line ({t.targetLabel} 144)</span>
            </span>
          </div>
        </div>

        {/* 3 Progress Bars */}
        <div className="mt-6 space-y-5">
          {/* Line A */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Line A (UPH-A)</span>
                <span className="text-slate-500 font-mono">
                  ({content.stationManningA})
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-500">{t.targetLabel}: <strong className="text-slate-800">{RF_TARGETS.uphA}</strong></span>
                <span className="text-slate-500">{t.actualLabel}: <strong className="text-blue-900">{dailyRecord.uphA}</strong></span>
                <span className="text-red-600 font-bold">{t.gapLabel} {dailyRecord.uphA - RF_TARGETS.uphA} ({uphAScore}%)</span>
              </div>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-md overflow-hidden relative">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-md"
                style={{ width: `${Math.min(100, (dailyRecord.uphA / RF_TARGETS.uphA) * 100)}%` }}
              />
            </div>
          </div>

          {/* Line B */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Line B (UPH-B)</span>
                <span className="text-slate-500 font-mono">
                  ({content.stationManningB})
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-500">{t.targetLabel}: <strong className="text-slate-800">{RF_TARGETS.uphB}</strong></span>
                <span className="text-slate-500">{t.actualLabel}: <strong className="text-amber-900">{dailyRecord.uphB}</strong></span>
                <span className="text-red-600 font-bold">{t.gapLabel} {dailyRecord.uphB - RF_TARGETS.uphB} ({uphBScore}%)</span>
              </div>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-md overflow-hidden relative">
              <div
                className="h-full bg-amber-500 transition-all duration-300 rounded-md"
                style={{ width: `${Math.min(100, (dailyRecord.uphB / RF_TARGETS.uphB) * 100)}%` }}
              />
            </div>
          </div>

          {/* All Line */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">All Line Combined</span>
                <span className="text-slate-500 font-mono">
                  ({content.stationManningAll})
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-500">{t.targetLabel}: <strong className="text-slate-800">{RF_TARGETS.uphAll}</strong></span>
                <span className="text-slate-500">{t.actualLabel}: <strong className="text-slate-900">{dailyRecord.uphAll}</strong></span>
                <span className="text-red-600 font-bold">{t.gapLabel} {dailyRecord.uphAll - RF_TARGETS.uphAll}</span>
              </div>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-md overflow-hidden relative">
              <div
                className="h-full bg-slate-700 transition-all duration-300 rounded-md"
                style={{ width: `${Math.min(100, (dailyRecord.uphAll / RF_TARGETS.uphAll) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column: Key Wins vs Key Bottlenecks Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Wins Column */}
        <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-200">
              <Zap className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-emerald-950">
                {t.dashWinsTitle}
              </h3>
            </div>

            <ul className="mt-4 space-y-3.5 text-xs text-emerald-900">
              {content.wins.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-emerald-950">{w.title}</strong>{' '}
                    <span>{w.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-emerald-200/80 text-[11px] text-emerald-800">
            {content.winsSub}
          </div>
        </div>

        {/* Bottlenecks Column */}
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold text-amber-950">
                {t.dashBottlenecksTitle}
              </h3>
            </div>

            <ul className="mt-4 space-y-3.5 text-xs text-amber-950">
              {content.bottlenecks.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="font-semibold text-amber-950">{b.title}</strong>{' '}
                    <span>{b.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-200/80 flex items-center justify-between">
            <span className="text-[11px] text-amber-800">
              {content.bottlenecksSub}
            </span>
            <button
              type="button"
              onClick={onNavigateToRca}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{t.dashViewRcaCta}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
