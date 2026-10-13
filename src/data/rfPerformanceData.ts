export interface DailyRFRecord {
  id: string;
  date: string; // DD/MM/YYYY e.g. "10/10/2026"
  isoDate: string; // YYYY-MM-DD e.g. "2026-10-10"
  shortDate: string; // e.g. "10 Oct"
  uphA: number;
  uphB: number;
  uphAll: number;
  upphAll: number;
  idleTimePct: number; // e.g. 1.6 means 1.6%
  activeOperatorsA: number;
  activeOperatorsB: number;
  shiftNote: string;
}

export interface UpdateHistoryEntry {
  id: string;
  timestamp: string; // e.g. "13/10/2026 09:20:15"
  isoTimestamp: string;
  targetDate: string; // e.g. "10/10/2026"
  actionType: 'date_change' | 'month_change' | 'metric_update' | 'record_add' | 'revert';
  field: string;
  oldValue: string;
  newValue: string;
  note?: string;
}

export interface PerformanceRow {
  id: string;
  periodGroup: 'daily' | 'mtd';
  periodLabel: string;
  topic: string;
  topicDescription: string;
  targetDisplay: string;
  targetValue: number;
  actualDisplay: string;
  actualValue: number;
  gapDisplay: string;
  gapValue: number;
  isFavorable: boolean;
  status: 'Achieved' | 'Below target';
  unit: string;
}

export const RF_TARGETS = {
  uphAll: 144,
  uphA: 172,
  uphB: 115,
  upphAll: 0.21,
  idleTimePct: 5.0, // <= 5%
} as const;

export const INITIAL_DAILY_RECORDS: DailyRFRecord[] = [
  {
    id: '2026-10-01',
    date: '01/10/2026',
    isoDate: '2026-10-01',
    shortDate: '01 Oct',
    uphA: 118,
    uphB: 96,
    uphAll: 107,
    upphAll: 0.22,
    idleTimePct: 3.4,
    activeOperatorsA: 26,
    activeOperatorsB: 22,
    shiftNote: 'เริ่มต้นกะต้นเดือน ปรับสมดุลสถานี RF-A',
  },
  {
    id: '2026-10-02',
    date: '02/10/2026',
    isoDate: '2026-10-02',
    shortDate: '02 Oct',
    uphA: 114,
    uphB: 99,
    uphAll: 107,
    upphAll: 0.23,
    idleTimePct: 3.2,
    activeOperatorsA: 25,
    activeOperatorsB: 22,
    shiftNote: 'Line B เดินเครื่องต่อเนื่อง อัตรา Idle ลดลง',
  },
  {
    id: '2026-10-03',
    date: '03/10/2026',
    isoDate: '2026-10-03',
    shortDate: '03 Oct',
    uphA: 121,
    uphB: 102,
    uphAll: 112,
    upphAll: 0.24,
    idleTimePct: 2.8,
    activeOperatorsA: 26,
    activeOperatorsB: 21,
    shiftNote: 'UPPH ดีขึ้นจากการลดเวลารอชิ้นงานระหว่างสถานี',
  },
  {
    id: '2026-10-04',
    date: '04/10/2026',
    isoDate: '2026-10-04',
    shortDate: '04 Oct',
    uphA: 116,
    uphB: 95,
    uphAll: 106,
    upphAll: 0.22,
    idleTimePct: 3.5,
    activeOperatorsA: 25,
    activeOperatorsB: 21,
    shiftNote: 'เปลี่ยนล็อตงานทดสอบคลื่นความถี่ช่วงบ่าย',
  },
  {
    id: '2026-10-05',
    date: '05/10/2026',
    isoDate: '2026-10-05',
    shortDate: '05 Oct',
    uphA: 125,
    uphB: 104,
    uphAll: 115,
    upphAll: 0.25,
    idleTimePct: 2.5,
    activeOperatorsA: 26,
    activeOperatorsB: 20,
    shiftNote: 'ประสิทธิภาพรายบุคคล (UPPH) แตะระดับ 0.25',
  },
  {
    id: '2026-10-06',
    date: '06/10/2026',
    isoDate: '2026-10-06',
    shortDate: '06 Oct',
    uphA: 119,
    uphB: 97,
    uphAll: 108,
    upphAll: 0.24,
    idleTimePct: 2.9,
    activeOperatorsA: 25,
    activeOperatorsB: 20,
    shiftNote: 'บำรุงรักษาหัววัด RF ตามรอบปกติ 15 นาที',
  },
  {
    id: '2026-10-07',
    date: '07/10/2026',
    isoDate: '2026-10-07',
    shortDate: '07 Oct',
    uphA: 122,
    uphB: 101,
    uphAll: 112,
    upphAll: 0.25,
    idleTimePct: 2.6,
    activeOperatorsA: 25,
    activeOperatorsB: 20,
    shiftNote: 'ลดเวลา Idle Time ลงต่อเนื่องต่ำกว่า 2.7%',
  },
  {
    id: '2026-10-08',
    date: '08/10/2026',
    isoDate: '2026-10-08',
    shortDate: '08 Oct',
    uphA: 126,
    uphB: 100,
    uphAll: 113,
    upphAll: 0.25,
    idleTimePct: 2.3,
    activeOperatorsA: 26,
    activeOperatorsB: 20,
    shiftNote: 'Line A เพิ่มความเร็วการสแกนตรวจสอบสำเร็จ',
  },
  {
    id: '2026-10-09',
    date: '09/10/2026',
    isoDate: '2026-10-09',
    shortDate: '09 Oct',
    uphA: 127,
    uphB: 97,
    uphAll: 114,
    upphAll: 0.25,
    idleTimePct: 2.2,
    activeOperatorsA: 26,
    activeOperatorsB: 19,
    shiftNote: 'ปรับกำลังคนจาก Line B ช่วยสนับสนุน Line A',
  },
  {
    id: '2026-10-10',
    date: '10/10/2026',
    isoDate: '2026-10-10',
    shortDate: '10 Oct',
    uphA: 142,
    uphB: 89,
    uphAll: 116,
    upphAll: 0.25,
    idleTimePct: 1.6,
    activeOperatorsA: 28,
    activeOperatorsB: 18,
    shiftNote: 'UPH-A พุ่งสูงสุดของเดือน (142) และ Idle Time ต่ำสุดที่ 1.6%',
  },
];

export function computeSummaryRows(
  records: DailyRFRecord[],
  selectedDate: string,
  customMonthLabel: string = "Oct'2026"
): {
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
} {
  const sorted = [...records].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  const dailyRecord =
    sorted.find((r) => r.date === selectedDate) || sorted[sorted.length - 1];

  // Calculate MTD up to selectedDate
  const mtdSlice = sorted.filter((r) => r.isoDate <= dailyRecord.isoDate);
  const count = mtdSlice.length || 1;

  const avgUphAll = Math.round(
    mtdSlice.reduce((acc, r) => acc + r.uphAll, 0) / count
  );
  const avgUphA = Math.round(
    mtdSlice.reduce((acc, r) => acc + r.uphA, 0) / count
  );
  const avgUphB = Math.round(
    mtdSlice.reduce((acc, r) => acc + r.uphB, 0) / count
  );
  const avgUpphAll = Number(
    (mtdSlice.reduce((acc, r) => acc + r.upphAll, 0) / count).toFixed(2)
  );
  const avgIdleTimePct = Number(
    (mtdSlice.reduce((acc, r) => acc + r.idleTimePct, 0) / count).toFixed(2)
  );

  // Format helpers
  const formatSignedInt = (val: number) => (val > 0 ? `+${val}` : `${val}`);
  const formatSignedDecimal = (val: number, decimals = 2) => {
    const fixed = val.toFixed(decimals);
    return val > 0 ? `+${fixed}` : fixed;
  };

  // Daily Gaps
  const gapDailyUphA = dailyRecord.uphA - RF_TARGETS.uphA;
  const gapDailyUphB = dailyRecord.uphB - RF_TARGETS.uphB;
  const gapDailyUpph = Number(
    (dailyRecord.upphAll - RF_TARGETS.upphAll).toFixed(2)
  );
  // For Idle Time, Target is <= 5%, so Gap = 5% - Actual (positive means below 5% ceiling)
  const gapDailyIdle = Number(
    (RF_TARGETS.idleTimePct - dailyRecord.idleTimePct).toFixed(2)
  );

  // MTD Gaps
  const gapMtdUphAll = avgUphAll - RF_TARGETS.uphAll;
  const gapMtdUphA = avgUphA - RF_TARGETS.uphA;
  const gapMtdUphB = avgUphB - RF_TARGETS.uphB;
  const gapMtdUpph = Number((avgUpphAll - RF_TARGETS.upphAll).toFixed(2));
  const gapMtdIdle = Number(
    (RF_TARGETS.idleTimePct - avgIdleTimePct).toFixed(2)
  );

  const periodDateLabel = `Result ${dailyRecord.date}`;

  const rows: PerformanceRow[] = [
    // Daily rows (matching exact order in uploaded image)
    {
      id: 'daily-uph-a',
      periodGroup: 'daily',
      periodLabel: periodDateLabel,
      topic: 'UPH-A',
      topicDescription: 'Units Per Hour — Production Line A',
      targetDisplay: `${RF_TARGETS.uphA}`,
      targetValue: RF_TARGETS.uphA,
      actualDisplay: `${dailyRecord.uphA}`,
      actualValue: dailyRecord.uphA,
      gapDisplay: formatSignedInt(gapDailyUphA),
      gapValue: gapDailyUphA,
      isFavorable: gapDailyUphA >= 0,
      status: gapDailyUphA >= 0 ? 'Achieved' : 'Below target',
      unit: 'units/hr',
    },
    {
      id: 'daily-uph-b',
      periodGroup: 'daily',
      periodLabel: periodDateLabel,
      topic: 'UPH-B',
      topicDescription: 'Units Per Hour — Production Line B',
      targetDisplay: `${RF_TARGETS.uphB}`,
      targetValue: RF_TARGETS.uphB,
      actualDisplay: `${dailyRecord.uphB}`,
      actualValue: dailyRecord.uphB,
      gapDisplay: formatSignedInt(gapDailyUphB),
      gapValue: gapDailyUphB,
      isFavorable: gapDailyUphB >= 0,
      status: gapDailyUphB >= 0 ? 'Achieved' : 'Below target',
      unit: 'units/hr',
    },
    {
      id: 'daily-upph-all',
      periodGroup: 'daily',
      periodLabel: periodDateLabel,
      topic: 'UPPH All line',
      topicDescription: 'Units Per Person Hour — Combined Lines',
      targetDisplay: RF_TARGETS.upphAll.toFixed(2),
      targetValue: RF_TARGETS.upphAll,
      actualDisplay: dailyRecord.upphAll.toFixed(2),
      actualValue: dailyRecord.upphAll,
      gapDisplay: formatSignedDecimal(gapDailyUpph, 2),
      gapValue: gapDailyUpph,
      isFavorable: gapDailyUpph >= 0,
      status: gapDailyUpph >= 0 ? 'Achieved' : 'Below target',
      unit: 'units/person-hr',
    },
    {
      id: 'daily-idle-all',
      periodGroup: 'daily',
      periodLabel: periodDateLabel,
      topic: 'Idle Time All line',
      topicDescription: 'Station Idle Time Ratio (Target ≤ 5%)',
      targetDisplay: `≤${RF_TARGETS.idleTimePct}%`,
      targetValue: RF_TARGETS.idleTimePct,
      actualDisplay: `${dailyRecord.idleTimePct.toFixed(1)}%`,
      actualValue: dailyRecord.idleTimePct,
      gapDisplay: `${formatSignedDecimal(gapDailyIdle, 2)}%`,
      gapValue: gapDailyIdle,
      isFavorable: dailyRecord.idleTimePct <= RF_TARGETS.idleTimePct,
      status:
        dailyRecord.idleTimePct <= RF_TARGETS.idleTimePct
          ? 'Achieved'
          : 'Below target',
      unit: '%',
    },
    // MTD rows (matching exact order in uploaded image)
    {
      id: 'mtd-uph-all',
      periodGroup: 'mtd',
      periodLabel: customMonthLabel,
      topic: 'UPH All line (MTD)',
      topicDescription: 'Month-to-Date Average UPH Across All Lines',
      targetDisplay: `${RF_TARGETS.uphAll}`,
      targetValue: RF_TARGETS.uphAll,
      actualDisplay: `${avgUphAll}`,
      actualValue: avgUphAll,
      gapDisplay: formatSignedInt(gapMtdUphAll),
      gapValue: gapMtdUphAll,
      isFavorable: gapMtdUphAll >= 0,
      status: gapMtdUphAll >= 0 ? 'Achieved' : 'Below target',
      unit: 'units/hr',
    },
    {
      id: 'mtd-uph-a',
      periodGroup: 'mtd',
      periodLabel: customMonthLabel,
      topic: 'UPH-A (MTD)',
      topicDescription: 'Month-to-Date Average UPH — Line A',
      targetDisplay: `${RF_TARGETS.uphA}`,
      targetValue: RF_TARGETS.uphA,
      actualDisplay: `${avgUphA}`,
      actualValue: avgUphA,
      gapDisplay: formatSignedInt(gapMtdUphA),
      gapValue: gapMtdUphA,
      isFavorable: gapMtdUphA >= 0,
      status: gapMtdUphA >= 0 ? 'Achieved' : 'Below target',
      unit: 'units/hr',
    },
    {
      id: 'mtd-uph-b',
      periodGroup: 'mtd',
      periodLabel: customMonthLabel,
      topic: 'UPH-B (MTD)',
      topicDescription: 'Month-to-Date Average UPH — Line B',
      targetDisplay: `${RF_TARGETS.uphB}`,
      targetValue: RF_TARGETS.uphB,
      actualDisplay: `${avgUphB}`,
      actualValue: avgUphB,
      gapDisplay: formatSignedInt(gapMtdUphB),
      gapValue: gapMtdUphB,
      isFavorable: gapMtdUphB >= 0,
      status: gapMtdUphB >= 0 ? 'Achieved' : 'Below target',
      unit: 'units/hr',
    },
    {
      id: 'mtd-upph-all',
      periodGroup: 'mtd',
      periodLabel: customMonthLabel,
      topic: 'UPPH All line (MTD)',
      topicDescription: 'Month-to-Date Units Per Person Hour',
      targetDisplay: RF_TARGETS.upphAll.toFixed(2),
      targetValue: RF_TARGETS.upphAll,
      actualDisplay: avgUpphAll.toFixed(2),
      actualValue: avgUpphAll,
      gapDisplay: formatSignedDecimal(gapMtdUpph, 2),
      gapValue: gapMtdUpph,
      isFavorable: gapMtdUpph >= 0,
      status: gapMtdUpph >= 0 ? 'Achieved' : 'Below target',
      unit: 'units/person-hr',
    },
    {
      id: 'mtd-idle-all',
      periodGroup: 'mtd',
      periodLabel: customMonthLabel,
      topic: 'Idle Time All line (MTD)',
      topicDescription: 'Month-to-Date Idle Time Ratio (Target ≤ 5%)',
      targetDisplay: `≤${RF_TARGETS.idleTimePct}%`,
      targetValue: RF_TARGETS.idleTimePct,
      actualDisplay: `${avgIdleTimePct.toFixed(2)}%`,
      actualValue: avgIdleTimePct,
      gapDisplay: `${formatSignedDecimal(gapMtdIdle, 2)}%`,
      gapValue: gapMtdIdle,
      isFavorable: avgIdleTimePct <= RF_TARGETS.idleTimePct,
      status:
        avgIdleTimePct <= RF_TARGETS.idleTimePct ? 'Achieved' : 'Below target',
      unit: '%',
    },
  ];

  return {
    dailyRecord,
    mtdAverages: {
      uphAll: avgUphAll,
      uphA: avgUphA,
      uphB: avgUphB,
      upphAll: avgUpphAll,
      idleTimePct: avgIdleTimePct,
      daysCount: count,
    },
    rows,
  };
}
