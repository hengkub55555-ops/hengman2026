export type Language = 'th' | 'zh' | 'en';

export interface TranslationStrings {
  brandTitle: string;
  navDashboard: string;
  navSummary: string;
  navAnalytics: string;
  navRca: string;
  navDailyLog: string;
  navHistory: string;
  navReset: string;
  ctaLogResult: string;

  // Auto-save bar
  autoSaveLabel: string;
  autoSaveOn: string;
  autoSaveOff: string;
  savingStatus: string;
  savedLastAt: string;
  unsavedWarning: string;
  saveNowBtn: string;
  inlineEditOn: string;
  inlineEditOff: string;
  languageLabel: string;

  // Header & Hero
  kickerTelemetry: string;
  kickerCycle: string;
  kickerActiveReport: string;
  pageHeadline: string;
  resultDateLabel: string;
  downloadCsvBtn: string;

  // Status labels
  statusAchieved: string;
  statusBelowTarget: string;
  targetLabel: string;
  actualLabel: string;
  gapLabel: string;
  allFilter: string;

  // Summary Table
  summaryTableTitle: string;
  summaryTableSub: (date: string) => string;
  inlineEditActiveBtn: string;
  inlineEditToggleBtn: string;
  searchPlaceholder: string;
  colDate: string;
  colTopic: string;
  colTarget: string;
  colActual: string;
  colGap: string;
  colStatus: string;
  noMatchingRows: string;
  resultLabel: string;
  mtdSubLabel: string;

  // Topic descriptions
  topicDescriptions: Record<string, string>;

  // Analytics Section
  analyticsKicker: string;
  analyticsTitle: string;
  analyticsSubtitle: (date: string) => string;
  filterAllLines: string;
  chartGroupedBar: string;
  chartTrendLine: string;

  chart1Title: string;
  chart1Subtitle: string;
  legendUphA: string;
  legendUphAll: string;
  legendUphB: string;
  selectedDayLabel: string;

  chart2Title: string;
  chart2Subtitle: string;
  legendUpph: string;
  legendIdle: string;
  mtdUpphSummary: string;
  aboveTargetSuffix: string;
  mtdIdleSummary: string;
  betterThanCeilingSuffix: string;

  chart3Title: string;
  chart3Subtitle: string;
  periodDailyBtn: (shortDate: string) => string;
  periodMtdBtn: string;

  diagnosticTitle: string;
  diagnosticPoint1Title: string;
  diagnosticPoint1Body: (upph: string, idle: string) => string;
  diagnosticPoint2Title: string;
  diagnosticPoint2Body: (gapA: number, gapB: number) => string;

  // Daily Log Section
  dailyLogKicker: string;
  dailyLogTitle: (lastDate: string) => string;
  dailyLogSubtitle: string;
  addDailyRowBtn: string;
  colUphA: string;
  colUphB: string;
  colUphAll: string;
  colUpphAll: string;
  colIdleTime: string;
  colShiftNote: string;
  activeBadge: string;
  mtdAvgFooter: (days: number) => string;
  mtdAvgNote: (date: string) => string;

  // Footer
  footerTitle: string;
  footerAutoSaveActive: string;
  footerAutoSavePaused: string;
  footerSavedAt: string;
  exportCsvFooter: string;
  resetDefaultFooter: string;

  // Modal
  modalTitle: string;
  modalSubtitle: string;
  modalDateLabel: string;
  modalShiftNoteLabel: string;
  modalCancelBtn: string;
  modalSaveBtn: string;

  // Date & Month in-table editing & History
  editDateTooltip: string;
  editMonthTooltip: string;
  saveDateBtn: string;
  saveMonthBtn: string;
  cancelEditBtn: string;
  historyModalTitle: string;
  historyModalSubtitle: string;
  historyEmpty: string;
  historyColTime: string;
  historyColTarget: string;
  historyColAction: string;
  historyColField: string;
  historyColChange: string;
  historyColActionBtn: string;
  historyClearBtn: string;
  historyExportBtn: string;
  historyRevertBtn: string;
  historyCount: (count: number) => string;
  historyFilterAll: string;
  historySearchPlaceholder: string;
  actionDateChange: string;
  actionMonthChange: string;
  actionMetricUpdate: string;
  actionRecordAdd: string;
  actionRevert: string;
  revertSuccessMsg: string;

  // Dashboard Summary View
  dashSummaryTitle: string;
  dashSummarySubtitle: (date: string) => string;
  dashOverallHealth: string;
  dashOverallScore: (pct: number) => string;
  dashLaborCardTitle: string;
  dashIdleCardTitle: string;
  dashCapacityTitle: string;
  dashWinsTitle: string;
  dashBottlenecksTitle: string;
  dashViewRcaCta: string;
  dashPlannedHeadcount: string;
  dashActualHeadcount: string;
  dashLineThroughputTitle: string;
  dashLaborMultiplier: string;

  // Root Cause Analysis (RCA) View
  rcaTitle: string;
  rcaSubtitle: string;
  rcaIshikawaTab: string;
  rcaWhysTab: string;
  rcaParetoTab: string;
  rcaCapaTab: string;
  rcaCoreProblemTitle: string;
  rcaAddActionBtn: string;
  rcaStatusDone: string;
  rcaStatusProgress: string;
  rcaStatusPlanned: string;
  rcaFactorMan: string;
  rcaFactorMachine: string;
  rcaFactorMethod: string;
  rcaFactorMaterial: string;
  rcaFactorEnv: string;
}

export const DEFAULT_SHIFT_NOTES_I18N: Record<
  string,
  Record<Language, string>
> = {
  '2026-10-01': {
    th: 'เริ่มต้นกะต้นเดือน ปรับสมดุลสถานี RF-A',
    zh: '月初早班启动，完成 RF-A 工位平衡校准',
    en: 'Month-start shift kickoff; balanced RF-A station assignments',
  },
  '2026-10-02': {
    th: 'Line B เดินเครื่องต่อเนื่อง อัตรา Idle ลดลง',
    zh: 'B 线保持连续稳定运行，闲置率进一步下降',
    en: 'Line B continuous operation; station idle ratio reduced',
  },
  '2026-10-03': {
    th: 'UPPH ดีขึ้นจากการลดเวลารอชิ้นงานระหว่างสถานี',
    zh: '减少工位间物料等待时间，人均产能 (UPPH) 提升',
    en: 'UPPH improved by reducing inter-station part transfer wait',
  },
  '2026-10-04': {
    th: 'เปลี่ยนล็อตงานทดสอบคลื่นความถี่ช่วงบ่าย',
    zh: '下午切换射频测试批次，完成治具参数校准',
    en: 'Afternoon RF test batch changeover and fixture calibration',
  },
  '2026-10-05': {
    th: 'ประสิทธิภาพรายบุคคล (UPPH) แตะระดับ 0.25',
    zh: '人均小时产能 (UPPH) 达到 0.25 峰值水平',
    en: 'Individual labor efficiency (UPPH) reached 0.25 milestone',
  },
  '2026-10-06': {
    th: 'บำรุงรักษาหัววัด RF ตามรอบปกติ 15 นาที',
    zh: '执行 15 分钟例行射频探头预防性维护',
    en: 'Scheduled 15-min preventive maintenance on RF probes',
  },
  '2026-10-07': {
    th: 'ลดเวลา Idle Time ลงต่อเนื่องต่ำกว่า 2.7%',
    zh: '全线闲置时间持续优化并降至 2.7% 以下',
    en: 'Idle time consistently reduced below 2.7% across lines',
  },
  '2026-10-08': {
    th: 'Line A เพิ่มความเร็วการสแกนตรวจสอบสำเร็จ',
    zh: 'A 线射频扫描检测提速优化完成',
    en: 'Line A RF scan verification cycle time optimized',
  },
  '2026-10-09': {
    th: 'ปรับกำลังคนจาก Line B ช่วยสนับสนุน Line A',
    zh: '调配 B 线部分作业员支援 A 线高负荷工位',
    en: 'Cross-trained operators reallocated from Line B to support Line A',
  },
  '2026-10-10': {
    th: 'UPH-A พุ่งสูงสุดของเดือน (142) และ Idle Time ต่ำสุดที่ 1.6%',
    zh: 'UPH-A 创本月新高 (142)，全线闲置率降至最低 1.6%',
    en: 'UPH-A reached monthly high (142) with lowest Idle Time at 1.6%',
  },
};

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  th: {
    brandTitle: 'RF Performance Portal',
    navDashboard: 'Dashboard ภาพรวม',
    navSummary: 'ตารางสรุปผล',
    navAnalytics: 'กราฟวิเคราะห์รายวัน',
    navRca: 'วิเคราะห์สาเหตุ (RCA)',
    navDailyLog: 'ประวัติรายวัน',
    navHistory: 'ประวัติอัปเดตย้อนหลัง',
    navReset: 'คืนค่าเริ่มต้น',
    ctaLogResult: 'บันทึกผลรายวัน',

    autoSaveLabel: 'โหมดบันทึกอัตโนมัติบน Web (Auto-Save):',
    autoSaveOn: 'เปิดใช้งาน (ON)',
    autoSaveOff: 'ปิดชั่วคราว (OFF)',
    savingStatus: 'กำลังบันทึกข้อมูลลงเบราว์เซอร์อัตโนมัติ...',
    savedLastAt: 'บันทึกอัตโนมัติล่าสุดเมื่อ',
    unsavedWarning: 'มีการแก้ไขที่ยังไม่ได้บันทึก (โหมด Auto-Save ปิดอยู่)',
    saveNowBtn: 'บันทึกตอนนี้ (Save Now)',
    inlineEditOn: 'แก้ไขตัวเลขในตาราง: เปิด',
    inlineEditOff: 'แก้ไขตัวเลขในตาราง: ปิด',
    languageLabel: 'ภาษา:',

    kickerTelemetry: 'ระบบติดตามประสิทธิภาพสายการผลิต RF',
    kickerCycle: 'รอบเดือนตุลาคม 2026',
    kickerActiveReport: 'วันที่รายงานผล:',
    pageHeadline: 'สรุปผลการดำเนินงาน RF และกราฟวิเคราะห์การใช้งานรายวัน',
    resultDateLabel: 'วันที่แสดงผล (Result Date):',
    downloadCsvBtn: 'ดาวน์โหลด CSV',

    statusAchieved: 'Achieved (บรรลุเป้า)',
    statusBelowTarget: 'Below target (ต่ำกว่าเป้า)',
    targetLabel: 'เป้าหมาย',
    actualLabel: 'ทำได้จริง',
    gapLabel: 'ส่วนต่าง (Gap)',
    allFilter: 'ทั้งหมด',

    summaryTableTitle: 'RF PERFORMANCE SUMMARY',
    summaryTableSub: (date) =>
      `ตารางสรุปผลการดำเนินงานสายการผลิต RF ประจำวันที่ ${date} และยอดสะสมรายเดือน (Oct'2026 MTD)`,
    inlineEditActiveBtn: 'กำลังแก้ไขตัวเลขในตาราง (Auto-Save)',
    inlineEditToggleBtn: 'แก้ไขตัวเลขในตาราง',
    searchPlaceholder: 'ค้นหาหัวข้อ (เช่น UPH-A, Idle)...',
    colDate: 'Date (วันที่)',
    colTopic: 'Topic (หัวข้อตัวชี้วัด)',
    colTarget: 'Target (เป้าหมาย)',
    colActual: 'Actual (ผลจริง)',
    colGap: 'Gap (ส่วนต่าง)',
    colStatus: 'Status (สถานะ)',
    noMatchingRows: 'ไม่พบรายการตัวชี้วัดที่ตรงกับเงื่อนไขการกรอง',
    resultLabel: 'Result',
    mtdSubLabel: 'ยอดสะสมรายเดือน (MTD)',

    topicDescriptions: {
      'UPH-A': 'ผลผลิตต่อชั่วโมง — สายการผลิต A (Units Per Hour - Line A)',
      'UPH-B': 'ผลผลิตต่อชั่วโมง — สายการผลิต B (Units Per Hour - Line B)',
      'UPPH All line': 'ผลผลิตต่อคนต่อชั่วโมง — รวมทุกสายการผลิต',
      'Idle Time All line': 'อัตราเวลาว่างของสถานีงานรวม (เกณฑ์เป้าหมาย ≤ 5%)',
      'UPH All line (MTD)': 'ค่าเฉลี่ยผลผลิตต่อชั่วโมงสะสมรวมทุกสายการผลิต (MTD)',
      'UPH-A (MTD)': 'ค่าเฉลี่ยผลผลิตต่อชั่วโมงสะสม — สายการผลิต A (MTD)',
      'UPH-B (MTD)': 'ค่าเฉลี่ยผลผลิตต่อชั่วโมงสะสม — สายการผลิต B (MTD)',
      'UPPH All line (MTD)': 'ค่าเฉลี่ยผลผลิตต่อคนต่อชั่วโมงสะสมรวมทุกสาย (MTD)',
      'Idle Time All line (MTD)': 'ค่าเฉลี่ยอัตราเวลาว่างสะสมรวมทุกสาย (เกณฑ์ ≤ 5%)',
    },

    analyticsKicker: 'Daily Performance Analytics · บทวิเคราะห์และกราฟสรุปผลรายวัน',
    analyticsTitle: 'แนวโน้มผลผลิต (UPH) และประสิทธิภาพการทำงานรายวัน',
    analyticsSubtitle: (date) =>
      `คลิกที่แท่งกราฟหรือจุดข้อมูลในแต่ละวันเพื่อสลับดูผลลัพธ์รายวัน (${date}) เทียบกับค่าเฉลี่ยสะสมทั้งเดือน (Oct'2026 MTD)`,
    filterAllLines: 'ทุกสายการผลิต',
    chartGroupedBar: 'กราฟแท่งเปรียบเทียบ',
    chartTrendLine: 'กราฟเส้นแนวโน้ม',

    chart1Title:
      '01. กราฟสรุปผลผลิตต่อชั่วโมงรายวัน (Daily UPH: Line A vs Line B vs All Line)',
    chart1Subtitle:
      'เปรียบเทียบยอดผลิตจริงรายวันกับเส้นเป้าหมาย (Target UPH-A: 172 · Target All Line: 144 · Target UPH-B: 115)',
    legendUphA: 'UPH-A (เป้า 172)',
    legendUphAll: 'UPH All line (เป้า 144)',
    legendUphB: 'UPH-B (เป้า 115)',
    selectedDayLabel: 'วันที่เลือกดูข้อมูล (Selected Day):',

    chart2Title:
      '02. กราฟประสิทธิภาพรายบุคคล (UPPH) และอัตราเวลาว่าง (Idle Time %)',
    chart2Subtitle:
      'ค่า UPPH สูงกว่าเป้า 0.21 ทุกวัน และ Idle Time ลดลงต่ำสุดที่ 1.6% ในวันที่ 10/10/2026 (เกณฑ์ ≤5%)',
    legendUpph: 'UPPH (เป้า ≥0.21)',
    legendIdle: 'Idle Time % (เป้า ≤5%)',
    mtdUpphSummary: 'ค่าเฉลี่ยสะสม (MTD UPPH):',
    aboveTargetSuffix: 'เหนือเป้าหมาย',
    mtdIdleSummary: 'ค่าเฉลี่ยเวลาว่างสะสม (MTD Idle):',
    betterThanCeilingSuffix: 'ดีกว่าเกณฑ์',

    chart3Title: '03. วิเคราะห์ส่วนต่างเป้าหมาย (Target vs Actual Gap)',
    chart3Subtitle: 'เปรียบเทียบอัตราการบรรลุเป้าหมายรายตัวชี้วัด',
    periodDailyBtn: (shortDate) => `รายวัน (${shortDate})`,
    periodMtdBtn: "สะสม (Oct'2026)",

    diagnosticTitle: 'สรุปการวิเคราะห์เชิงลึก (Operational Diagnostic)',
    diagnosticPoint1Title: '1. ประสิทธิภาพรายบุคคลบรรลุเป้า (Achieved):',
    diagnosticPoint1Body: (upph, idle) =>
      `ค่า UPPH All line ทำได้ ${upph} (สูงกว่าเป้า 0.21) และ Idle Time ต่ำเพียง ${idle}% (ต่ำกว่าเพดาน ≤5%) สะท้อนว่าพนักงานหน้างานทำงานเต็มประสิทธิภาพและแทบไม่มีการสูญเสียเวลารอคอย`,
    diagnosticPoint2Title: '2. สาเหตุที่ UPH-A และ UPH-B ต่ำกว่าเป้า (Below target):',
    diagnosticPoint2Body: (gapA, gapB) =>
      `เนื่องจาก UPPH ต่อคนสูงกว่าเกณฑ์แล้ว ช่องว่างของยอดผลิตรวมรายชั่วโมง (UPH-A ${gapA}, UPH-B ${gapB}) จึงเกิดจากจำนวนสถานี/กำลังคนที่เข้าประจำสายการผลิตน้อยกว่าแผน ไม่ใช่ปัญหาด้านความเร็วของพนักงาน`,

    dailyLogKicker:
      "Daily Operations Log · ประวัติข้อมูลรายวันพร้อมบันทึกอัตโนมัติ (Oct'2026)",
    dailyLogTitle: (lastDate) =>
      `ตารางบันทึกผลการใช้งานรายวัน (01/10/2026 – ${lastDate})`,
    dailyLogSubtitle:
      'แก้ไขตัวเลขในแต่ละแถวได้โดยตรง ระบบจะบันทึกอัตโนมัติ (Auto-Save) และคำนวณกราฟพร้อมค่าเฉลี่ย MTD ทันที',
    addDailyRowBtn: 'เพิ่มวันใหม่ (Add Daily Row)',
    colUphA: 'UPH-A (เป้า 172)',
    colUphB: 'UPH-B (เป้า 115)',
    colUphAll: 'UPH All line (เป้า 144)',
    colUpphAll: 'UPPH All line (เป้า 0.21)',
    colIdleTime: 'Idle Time (เป้า ≤5%)',
    colShiftNote: 'หมายเหตุการเดินสายการผลิต (Shift Note)',
    activeBadge: 'กำลังแสดงผล',
    mtdAvgFooter: (days) => `Oct'2026 MTD เฉลี่ยสะสม (${days} วัน)`,
    mtdAvgNote: (date) => `คำนวณค่าเฉลี่ยสะสมอัตโนมัติถึงวันที่ ${date}`,

    footerTitle: 'RF Performance Summary & Daily Usage Analytics',
    footerAutoSaveActive: 'เปิดบันทึกอัตโนมัติ',
    footerAutoSavePaused: 'พักการบันทึกอัตโนมัติ',
    footerSavedAt: 'บันทึกล่าสุด',
    exportCsvFooter: 'ส่งออกรายงาน CSV',
    resetDefaultFooter: 'รีเซ็ตข้อมูลเริ่มต้น',

    modalTitle: 'บันทึกผลการใช้งานรายวัน (Log Daily RF Result)',
    modalSubtitle:
      'ข้อมูลที่เพิ่มจะถูกจัดเก็บในโหมดบันทึกอัตโนมัติบน Web ทันที',
    modalDateLabel: 'วันที่ปฏิบัติงาน (Date)',
    modalShiftNoteLabel: 'หมายเหตุกะการทำงาน (Shift Note)',
    modalCancelBtn: 'ยกเลิก',
    modalSaveBtn: 'บันทึกผลรายวัน',

    editDateTooltip: 'คลิกเพื่อแก้ไขวันที่ในตาราง',
    editMonthTooltip: 'คลิกเพื่อแก้ไขรอบเดือน (MTD) ในตาราง',
    saveDateBtn: 'บันทึกวันที่',
    saveMonthBtn: 'บันทึกเดือน',
    cancelEditBtn: 'ยกเลิก',
    historyModalTitle: 'ประวัติการอัปเดตและแก้ไขย้อนหลังบน Web (Audit History)',
    historyModalSubtitle:
      'บันทึกประวัติการแก้ไขตัวเลข วันที่ และเดือนย้อนหลังอัตโนมัติบน Web Storage',
    historyEmpty:
      'ยังไม่มีประวัติการแก้ไขย้อนหลัง (เมื่อแก้ไขตัวเลข วันที่ หรือเดือนในตาราง ระบบจะบันทึกที่นี่อัตโนมัติ)',
    historyColTime: 'เวลาที่บันทึก',
    historyColTarget: 'รอบข้อมูล/วันที่',
    historyColAction: 'ประเภทการแก้ไข',
    historyColField: 'รายการ/หัวข้อ',
    historyColChange: 'การเปลี่ยนแปลง (เดิม ➔ ใหม่)',
    historyColActionBtn: 'การจัดการ',
    historyClearBtn: 'ล้างประวัติ',
    historyExportBtn: 'ส่งออกประวัติ CSV',
    historyRevertBtn: 'คืนค่าเดิม',
    historyCount: (count: number) => `${count} รายการบันทึกย้อนหลัง`,
    historyFilterAll: 'ทุกประเภท',
    historySearchPlaceholder: 'ค้นหาประวัติ (วันที่, หัวข้อ, ค่า)...',
    actionDateChange: 'เปลี่ยนวันที่',
    actionMonthChange: 'เปลี่ยนรอบเดือน',
    actionMetricUpdate: 'อัปเดตตัวเลข',
    actionRecordAdd: 'เพิ่มวันใหม่',
    actionRevert: 'คืนค่าข้อมูล',
    revertSuccessMsg: 'คืนค่าข้อมูลเรียบร้อยแล้ว',

    // Dashboard Summary View
    dashSummaryTitle: 'RF Performance Dashboard Summary · สรุปภาพรวมผลการดำเนินงาน',
    dashSummarySubtitle: (date) =>
      `วิเคราะห์สถานะสายการผลิตประจำวันที่ ${date} และตัวชี้วัดสะสมเปรียบเทียบเป้าหมาย`,
    dashOverallHealth: 'ดัชนีประสิทธิภาพรวมสายการผลิต (Overall Performance Index)',
    dashOverallScore: (pct) => `${pct}% บรรลุตามแผน`,
    dashLaborCardTitle: 'ประสิทธิภาพผลผลิตรายบุคคล (Labor Efficiency - UPPH)',
    dashIdleCardTitle: 'การควบคุมเวลาสูญเปล่า (Idle Time Control)',
    dashCapacityTitle: 'อัตราจัดสรรกำลังคนประจำสถานี (Staffing & Capacity)',
    dashWinsTitle: 'จุดเด่นที่ทำได้สำเร็จตามเป้าหมาย (Key Wins)',
    dashBottlenecksTitle: 'จุดคอขวดและช่องว่างที่ต้องเร่งแก้ไข (Bottlenecks & Gaps)',
    dashViewRcaCta: 'เปิดการวิเคราะห์สาเหตุเชิงลึก (RCA)',
    dashPlannedHeadcount: 'กำลังคนตามแผน',
    dashActualHeadcount: 'กำลังคนที่ลงปฏิบัติการจริง',
    dashLineThroughputTitle: 'อัตราการผลิตต่อชั่วโมงเปรียบเทียบรายสาย (UPH Breakdown)',
    dashLaborMultiplier: 'ผลลัพธ์ต่อกำลังพลสูงกว่าเกณฑ์',

    // Root Cause Analysis (RCA) View
    rcaTitle: 'การวิเคราะห์สาเหตุเชิงลึก (Root Cause Analysis - RCA)',
    rcaSubtitle:
      'แผนผังสาเหตุและผล (4M1E Ishikawa), การวิเคราะห์ 5-Whys และมาตรการแก้ไขป้องกัน (CAPA)',
    rcaIshikawaTab: 'แผนผังก้างปลา 4M1E (Ishikawa)',
    rcaWhysTab: 'การวิเคราะห์ 5 Whys (5 Whys Analysis)',
    rcaParetoTab: 'สัดส่วนสาเหตุการสูญเสีย (Loss Factors)',
    rcaCapaTab: 'มาตรการแก้ไขและป้องกัน (CAPA Actions)',
    rcaCoreProblemTitle:
      'โจทย์หลัก: ทำไม UPH-A และ UPH-B ต่ำกว่าเป้าหมาย ทั้งที่ UPPH และ Idle Time บรรลุเป้า?',
    rcaAddActionBtn: 'เพิ่มมาตรการแก้ไขใหม่ (Add Action)',
    rcaStatusDone: 'เสร็จสิ้น (Done)',
    rcaStatusProgress: 'กำลังดำเนินการ (In Progress)',
    rcaStatusPlanned: 'ตามแผน (Planned)',
    rcaFactorMan: 'กำลังคน (Man)',
    rcaFactorMachine: 'เครื่องจักร/อุปกรณ์ (Machine)',
    rcaFactorMethod: 'วิธีการ/กระบวนการ (Method)',
    rcaFactorMaterial: 'ชิ้นงาน/วัตถุดิบ (Material)',
    rcaFactorEnv: 'สภาพแวดล้อม (Environment)',
  },

  zh: {
    brandTitle: 'RF 产能与日度分析平台',
    navDashboard: '管理驾驶舱总览',
    navSummary: '绩效汇总表',
    navAnalytics: '日度分析图表',
    navRca: '根本原因分析 (RCA)',
    navDailyLog: '每日记录明细',
    navHistory: '更新历史追溯',
    navReset: '恢复默认数据',
    ctaLogResult: '录入每日实绩',

    autoSaveLabel: '网页自动保存模式 (Web Auto-Save):',
    autoSaveOn: '已开启 (ON)',
    autoSaveOff: '已暂停 (OFF)',
    savingStatus: '正在自动保存数据至浏览器...',
    savedLastAt: '最近自动保存时间',
    unsavedWarning: '存在未保存的修改（自动保存已暂停）',
    saveNowBtn: '立即保存 (Save Now)',
    inlineEditOn: '表格内直接编辑: 开启',
    inlineEditOff: '表格内直接编辑: 关闭',
    languageLabel: '语言:',

    kickerTelemetry: 'RF 产线实时绩效监控',
    kickerCycle: '2026年10月生产周期',
    kickerActiveReport: '当前报告日期:',
    pageHeadline: 'RF 产线绩效汇总与每日使用率分析图表',
    resultDateLabel: '选择报告日期 (Result Date):',
    downloadCsvBtn: '导出 CSV 报表',

    statusAchieved: 'Achieved (达标)',
    statusBelowTarget: 'Below target (低于目标)',
    targetLabel: '目标',
    actualLabel: '实绩',
    gapLabel: '差异 (Gap)',
    allFilter: '全部',

    summaryTableTitle: 'RF PERFORMANCE SUMMARY (RF 绩效汇总表)',
    summaryTableSub: (date) =>
      `${date} 当日产线实绩与 2026年10月累计平均值 (Oct'2026 MTD) 对比表`,
    inlineEditActiveBtn: '正在表格内直接修改 (自动保存)',
    inlineEditToggleBtn: '在表格内修改数值',
    searchPlaceholder: '搜索指标名称 (如 UPH-A, Idle)...',
    colDate: 'Date (日期)',
    colTopic: 'Topic (考核指标)',
    colTarget: 'Target (目标值)',
    colActual: 'Actual (实际值)',
    colGap: 'Gap (差异值)',
    colStatus: 'Status (状态)',
    noMatchingRows: '未找到符合筛选条件的绩效指标',
    resultLabel: 'Result (当日实绩)',
    mtdSubLabel: '月度累计均值 (MTD)',

    topicDescriptions: {
      'UPH-A': '单位小时产能 — A 产线 (Units Per Hour - Line A)',
      'UPH-B': '单位小时产能 — B 产线 (Units Per Hour - Line B)',
      'UPPH All line': '人均小时产能 — 全产线合并 (Units Per Person Hour)',
      'Idle Time All line': '全产线工位闲置时间比例 (控制目标 ≤ 5%)',
      'UPH All line (MTD)': '月度累计单位小时产能均值 — 全产线 (MTD)',
      'UPH-A (MTD)': '月度累计单位小时产能均值 — A 产线 (MTD)',
      'UPH-B (MTD)': '月度累计单位小时产能均值 — B 产线 (MTD)',
      'UPPH All line (MTD)': '月度累计人均小时产能均值 — 全产线 (MTD)',
      'Idle Time All line (MTD)': '月度累计全线闲置时间比例均值 (目标 ≤ 5%)',
    },

    analyticsKicker: 'Daily Performance Analytics · 每日绩效趋势与诊断分析',
    analyticsTitle: '每日小时产能 (UPH) 与作业效率趋势分析',
    analyticsSubtitle: (date) =>
      `点击任意日期柱状图或数据节点即可切换查看当日 (${date}) 与月度累计 (Oct'2026 MTD) 绩效对比`,
    filterAllLines: '全部产线',
    chartGroupedBar: '分组柱状图',
    chartTrendLine: '趋势折线图',

    chart1Title: '01. 每日小时产能对比图 (Daily UPH: A线 vs B线 vs 全线均值)',
    chart1Subtitle:
      '每日实际产出与目标基准线对比 (A线目标: 172 · 全线目标: 144 · B线目标: 115)',
    legendUphA: 'UPH-A (目标 172)',
    legendUphAll: 'UPH All line (目标 144)',
    legendUphB: 'UPH-B (目标 115)',
    selectedDayLabel: '当前选中日期 (Selected Day):',

    chart2Title: '02. 每日人均小时产能 (UPPH) 与工位闲置率 (Idle Time %) 趋势',
    chart2Subtitle:
      '每日 UPPH 均高于 0.21 目标，且 10/10/2026 闲置率降至最低 1.6%（优于 ≤5% 上限）',
    legendUpph: 'UPPH (目标 ≥0.21)',
    legendIdle: 'Idle Time % (目标 ≤5%)',
    mtdUpphSummary: '月度累计人均产能 (MTD UPPH):',
    aboveTargetSuffix: '高于目标',
    mtdIdleSummary: '月度累计闲置率 (MTD Idle):',
    betterThanCeilingSuffix: '优于上限标准',

    chart3Title: '03. 目标与实绩差异分析 (Target vs Actual Gap)',
    chart3Subtitle: '各考核指标达成度与正负偏差条形分析',
    periodDailyBtn: (shortDate) => `当日 (${shortDate})`,
    periodMtdBtn: "月度累计 (Oct'2026)",

    diagnosticTitle: '深度运营诊断分析 (Operational Diagnostic)',
    diagnosticPoint1Title: '1. 人均作业效率与闲置率全面达标 (Achieved):',
    diagnosticPoint1Body: (upph, idle) =>
      `全线 UPPH 达到 ${upph}（高于 0.21 目标），且闲置率仅为 ${idle}%（远低于 ≤5% 上限），证明在岗作业人员操作熟练、工位等待损耗极低。`,
    diagnosticPoint2Title: '2. UPH-A 与 UPH-B 低于目标的根本原因 (Below target):',
    diagnosticPoint2Body: (gapA, gapB) =>
      `由于单人产出效率 (UPPH) 已超额达标，整线小时产能缺口（UPH-A ${gapA}，UPH-B ${gapB}）主要源于当日实际上岗人数/开启工位数少于满编计划，而非人员作业效率不足。`,

    dailyLogKicker: "Daily Operations Log · 每日运行记录与自动保存明细 (Oct'2026)",
    dailyLogTitle: (lastDate) => `每日产线实绩记录表 (01/10/2026 – ${lastDate})`,
    dailyLogSubtitle:
      '支持在表格内直接修改数值，系统将自动保存 (Auto-Save) 并实时重算图表与月度累计均值',
    addDailyRowBtn: '新增每日记录 (Add Daily Row)',
    colUphA: 'UPH-A (目标 172)',
    colUphB: 'UPH-B (目标 115)',
    colUphAll: 'UPH All line (目标 144)',
    colUpphAll: 'UPPH All line (目标 0.21)',
    colIdleTime: 'Idle Time (目标 ≤5%)',
    colShiftNote: '班次运行备注 (Shift Note)',
    activeBadge: '当前展示',
    mtdAvgFooter: (days) => `Oct'2026 月度累计均值 (${days} 天)`,
    mtdAvgNote: (date) => `自动汇总计算至 ${date} 的累计平均绩效`,

    footerTitle: 'RF 产线绩效汇总与每日使用率分析系统',
    footerAutoSaveActive: '自动保存已开启',
    footerAutoSavePaused: '自动保存已暂停',
    footerSavedAt: '最近保存于',
    exportCsvFooter: '导出 CSV 报表',
    resetDefaultFooter: '恢复初始默认数据',

    modalTitle: '录入/更新每日 RF 产线实绩 (Log Daily Result)',
    modalSubtitle: '保存后将通过网页自动保存模式持久化存储至浏览器',
    modalDateLabel: '作业日期 (Date)',
    modalShiftNoteLabel: '班次运行说明 (Shift Note)',
    modalCancelBtn: '取消',
    modalSaveBtn: '保存每日实绩',

    editDateTooltip: '点击直接修改表格内的日期',
    editMonthTooltip: '点击直接修改表格内的月度周期 (MTD)',
    saveDateBtn: '保存日期',
    saveMonthBtn: '保存月份',
    cancelEditBtn: '取消',
    historyModalTitle: '网页端历史更新与追溯记录 (Audit History Log)',
    historyModalSubtitle:
      '系统自动记录并持久化保存所有数值、日期及月份的历史修改操作',
    historyEmpty:
      '暂无历史修改记录（在表格中直接修改数值、日期或月份后将在此自动记录）',
    historyColTime: '更新时间',
    historyColTarget: '目标记录/日期',
    historyColAction: '修改类型',
    historyColField: '修改项目',
    historyColChange: '变更内容 (原值 ➔ 新值)',
    historyColActionBtn: '操作',
    historyClearBtn: '清空历史',
    historyExportBtn: '导出历史 CSV',
    historyRevertBtn: '撤销/还原',
    historyCount: (count: number) => `共 ${count} 条历史更新记录`,
    historyFilterAll: '全部类型',
    historySearchPlaceholder: '搜索历史记录 (日期、项目、数值)...',
    actionDateChange: '修改日期',
    actionMonthChange: '修改月度周期',
    actionMetricUpdate: '更新指标实绩',
    actionRecordAdd: '新增日期记录',
    actionRevert: '还原历史值',
    revertSuccessMsg: '已成功还原该项历史修改',

    // Dashboard Summary View
    dashSummaryTitle: 'RF 产线管理驾驶舱总览 · 运营实绩全景分析',
    dashSummarySubtitle: (date) =>
      `全面监控 ${date} 当日及月度累计产能达标率、工位排班与瓶颈指标`,
    dashOverallHealth: '产线综合绩效健康指数 (Overall Performance Index)',
    dashOverallScore: (pct) => `综合达标率 ${pct}%`,
    dashLaborCardTitle: '人均单时产出率 (Labor Efficiency - UPPH)',
    dashIdleCardTitle: '工位闲置损耗控制 (Idle Time Control)',
    dashCapacityTitle: '工位在岗人力定员配置率 (Staffing & Capacity)',
    dashWinsTitle: '优秀达标项目 (Key Wins)',
    dashBottlenecksTitle: '关键产线瓶颈与产出缺口 (Bottlenecks & Gaps)',
    dashViewRcaCta: '展开深入根本原因分析 (RCA)',
    dashPlannedHeadcount: '计划在岗定员',
    dashActualHeadcount: '实际上岗出勤人数',
    dashLineThroughputTitle: '各产线小时出产率对比 (UPH Breakdown)',
    dashLaborMultiplier: '单兵产出超越既定基准',

    // Root Cause Analysis (RCA) View
    rcaTitle: '产线缺口根本原因分析 (Root Cause Analysis - RCA)',
    rcaSubtitle:
      '4M1E 因果鱼骨图、5-Whys 深度推导树及纠正预防措施计划 (CAPA)',
    rcaIshikawaTab: '4M1E 鱼骨因果分析图 (Ishikawa)',
    rcaWhysTab: '5 Whys 追问分析 (5 Whys Analysis)',
    rcaParetoTab: '产能损耗主因柏拉图 (Loss Factors)',
    rcaCapaTab: '纠正与预防措施行动项 (CAPA Actions)',
    rcaCoreProblemTitle:
      '核心问题：为何 UPPH 超标且闲置率极低，而 UPH-A 和 UPH-B 总产能却未达标？',
    rcaAddActionBtn: '新增改善措施项 (Add Action)',
    rcaStatusDone: '已完成 (Done)',
    rcaStatusProgress: '跟进中 (In Progress)',
    rcaStatusPlanned: '规划中 (Planned)',
    rcaFactorMan: '人员配置 (Man)',
    rcaFactorMachine: '机台治具 (Machine)',
    rcaFactorMethod: '工法平衡 (Method)',
    rcaFactorMaterial: '来料批次 (Material)',
    rcaFactorEnv: '作业环境 (Environment)',
  },

  en: {
    brandTitle: 'RF Performance Portal',
    navDashboard: 'Dashboard Summary',
    navSummary: 'Summary Table',
    navAnalytics: 'Daily Analytics',
    navRca: 'Root Cause Analysis',
    navDailyLog: 'Daily Log',
    navHistory: 'Update History',
    navReset: 'Reset Default',
    ctaLogResult: 'Log Daily Result',

    autoSaveLabel: 'Web Auto-Save Mode:',
    autoSaveOn: 'Active (ON)',
    autoSaveOff: 'Paused (OFF)',
    savingStatus: 'Auto-saving changes to web storage...',
    savedLastAt: 'Last auto-saved at',
    unsavedWarning: 'Unsaved edits pending (Auto-Save is paused)',
    saveNowBtn: 'Save Now',
    inlineEditOn: 'Inline Table Editing: ON',
    inlineEditOff: 'Inline Table Editing: OFF',
    languageLabel: 'Language:',

    kickerTelemetry: 'Production Line Telemetry',
    kickerCycle: 'October 2026 Cycle',
    kickerActiveReport: 'Active Report:',
    pageHeadline: 'RF Performance Summary & Daily Usage Analytics',
    resultDateLabel: 'Result Date:',
    downloadCsvBtn: 'Download CSV',

    statusAchieved: 'Achieved',
    statusBelowTarget: 'Below target',
    targetLabel: 'Target',
    actualLabel: 'Actual',
    gapLabel: 'Gap',
    allFilter: 'All',

    summaryTableTitle: 'RF PERFORMANCE SUMMARY',
    summaryTableSub: (date) =>
      `RF production line performance summary for ${date} and Month-to-Date (Oct'2026 MTD)`,
    inlineEditActiveBtn: 'Editing Table Cells (Auto-Save)',
    inlineEditToggleBtn: 'Edit Table Cells',
    searchPlaceholder: 'Search metric (e.g. UPH-A, Idle)...',
    colDate: 'Date',
    colTopic: 'Topic',
    colTarget: 'Target',
    colActual: 'Actual',
    colGap: 'Gap',
    colStatus: 'Status',
    noMatchingRows: 'No performance metrics match the current filter criteria.',
    resultLabel: 'Result',
    mtdSubLabel: 'Month-to-Date',

    topicDescriptions: {
      'UPH-A': 'Units Per Hour — Production Line A',
      'UPH-B': 'Units Per Hour — Production Line B',
      'UPPH All line': 'Units Per Person Hour — Combined Lines',
      'Idle Time All line': 'Station Idle Time Ratio (Target ≤ 5%)',
      'UPH All line (MTD)': 'Month-to-Date Average UPH Across All Lines',
      'UPH-A (MTD)': 'Month-to-Date Average UPH — Line A',
      'UPH-B (MTD)': 'Month-to-Date Average UPH — Line B',
      'UPPH All line (MTD)': 'Month-to-Date Units Per Person Hour',
      'Idle Time All line (MTD)': 'Month-to-Date Idle Time Ratio (Target ≤ 5%)',
    },

    analyticsKicker: 'Daily Performance Analytics',
    analyticsTitle: 'Daily Throughput (UPH) & Labor Efficiency Trends',
    analyticsSubtitle: (date) =>
      `Click any day bar or data point to inspect daily results (${date}) against Oct'2026 Month-to-Date averages`,
    filterAllLines: 'All Lines',
    chartGroupedBar: 'Grouped Bar',
    chartTrendLine: 'Trend Line',

    chart1Title:
      '01. Daily Units Per Hour (Daily UPH: Line A vs Line B vs All Line)',
    chart1Subtitle:
      'Daily actual output compared against target baselines (Target UPH-A: 172 · Target All Line: 144 · Target UPH-B: 115)',
    legendUphA: 'UPH-A (Target 172)',
    legendUphAll: 'UPH All line (Target 144)',
    legendUphB: 'UPH-B (Target 115)',
    selectedDayLabel: 'Selected Day:',

    chart2Title:
      '02. Daily Labor Efficiency (UPPH) & Station Idle Time (%) Trend',
    chart2Subtitle:
      'UPPH exceeded the 0.21 target every day while Idle Time dropped to a record low of 1.6% on 10/10/2026 (Target ≤5%)',
    legendUpph: 'UPPH (Target ≥0.21)',
    legendIdle: 'Idle Time % (Target ≤5%)',
    mtdUpphSummary: 'MTD Average UPPH:',
    aboveTargetSuffix: 'above target',
    mtdIdleSummary: 'MTD Average Idle Time:',
    betterThanCeilingSuffix: 'favorable margin',

    chart3Title: '03. Target vs Actual Variance Breakdown',
    chart3Subtitle: 'Metric-by-metric target achievement and gap analysis',
    periodDailyBtn: (shortDate) => `Daily (${shortDate})`,
    periodMtdBtn: "MTD (Oct'2026)",

    diagnosticTitle: 'Operational Diagnostic Summary',
    diagnosticPoint1Title: '1. Per-Operator Efficiency Achieved:',
    diagnosticPoint1Body: (upph, idle) =>
      `UPPH All line reached ${upph} (above the 0.21 target) and Idle Time remained low at ${idle}% (well below the ≤5% ceiling), confirming strong operator productivity and minimal waiting loss.`,
    diagnosticPoint2Title: '2. Root Cause for UPH-A & UPH-B Deficit:',
    diagnosticPoint2Body: (gapA, gapB) =>
      `Because individual operator output (UPPH) already exceeds target, the total hourly gap (UPH-A ${gapA}, UPH-B ${gapB}) is driven by active station headcount allocation rather than operator speed.`,

    dailyLogKicker: "Daily Operations Log · Auto-Saved Daily Dataset (Oct'2026)",
    dailyLogTitle: (lastDate) =>
      `Daily Performance Log Table (01/10/2026 – ${lastDate})`,
    dailyLogSubtitle:
      'Edit values directly in any row; changes auto-save to the browser and recalculate MTD averages and charts immediately.',
    addDailyRowBtn: 'Add Daily Row',
    colUphA: 'UPH-A (Target 172)',
    colUphB: 'UPH-B (Target 115)',
    colUphAll: 'UPH All line (Target 144)',
    colUpphAll: 'UPPH All line (Target 0.21)',
    colIdleTime: 'Idle Time (Target ≤5%)',
    colShiftNote: 'Shift Operation Note',
    activeBadge: 'Active',
    mtdAvgFooter: (days) => `Oct'2026 MTD Avg (${days} days)`,
    mtdAvgNote: (date) => `Automatically averaged through ${date}`,

    footerTitle: 'RF Performance Summary & Daily Usage Analytics',
    footerAutoSaveActive: 'Auto-Save Active',
    footerAutoSavePaused: 'Auto-Save Paused',
    footerSavedAt: 'Saved',
    exportCsvFooter: 'Export CSV Report',
    resetDefaultFooter: 'Reset Default Data',

    modalTitle: 'Log Daily RF Result',
    modalSubtitle:
      'New or updated records are automatically persisted in Web Auto-Save storage',
    modalDateLabel: 'Operation Date',
    modalShiftNoteLabel: 'Shift Note',
    modalCancelBtn: 'Cancel',
    modalSaveBtn: 'Save Daily Result',

    editDateTooltip: 'Click to edit date directly in table',
    editMonthTooltip: 'Click to edit month (MTD) directly in table',
    saveDateBtn: 'Save Date',
    saveMonthBtn: 'Save Month',
    cancelEditBtn: 'Cancel',
    historyModalTitle: 'Web Retroactive Update & Audit History',
    historyModalSubtitle:
      'Automatically logs and tracks retroactive edits to dates, months, and performance figures in web storage',
    historyEmpty:
      'No retroactive updates recorded yet (modifications to dates, months, or values in tables are automatically recorded here)',
    historyColTime: 'Timestamp',
    historyColTarget: 'Record / Date',
    historyColAction: 'Action',
    historyColField: 'Field / Topic',
    historyColChange: 'Change (Old ➔ New)',
    historyColActionBtn: 'Actions',
    historyClearBtn: 'Clear History',
    historyExportBtn: 'Export History CSV',
    historyRevertBtn: 'Revert',
    historyCount: (count: number) => `${count} historical updates recorded`,
    historyFilterAll: 'All Types',
    historySearchPlaceholder: 'Search history (date, field, value)...',
    actionDateChange: 'Date Change',
    actionMonthChange: 'Month (MTD) Change',
    actionMetricUpdate: 'Metric Update',
    actionRecordAdd: 'New Date Added',
    actionRevert: 'Revert Change',
    revertSuccessMsg: 'Historical edit successfully reverted',

    // Dashboard Summary View
    dashSummaryTitle: 'RF Operations Executive Dashboard · Performance Snapshot',
    dashSummarySubtitle: (date) =>
      `Executive view of RF line throughput, operator staffing ratios, and target achievement on ${date}`,
    dashOverallHealth: 'Overall Plant Performance Index',
    dashOverallScore: (pct) => `${pct}% Target Adherence`,
    dashLaborCardTitle: 'Labor Productivity (UPPH)',
    dashIdleCardTitle: 'Station Idle Control',
    dashCapacityTitle: 'Station Staffing & Capacity',
    dashWinsTitle: 'Key Operational Wins',
    dashBottlenecksTitle: 'Key Bottlenecks & Throughput Deficits',
    dashViewRcaCta: 'View Root Cause Analysis (RCA)',
    dashPlannedHeadcount: 'Planned Station Manning',
    dashActualHeadcount: 'Actual Active Operators',
    dashLineThroughputTitle: 'Hourly Throughput by Line (UPH Breakdown)',
    dashLaborMultiplier: 'Operator labor output above plan',

    // Root Cause Analysis (RCA) View
    rcaTitle: 'Root Cause Analysis (RCA)',
    rcaSubtitle:
      '4M1E Ishikawa Diagram, 5-Whys Logic Tree, and Corrective & Preventive Action Plan (CAPA)',
    rcaIshikawaTab: '4M1E Ishikawa Fishbone',
    rcaWhysTab: '5 Whys Logic Tree',
    rcaParetoTab: 'Loss Factor Pareto',
    rcaCapaTab: 'CAPA Action Plan',
    rcaCoreProblemTitle:
      'Core Problem: Why are UPH-A and UPH-B below target when individual UPPH and Idle Time are achieved?',
    rcaAddActionBtn: 'Add Corrective Action',
    rcaStatusDone: 'Done',
    rcaStatusProgress: 'In Progress',
    rcaStatusPlanned: 'Planned',
    rcaFactorMan: 'Man (Staffing & Skills)',
    rcaFactorMachine: 'Machine & Fixtures',
    rcaFactorMethod: 'Method & Balancing',
    rcaFactorMaterial: 'Material & Batches',
    rcaFactorEnv: 'Environment',
  },
};

export function getLocalizedShiftNote(
  recordId: string,
  currentNote: string,
  lang: Language
): string {
  const defaultEntry = DEFAULT_SHIFT_NOTES_I18N[recordId];
  if (!defaultEntry) return currentNote;
  // If the user hasn't customized the note away from one of the default translations, return the active language version
  if (
    currentNote === defaultEntry.th ||
    currentNote === defaultEntry.zh ||
    currentNote === defaultEntry.en
  ) {
    return defaultEntry[lang];
  }
  return currentNote;
}
