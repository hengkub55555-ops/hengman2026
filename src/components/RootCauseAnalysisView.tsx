import React, { useState } from 'react';
import { DailyRFRecord, RF_TARGETS } from '../data/rfPerformanceData';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  HelpCircle,
  GitBranch,
  BarChart3,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Users,
  Cpu,
  Layers,
  Box,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

interface CapaItem {
  id: string;
  title: Record<Language, string>;
  owner: string;
  targetDate: string;
  status: 'Done' | 'In Progress' | 'Planned';
  impact: Record<Language, string>;
}

const INITIAL_CAPA_ITEMS: CapaItem[] = [
  {
    id: 'capa-1',
    title: {
      th: 'สรรหาและเร่งฝึกอบรมพนักงานประจำสถานี RF เพิ่มเติม 14 ตำแหน่ง ให้เต็มอัตรา 58 คน',
      zh: '紧急招聘并培训射频测试工位人员 14 名，补齐满编 58 人编制',
      en: 'Recruit and expedite on-boarding training for 14 RF station operators to reach 58 headcount',
    },
    owner: 'HR / Production Supervisor',
    targetDate: '18/10/2026',
    status: 'In Progress',
    impact: {
      th: 'ฟื้นฟูกำลังผลิต UPH รวมได้ +35 units/hr',
      zh: '全线产能预计恢复 +35 units/hr',
      en: 'Recovers combined capacity by +35 units/hr',
    },
  },
  {
    id: 'capa-2',
    title: {
      th: 'ติดตั้งหัววัด RF สำรองแบบ Quick-Swap สำเร็จรูป ลดเวลาปรับเทียบจาก 15 นาที เหลือ 4 นาที',
      zh: '部署预调式快换射频探针治具，将校准耗时由 15 分钟缩短至 4 分钟',
      en: 'Deploy pre-calibrated quick-swap RF probe fixtures, reducing calibration from 15 min to 4 min',
    },
    owner: 'Equipment Eng (Equipment)',
    targetDate: '15/10/2026',
    status: 'Done',
    impact: {
      th: 'ประหยัดเวลาสูญเปล่าเพิ่ม 11 นาทีต่อกะ',
      zh: '每班净节约工时浪费 11 分钟',
      en: 'Saves 11 minutes of idle time per shift',
    },
  },
  {
    id: 'capa-3',
    title: {
      th: 'ปรับสมดุลสายงาน (Line Balancing) ยุบรวมสถานีสแกนย่อยเพื่อคง UPH-B ไว้ที่ 105+',
      zh: '重新平衡线体节拍，优化工序合并以确保 B 线 UPH 维持在 105 以上',
      en: 'Rebalance assembly line pacing and combine sub-scan stations to stabilize Line B at 105+ UPH',
    },
    owner: 'Industrial Eng (IE Dept)',
    targetDate: '20/10/2026',
    status: 'In Progress',
    impact: {
      th: 'ลดช่องว่าง UPH-B ลงเหลือไม่เกิน -10',
      zh: '将 B 线产能差距压缩至 -10 以内',
      en: 'Reduces Line B capacity gap to under -10 UPH',
    },
  },
  {
    id: 'capa-4',
    title: {
      th: 'จัดทำโปรแกรมฝึกอบรมข้ามสายงาน (Cross-Training) เพื่อให้สลับคนระหว่าง RF-A และ B ได้ราบรื่น',
      zh: '建立跨产线多能工矩阵培训，实现 A/B 线人员灵活高效调配',
      en: 'Implement cross-training matrix program to facilitate smooth operator rotation between RF-A and B',
    },
    owner: 'Training Dept',
    targetDate: '25/10/2026',
    status: 'Planned',
    impact: {
      th: 'เพิ่มความยืดหยุ่นในการจัดกะงาน',
      zh: '极大提升突发排产弹性',
      en: 'Significantly enhances shift roster flexibility',
    },
  },
];

interface RootCauseAnalysisViewProps {
  lang: Language;
  selectedDate: string;
  dailyRecord: DailyRFRecord;
  monthLabel: string;
}

export const RootCauseAnalysisView: React.FC<RootCauseAnalysisViewProps> = ({
  lang,
  selectedDate,
  dailyRecord,
  monthLabel,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'ishikawa' | 'whys' | 'pareto' | 'capa'>('ishikawa');
  const [capaList, setCapaList] = useState<CapaItem[]>(INITIAL_CAPA_ITEMS);
  const [newTitle, setNewTitle] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [isAddingCapa, setIsAddingCapa] = useState(false);

  const handleToggleStatus = (id: string) => {
    setCapaList((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: CapaItem['status'] =
          item.status === 'Planned'
            ? 'In Progress'
            : item.status === 'In Progress'
            ? 'Done'
            : 'Planned';
        return { ...item, status: nextStatus };
      })
    );
  };

  const handleAddCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem: CapaItem = {
      id: `capa-${Date.now()}`,
      title: {
        th: newTitle.trim(),
        zh: newTitle.trim(),
        en: newTitle.trim(),
      },
      owner: newOwner.trim() || 'Operations Team',
      targetDate: selectedDate,
      status: 'In Progress',
      impact: {
        th: 'ปรับปรุงกระบวนการผลิต',
        zh: '持续优化生产工序',
        en: 'Continuous process improvement',
      },
    };
    setCapaList((prev) => [newItem, ...prev]);
    setNewTitle('');
    setNewOwner('');
    setIsAddingCapa(false);
  };

  const handleDeleteCapa = (id: string) => {
    setCapaList((prev) => prev.filter((item) => item.id !== id));
  };

  const rcaTexts = {
    th: {
      subHeader: `ระบบวินิจฉัยเชิงวิศวกรรมอุตสาหการ (IE Diagnostic) · ${monthLabel}`,
      problemDesc: `ในวันที่ ${selectedDate} ประสิทธิภาพรายบุคคลทำได้ 0.25 UPPH (สูงกว่าเป้า 0.21) และเวลาว่าง 1.6% (ดีกว่าเพดาน ≤5%) แต่ยอดรวม UPH-A ต่ำกว่าเป้า -30 และ UPH-B ต่ำกว่าเป้า -26 เกิดจากสาเหตุใด?`,
      ishikawaTitle: 'แผนผังสาเหตุและผล 4M1E (Ishikawa Fishbone Diagram)',
      ishikawaSub: 'จำแนกปัจจัยที่มีผลต่อยอดผลผลิตต่ำกว่าเป้าหมายออกเป็น 5 มิติหลัก',
      manTitle: 'สาเหตุหลัก (48%)',
      manPoints: [
        'กำลังคนขาด 14 คน: สถานีเปิดทำงานไม่ครบตามแผนผังมาตรฐาน (Line A ขาด 6 คน, Line B ขาด 6 คน)',
        'ดึงคนช่วย Line A: ส่งผลให้ Line B ขาดความต่อเนื่องจน UPH ตกเหลือ 89',
        'ทักษะพนักงานที่มีอยู่ทำได้ดีเยี่ยม (0.25 UPPH สะท้อนว่าความชำนาญสูง)',
      ],
      machineTitle: 'สาเหตุรอง (22%)',
      machinePoints: [
        'รอบปรับเทียบหัววัด RF (Probe Calibration): ใช้เวลา 15 นาทีตามรอบปกติ',
        'สาย Coaxial fixture สึกหรอตามอายุการใช้งาน ต้องสลับหัววัดสำรอง',
      ],
      methodTitle: 'มีส่วนผลกระทบ (18%)',
      methodPoints: [
        'Line Balancing ระหว่าง A และ B ไม่สัมพันธ์กันเมื่อมีการสลับสับเปลี่ยนคน',
        'ขนาด Buffer พักชิ้นงานระหว่างสถานียังไม่สมดุล',
      ],
      materialTitle: 'ปัจจัยร่วม (12%)',
      materialPoints: [
        'เปลี่ยนล็อตงานทดสอบคลื่นความถี่ช่วงบ่าย ต้องเซ็ตอัปพารามิเตอร์ใหม่',
        'ชิ้นงานเข้าทดสอบมีความแปรปรวนของค่าความถี่เล็กน้อย',
      ],
      envTitle: 'ปกติ (ควบคุมได้)',
      envPoints: [
        'กล่องกันคลื่นรบกวน (RF Shielding Chamber) ทำงานสมบูรณ์ 100%',
        'อุณหภูมิและความชื้นในห้องควบคุม Cleanroom คงที่ตลอดกะ',
      ],
      whysTitle: 'การวิเคราะห์ 5 Whys (5-Whys Deep Root Cause Analysis)',
      whysSub: 'ไล่เลียงสาเหตุจากผลลัพธ์หน้างานลงลึกถึงรากเหง้าของปัญหาทีละขั้น',
      whys: [
        {
          num: 'W1',
          q: 'ทำไมผลผลิตรวมต่อชั่วโมง (UPH-A 142 และ UPH-B 89) ถึงไม่บรรลุเป้าหมาย (172 และ 115)?',
          a: 'เพราะจำนวนชิ้นงานที่สแกนสำเร็จต่อชั่วโมงขาดไป 30 ชิ้นใน Line A และ 26 ชิ้นใน Line B',
        },
        {
          num: 'W2',
          q: 'ทำไมสแกนได้ไม่ทัน ทั้งๆ ที่พนักงานสแกนได้เร็วมาก (0.25 UPPH เหนือเกณฑ์ 0.21) และเวลาว่างน้อยมาก (1.6%)?',
          a: 'เพราะจำนวนสถานีสแกนที่เปิดเดินเครื่องพร้อมกันมีเพียง 46 สถานี น้อยกว่าแผนผังกำลังผลิตที่ต้องใช้ 58 สถานี',
        },
        {
          num: 'W3',
          q: 'ทำไมถึงเปิดสถานีสแกนได้เพียง 46 สถานี ไม่เปิดครบ 58 สถานีตามแผน?',
          a: 'เพราะจำนวนกำลังคนหน้างานขาดอยู่ 12-14 คน ทำให้ไม่มีคนประจำหัวเครื่องสแกน',
        },
        {
          num: 'W4',
          q: 'ทำไมถึงไม่มีพนักงานเสริม หรือไม่มีบัฟเฟอร์กำลังพลในกะ?',
          a: 'รอบการรับสมัครและอบรมทักษะ RF สแกนยังอยู่ในช่วง On-boarding และการแก้ปัญหาเฉพาะหน้าใช้วิธีดึงคนจาก Line B มาเสริม Line A ซึ่งทำให้ Line B ตกตามไปด้วย',
        },
      ],
      rootCauseTitle: 'รากเหง้าของปัญหาที่แท้จริง (Root Cause Identified):',
      rootCauseBadge: 'Staffing & Capacity Gap',
      rootCauseText:
        'ยอดผลิตไม่ถึงเป้า ไม่ได้เกิดจากปัญหาความขยันหรือประสิทธิภาพของพนักงาน แต่เกิดจากจำนวนกำลังคนประจำการต่ำกว่าแผนผังสถานีมาตรฐาน (-14 คน) แนวทางแก้ไขคือการเติมพนักงานให้ครบ 58 คน ไม่ใช่การเร่งความเร็วพนักงานเดิม',
      paretoTitle: 'สัดส่วนสาเหตุการสูญเสียกำลังการผลิต (Throughput Loss Factor Pareto)',
      paretoSub: `แสดงสัดส่วนสาเหตุของช่องว่างการผลิตที่ขาดไปรวม -56 units/hr ในวันที่ ${selectedDate}`,
      paretoFactors: [
        { name: '1. ขาดกำลังคนประจำสถานี (Station Manning Deficit)', pct: 48, loss: '~27 units/hr' },
        { name: '2. การสลับล็อตและปรับเทียบหัววัด (Fixture / Probe Calibration)', pct: 22, loss: '~12 units/hr' },
        { name: '3. ความไม่สมดุลของสายงาน (Line Balancing Shift)', pct: 18, loss: '~10 units/hr' },
        { name: '4. จังหวะการจ่ายชิ้นงานเข้าทดสอบ (Material Feed Pacing)', pct: 12, loss: '~7 units/hr' },
      ],
      paretoRule: 'ตามหลัก 80/20: การแก้ไข 2 ปัจจัยแรก (กำลังคน + หัววัด RF) จะกู้คืนยอดผลิตได้ถึง 70% (+39 UPH)',
      capaTitle: 'มาตรการแก้ไขและป้องกัน (Corrective & Preventive Action Plan - CAPA)',
      capaSub: 'ติดตามความคืบหน้าของมาตรการปรับปรุง คลิกที่สถานะเพื่อสลับ (Done / In Progress / Planned)',
      capaColAction: 'มาตรการปรับปรุง (Action Item)',
      capaColOwner: 'ผู้รับผิดชอบ',
      capaColTarget: 'กำหนดเสร็จ',
      capaColImpact: 'ผลกระทบเชิงบวกที่คาดหวัง',
      capaColStatus: 'สถานะ',
      capaColOps: 'จัดการ',
      capaAddTitle: 'เพิ่มมาตรการปรับปรุงใหม่ (Add CAPA Item)',
      capaInputPlaceholder: 'ระบุหัวข้อมาตรการปรับปรุง...',
      capaOwnerPlaceholder: 'ผู้รับผิดชอบ (เช่น วิศวกรสายผลิต)',
      capaCancel: 'ยกเลิก',
      capaSave: 'บันทึกมาตรการ',
    },
    zh: {
      subHeader: `工业工程诊断分析系统 (IE Diagnostic) · ${monthLabel}`,
      problemDesc: `在 ${selectedDate}，人均产能达到 0.25 UPPH (高于目标 0.21)，闲置工时率仅 1.6% (优于 ≤5% 上限)，但 A 线 UPH 差距 -30，B 线 UPH 差距 -26。原因究竟何在？`,
      ishikawaTitle: '4M1E 因果特性要因图 (石川鱼骨图 Ishikawa Diagram)',
      ishikawaSub: '从人、机、法、料、环 5 大维度深入剖析产能瓶颈',
      manTitle: '主导诱因 (48%)',
      manPoints: [
        '工位缺编 14 人: 未能按标准工位配置满员开机 (A线缺6人，B线缺6人)',
        '借调支援 A 线: 导致 B 线节奏脱节，UPH-B 骤降至 89',
        '在岗员工技能卓越 (0.25 UPPH 显示出极高个人操作熟练度)',
      ],
      machineTitle: '次要因素 (22%)',
      machinePoints: [
        '射频探针校准周期 (Probe Calibration): 常规校准耗费约 15 分钟',
        '高频线缆治具老化，需阶段性更换备用测试夹具',
      ],
      methodTitle: '流程影响 (18%)',
      methodPoints: [
        'A/B 线工序节拍在人员变动后未及时同步再平衡',
        '工位间在制品 (WIP Buffer) 暂存容量未达到最佳配比',
      ],
      materialTitle: '物料关联 (12%)',
      materialPoints: [
        '下午切换批次时需重新下发测试频段参数',
        '来料微小频偏需要轻微复测调整',
      ],
      envTitle: '可控稳定',
      envPoints: [
        '屏蔽房 (RF Shielding Chamber) 衰减指标 100% 达标',
        '洁净车间温湿度传感器整班维持在恒定区间',
      ],
      whysTitle: '5 Whys 深度追问分析法 (5-Whys Logic Tree)',
      whysSub: '从表层现象层层递进，直至揪出系统性深层症结',
      whys: [
        {
          num: 'W1',
          q: '为什么全线小时产量 (UPH-A 142、UPH-B 89) 未达到既定目标 (172 与 115)?',
          a: '因为 A 线小时合格数缺少 30 件，B 线小时合格数缺少 26 件。',
        },
        {
          num: 'W2',
          q: '为什么产出跟不上？明明员工测试极快 (0.25 UPPH 超越 0.21)，且几乎无等待浪费 (1.6%)?',
          a: '因为实际开机的测试工位仅 46 个，远低于设计产能所需的 58 个工位。',
        },
        {
          num: 'W3',
          q: '为什么只开了 46 个工位，没有按标准开满 58 个工位？',
          a: '因为现场在岗人员缺员 12-14 人，无人承接闲置机台。',
        },
        {
          num: 'W4',
          q: '为什么没有机动后备人员或编制储备？',
          a: '射频工位技能要求高，新员工入职培训周期未完成；临时将 B 线员工调配至 A 线，导致双线产能两败俱伤。',
        },
      ],
      rootCauseTitle: '根本原因明确判定 (Root Cause Identified):',
      rootCauseBadge: 'Staffing & Capacity Gap',
      rootCauseText:
        '产能未达标并非员工效率或态度问题，而是工位配置人员缺口达 14 人所致。治本之策是补齐 58 人编制，而非盲目催促现有员工提速。',
      paretoTitle: '产能损失柏拉图分析 (Throughput Loss Factor Pareto)',
      paretoSub: `针对 ${selectedDate} 总计 -56 units/hr 的产能落差进行柏拉图归因`,
      paretoFactors: [
        { name: '1. 工位缺编损失 (Station Manning Deficit)', pct: 48, loss: '~27 units/hr' },
        { name: '2. 批次切换与探针校准 (Fixture / Calibration)', pct: 22, loss: '~12 units/hr' },
        { name: '3. 线体平衡失调 (Line Balancing Shift)', pct: 18, loss: '~10 units/hr' },
        { name: '4. 来料节拍节流 (Material Feed Pacing)', pct: 12, loss: '~7 units/hr' },
      ],
      paretoRule: '二八定律：解决前两项关键因素 (人员补充 + 快速换模探针)，即可挽回 70% 损失 (+39 UPH)',
      capaTitle: '纠正与预防措施计划 (CAPA Action Tracker)',
      capaSub: '实时追踪改善落实进度，点击状态标签可切换 (Done / In Progress / Planned)',
      capaColAction: '改善项目 (Action Item)',
      capaColOwner: '责任人',
      capaColTarget: '计划完成',
      capaColImpact: '预期收益',
      capaColStatus: '状态',
      capaColOps: '操作',
      capaAddTitle: '新增改善对策 (Add CAPA Item)',
      capaInputPlaceholder: '输入改善措施详情...',
      capaOwnerPlaceholder: '责任人 (如：工艺工程师)',
      capaCancel: '取消',
      capaSave: '保存对策',
    },
    en: {
      subHeader: `Industrial Engineering Diagnostic Portal · ${monthLabel}`,
      problemDesc: `On ${selectedDate}, individual labor efficiency achieved 0.25 UPPH (beating 0.21 target) and idle time was 1.6% (besting ≤5% ceiling), yet UPH-A lagged by -30 and UPH-B by -26. What is the root cause?`,
      ishikawaTitle: '4M1E Cause & Effect Fishbone Diagram (Ishikawa)',
      ishikawaSub: 'Categorizing production shortfall factors across 5 operational dimensions',
      manTitle: 'Primary Driver (48%)',
      manPoints: [
        'Station Manning Deficit: 14 operators missing against standard layout (Line A missing 6, Line B missing 6)',
        'Line B Operators Borrowed: Reassigning operators disrupted Line B continuity, dropping UPH to 89',
        'Present Operator Competence is High (0.25 UPPH indicates excellent individual skill)',
      ],
      machineTitle: 'Secondary Factor (22%)',
      machinePoints: [
        'RF Probe Calibration Routine: Consumes 15 mins during periodic check',
        'Coaxial test fixtures suffer gradual connector wear, requiring backup swap',
      ],
      methodTitle: 'Process Influence (18%)',
      methodPoints: [
        'Line Balancing between Line A and B desynchronized during headcount shifts',
        'WIP buffer storage capacities between test gates require fine-tuning',
      ],
      materialTitle: 'Material Feed (12%)',
      materialPoints: [
        'Afternoon test batch changeover required reloading frequency parameters',
        'Minor lot-to-lot variance required occasional re-testing',
      ],
      envTitle: 'Controlled & Stable',
      envPoints: [
        'RF Shielding chamber attenuation verified at 100% compliance',
        'Cleanroom temperature and humidity held steady throughout shift',
      ],
      whysTitle: '5-Whys Deep Root Cause Analysis',
      whysSub: 'Tracing symptoms backwards step-by-step to uncover underlying systemic flaws',
      whys: [
        {
          num: 'W1',
          q: 'Why did total throughput per hour (UPH-A 142 & UPH-B 89) miss target (172 & 115)?',
          a: 'Because completed scan count fell short by 30 units on Line A and 26 units on Line B.',
        },
        {
          num: 'W2',
          q: 'Why did total output lag when individual operators scanned so rapidly (0.25 UPPH vs 0.21 target) with minimal idle time (1.6%)?',
          a: 'Because only 46 test stations were active, compared to the required 58 stations in standard production routing.',
        },
        {
          num: 'W3',
          q: 'Why were only 46 stations running instead of the standard 58?',
          a: 'Because the active shop floor headcount was short by 12-14 operators, leaving machines unmanned.',
        },
        {
          num: 'W4',
          q: 'Why was there no contingency workforce or staffing reserve for the shift?',
          a: 'Recruitment and specialized RF training cohorts are currently mid-onboarding, and cross-line borrowing from Line B degraded both lines simultaneously.',
        },
      ],
      rootCauseTitle: 'Root Cause Identified:',
      rootCauseBadge: 'Staffing & Capacity Gap',
      rootCauseText:
        'The output shortfall is NOT an issue of worker laziness or slowness, but an structural deficit of 14 unmanned stations. The genuine fix is staffing all 58 stations, not over-accelerating active workers.',
      paretoTitle: 'Throughput Loss Factor Pareto Breakdown',
      paretoSub: `Quantifying root drivers behind the cumulative -56 units/hr throughput deficit on ${selectedDate}`,
      paretoFactors: [
        { name: '1. Station Manning Deficit', pct: 48, loss: '~27 units/hr' },
        { name: '2. Fixture / Probe Calibration', pct: 22, loss: '~12 units/hr' },
        { name: '3. Line Balancing Shift', pct: 18, loss: '~10 units/hr' },
        { name: '4. Material Feed Pacing', pct: 12, loss: '~7 units/hr' },
      ],
      paretoRule: '80/20 Rule: Tackling the top 2 factors (Headcount + Quick-Swap Probe) recovers 70% of the target gap (+39 UPH)',
      capaTitle: 'Corrective & Preventive Action Plan (CAPA)',
      capaSub: 'Track improvement milestones. Click status badge to cycle (Done / In Progress / Planned)',
      capaColAction: 'Action Item',
      capaColOwner: 'Owner',
      capaColTarget: 'Target Date',
      capaColImpact: 'Expected Impact',
      capaColStatus: 'Status',
      capaColOps: 'Action',
      capaAddTitle: 'Add CAPA Action Item',
      capaInputPlaceholder: 'Describe corrective action item...',
      capaOwnerPlaceholder: 'Owner (e.g. IE Engineer)',
      capaCancel: 'Cancel',
      capaSave: 'Save Action',
    },
  }[lang];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{rcaTexts.subHeader}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          {t.rcaTitle}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {t.rcaSubtitle} ({selectedDate} · {monthLabel})
        </p>
      </div>

      {/* Core Problem Statement Banner */}
      <div className="bg-blue-50/80 border border-blue-200/90 rounded-xl p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-950">
              {t.rcaCoreProblemTitle}
            </h3>
            <p className="text-xs text-blue-900/90 mt-1 leading-relaxed">
              {rcaTexts.problemDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('ishikawa')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'ishikawa'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-blue-600" />
          <span>{t.rcaIshikawaTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whys')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'whys'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          <span>{t.rcaWhysTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pareto')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'pareto'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
          <span>{t.rcaParetoTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('capa')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'capa'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.rcaCapaTab}</span>
          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-mono rounded">
            {capaList.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Ishikawa 4M1E Diagram */}
      {activeTab === 'ishikawa' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {rcaTexts.ishikawaTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {rcaTexts.ishikawaSub}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Man */}
            <div className="border border-red-200 bg-red-50/30 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-sm text-slate-900">{t.rcaFactorMan}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  {rcaTexts.manTitle}
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-2">
                {rcaTexts.manPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Machine */}
            <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-sm text-slate-900">{t.rcaFactorMachine}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {rcaTexts.machineTitle}
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-2">
                {rcaTexts.machinePoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Method */}
            <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-sm text-slate-900">{t.rcaFactorMethod}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  {rcaTexts.methodTitle}
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-2">
                {rcaTexts.methodPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Material */}
            <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-sm text-slate-900">{t.rcaFactorMaterial}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  {rcaTexts.materialTitle}
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-2">
                {rcaTexts.materialPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Environment */}
            <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-4.5 space-y-3 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-sm text-slate-900">{t.rcaFactorEnv}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {rcaTexts.envTitle}
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-2">
                {rcaTexts.envPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 5-Whys Logic Tree */}
      {activeTab === 'whys' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              {rcaTexts.whysTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {rcaTexts.whysSub}
            </p>
          </div>

          <div className="space-y-4">
            {rcaTexts.whys.map((w, idx) => (
              <React.Fragment key={w.num}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-mono font-bold flex items-center justify-center shrink-0">
                    {w.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {w.q}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>A:</strong> {w.a}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 text-slate-400">
                  <ArrowRight className="w-4 h-4 transform rotate-90" />
                </div>
              </React.Fragment>
            ))}

            {/* Why 5 - ROOT CAUSE */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white font-mono font-bold flex items-center justify-center shrink-0">
                RC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-red-950 uppercase tracking-wide">
                    {rcaTexts.rootCauseTitle}
                  </h4>
                  <span className="text-[10px] bg-red-200 text-red-900 font-bold px-2 py-0.5 rounded">
                    {rcaTexts.rootCauseBadge}
                  </span>
                </div>
                <p className="text-xs text-red-900 font-semibold mt-1 leading-relaxed">
                  {rcaTexts.rootCauseText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Loss Factor Pareto Breakdown */}
      {activeTab === 'pareto' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              {rcaTexts.paretoTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {rcaTexts.paretoSub}
            </p>
          </div>

          <div className="space-y-4">
            {rcaTexts.paretoFactors.map((f, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    {f.name}
                  </span>
                  <span className="font-mono text-red-600 font-bold">
                    {f.pct}% ({f.loss})
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-md overflow-hidden">
                  <div
                    className={`h-full rounded-md ${
                      i === 0
                        ? 'bg-red-600'
                        : i === 1
                        ? 'bg-amber-500'
                        : i === 2
                        ? 'bg-blue-600'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              {rcaTexts.paretoRule}
            </span>
            <span className="font-mono font-bold text-slate-800">Target Gap Recovery: 70%</span>
          </div>
        </div>
      )}

      {/* Tab 4: CAPA Action Plan */}
      {activeTab === 'capa' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {rcaTexts.capaTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {rcaTexts.capaSub}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingCapa((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.rcaAddActionBtn}</span>
            </button>
          </div>

          {/* Add Form */}
          {isAddingCapa && (
            <form
              onSubmit={handleAddCapa}
              className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3 animate-fadeIn"
            >
              <h4 className="text-xs font-bold text-blue-900">
                {rcaTexts.capaAddTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={rcaTexts.capaInputPlaceholder}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  placeholder={rcaTexts.capaOwnerPlaceholder}
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingCapa(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  {rcaTexts.capaCancel}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  {rcaTexts.capaSave}
                </button>
              </div>
            </form>
          )}

          {/* CAPA Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">{rcaTexts.capaColAction}</th>
                  <th className="py-2.5 px-3">{rcaTexts.capaColOwner}</th>
                  <th className="py-2.5 px-3 font-mono">{rcaTexts.capaColTarget}</th>
                  <th className="py-2.5 px-3">{rcaTexts.capaColImpact}</th>
                  <th className="py-2.5 px-3">{rcaTexts.capaColStatus}</th>
                  <th className="py-2.5 px-3 text-right">{rcaTexts.capaColOps}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {capaList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900 max-w-xs">
                      {item.title[lang] || item.title.th}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {item.owner}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {item.targetDate}
                    </td>
                    <td className="py-3 px-3 text-emerald-800 font-medium whitespace-nowrap">
                      {item.impact[lang] || item.impact.th}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                          item.status === 'Done'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : item.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {item.status === 'Done' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-700" />
                        )}
                        <span>
                          {item.status === 'Done'
                            ? t.rcaStatusDone
                            : item.status === 'In Progress'
                            ? t.rcaStatusProgress
                            : t.rcaStatusPlanned}
                        </span>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDeleteCapa(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
