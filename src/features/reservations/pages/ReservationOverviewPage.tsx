import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle,
  ClockCircle,
  DangerTriangle,
  GraphUp,
  UsersGroupTwoRounded,
  Buildings2,
  ChecklistMinimalistic,
} from '@solar-icons/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PipelineStepper, type PipelineStage } from '@/components/ui/PipelineStepper';
import { HeaderClockDisplay } from '@/features/dashboard/components/widgets/DashboardHeaderWidget';
import { LEADS } from '../data/leads';
import { BOOKINGS } from '../data/bookings';
import { parseMoney, matchHotel, SANCTUARY_HOTELS } from '../utils/reservationEvents';

/* ─── Luxury Monochrome Card Token — Borderless & Backgroundless (AGENTS.md §3) ─── */
const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full';

/* ─── Lead Pipeline Stages (Matched 100% to LeadDetailPage PipelineStepper) ─── */
const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'prospect', label: 'Prospect' },
  { id: 'verbal-definite', label: 'Verbal Definite' },
  { id: 'tentative', label: 'Tentative' },
  { id: 'definite', label: 'Definite' },
  { id: 'turned-down', label: 'Turned Down', terminal: true, tone: 'danger' },
  { id: 'cancelled', label: 'Cancelled', terminal: true, tone: 'danger' },
  { id: 'postponed', label: 'Postponed', terminal: true, tone: 'muted' },
];

type PipelineMetricMode = 'value' | 'nights' | 'leads';
type TaskFilterTab = 'today' | 'upcoming' | 'overdue' | 'completed';
type ArrivalFilterTab = 'all' | 'vvip' | 'vip' | 'groups' | 'attention';
type PropertyMetricTab = 'value' | 'nights' | 'leads';

interface PriorityActionRow {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  type: string;
  bookingOrLead: string;
  property: string;
  actionRequired: string;
  dueDate: string;
  isDueToday: boolean;
  value: number;
  targetHref: string;
}

interface TaskItemRow {
  id: string;
  task: string;
  bookingOrLead: string;
  property: string;
  dueDate: string;
  isDueToday: boolean;
  bucket: TaskFilterTab;
  targetHref: string;
}

interface UpcomingArrivalRow {
  id: string;
  arrivalDate: string;
  bookingGuest: string;
  guestType: 'VVIP' | 'VIP' | 'Group';
  property: string;
  nights: number;
  rooms: number;
  status: 'Confirmed' | 'Pending' | 'Tentative';
  outstandingActions: string;
  requiresAttention: boolean;
  targetHref: string;
}

interface GroupCorporateRow {
  id: string;
  bookingEvent: string;
  property: string;
  stayPeriod: string;
  roomNights: number;
  value: number;
  status: 'Tentative' | 'Incomplete' | 'Confirming' | 'Confirmed';
  nextMilestone: string;
  targetHref: string;
}

const INITIAL_PRIORITY_ACTIONS: PriorityActionRow[] = [
  {
    id: 'pa-1',
    priority: 'Critical',
    type: 'Tentative',
    bookingOrLead: 'Corporate Incentive Retreat',
    property: 'SOSEI AlUla',
    actionRequired: 'Confirm decision',
    dueDate: 'Today',
    isDueToday: true,
    value: 45000,
    targetHref: '/dashboard/reservations/leads/LD-001',
  },
  {
    id: 'pa-2',
    priority: 'Critical',
    type: 'Arrival Readiness',
    bookingOrLead: 'VVIP Lagoon Villa Buyout',
    property: 'SOSEI AlUla',
    actionRequired: 'Finalize airport transfer',
    dueDate: 'Today',
    isDueToday: true,
    value: 32000,
    targetHref: '/dashboard/reservations/bookings/BK-001',
  },
  {
    id: 'pa-3',
    priority: 'High',
    type: 'Group Booking',
    bookingOrLead: 'Executive Medical Congress',
    property: 'SOSEI Geneva',
    actionRequired: 'Receive rooming list',
    dueDate: '1 Oct 2026',
    isDueToday: false,
    value: 18000,
    targetHref: '/dashboard/reservations/bookings/BK-003',
  },
  {
    id: 'pa-4',
    priority: 'High',
    type: 'Deposit',
    bookingOrLead: 'Family Reunion Chalet Block',
    property: 'SOSEI Courchevel',
    actionRequired: 'Follow up on deposit',
    dueDate: '1 Oct 2026',
    isDueToday: false,
    value: 12500,
    targetHref: '/dashboard/reservations/leads/LD-002',
  },
  {
    id: 'pa-5',
    priority: 'Medium',
    type: 'Booking Change',
    bookingOrLead: 'Private Group Charter',
    property: 'SOSEI Muscat',
    actionRequired: 'Amend dates',
    dueDate: '2 Oct 2026',
    isDueToday: false,
    value: 55200,
    targetHref: '/dashboard/reservations/leads/LD-006',
  },
  {
    id: 'pa-6',
    priority: 'Medium',
    type: 'Release Date',
    bookingOrLead: 'Winter Lodge Buyout',
    property: 'SOSEI Courchevel',
    actionRequired: 'Confirm release',
    dueDate: '3 Oct 2026',
    isDueToday: false,
    value: 54000,
    targetHref: '/dashboard/reservations/bookings/BK-002',
  },
  {
    id: 'pa-7',
    priority: 'Low',
    type: 'Special Request',
    bookingOrLead: 'VIP Coastal Sanctuary Stay',
    property: 'SOSEI Amalfi',
    actionRequired: 'Check dietary request',
    dueDate: '5 Oct 2026',
    isDueToday: false,
    value: 21500,
    targetHref: '/dashboard/reservations/leads/LD-005',
  },
  {
    id: 'pa-8',
    priority: 'Low',
    type: 'Contract',
    bookingOrLead: 'Luxury Travel VIP Group',
    property: 'SOSEI Kyoto',
    actionRequired: 'Provide final offer',
    dueDate: '6 Oct 2026',
    isDueToday: false,
    value: 11900,
    targetHref: '/dashboard/reservations/leads/LD-003',
  },
];

const INITIAL_TASKS: TaskItemRow[] = [
  {
    id: 'tsk-1',
    task: 'Call client for confirmation',
    bookingOrLead: 'Corporate Incentive',
    property: 'SOSEI AlUla',
    dueDate: 'Today',
    isDueToday: true,
    bucket: 'today',
    targetHref: '/dashboard/reservations/leads/LD-001',
  },
  {
    id: 'tsk-2',
    task: 'Send revised proposal',
    bookingOrLead: 'Executive Meeting',
    property: 'SOSEI Geneva',
    dueDate: 'Today',
    isDueToday: true,
    bucket: 'today',
    targetHref: '/dashboard/reservations/bookings/BK-003',
  },
  {
    id: 'tsk-3',
    task: 'Request rooming list',
    bookingOrLead: 'Family Reunion',
    property: 'SOSEI Courchevel',
    dueDate: 'Today',
    isDueToday: true,
    bucket: 'today',
    targetHref: '/dashboard/reservations/leads/LD-002',
  },
  {
    id: 'tsk-4',
    task: 'Follow up on payment',
    bookingOrLead: 'Wellness Retreat',
    property: 'SOSEI Patagonia',
    dueDate: 'Today',
    isDueToday: true,
    bucket: 'today',
    targetHref: '/dashboard/reservations/leads/LD-008',
  },
  {
    id: 'tsk-5',
    task: 'Update booking details',
    bookingOrLead: 'Private Group',
    property: 'SOSEI Muscat',
    dueDate: '3 Oct',
    isDueToday: false,
    bucket: 'today',
    targetHref: '/dashboard/reservations/leads/LD-006',
  },
  {
    id: 'tsk-6',
    task: 'Confirm flight details',
    bookingOrLead: 'Travel Agent Group',
    property: 'SOSEI Kyoto',
    dueDate: '3 Oct',
    isDueToday: false,
    bucket: 'upcoming',
    targetHref: '/dashboard/reservations/leads/LD-003',
  },
  {
    id: 'tsk-7',
    task: 'Review contract terms',
    bookingOrLead: 'Winter Lodge Buyout',
    property: 'SOSEI Courchevel',
    dueDate: '5 Oct',
    isDueToday: false,
    bucket: 'upcoming',
    targetHref: '/dashboard/reservations/bookings/BK-002',
  },
  {
    id: 'tsk-8',
    task: 'Escalate overdue deposit invoice',
    bookingOrLead: 'Desert Astronomy Buyout',
    property: 'SOSEI Marrakech',
    dueDate: 'Overdue 2d',
    isDueToday: true,
    bucket: 'overdue',
    targetHref: '/dashboard/reservations/leads/LD-004',
  },
  {
    id: 'tsk-9',
    task: 'Finalize yacht transfer manifest',
    bookingOrLead: 'Mediterranean Yachting Group',
    property: 'SOSEI Amalfi',
    dueDate: 'Overdue 1d',
    isDueToday: true,
    bucket: 'overdue',
    targetHref: '/dashboard/reservations/leads/LD-005',
  },
  {
    id: 'tsk-10',
    task: 'Countersign group SLA addendum',
    bookingOrLead: 'Baja Coastal Incentive',
    property: 'SOSEI Los Cabos',
    dueDate: 'Completed',
    isDueToday: false,
    bucket: 'completed',
    targetHref: '/dashboard/reservations/leads/LD-007',
  },
];

const UPCOMING_ARRIVALS_DATA: UpcomingArrivalRow[] = [
  {
    id: 'arr-1',
    arrivalDate: '5 Oct 2026',
    bookingGuest: 'Wellness Retreat',
    guestType: 'VIP',
    property: 'SOSEI Patagonia',
    nights: 5,
    rooms: 12,
    status: 'Confirmed',
    outstandingActions: '1 task pending',
    requiresAttention: true,
    targetHref: '/dashboard/reservations/leads/LD-008',
  },
  {
    id: 'arr-2',
    arrivalDate: '12 Oct 2026',
    bookingGuest: 'Private Group',
    guestType: 'Group',
    property: 'SOSEI Muscat',
    nights: 3,
    rooms: 30,
    status: 'Confirmed',
    outstandingActions: 'Rooming list',
    requiresAttention: false,
    targetHref: '/dashboard/reservations/leads/LD-006',
  },
  {
    id: 'arr-3',
    arrivalDate: '18 Oct 2026',
    bookingGuest: 'Luxury Family Stay',
    guestType: 'VVIP',
    property: 'SOSEI Amalfi',
    nights: 6,
    rooms: 28,
    status: 'Pending',
    outstandingActions: 'Airport transfer, villa setup',
    requiresAttention: true,
    targetHref: '/dashboard/reservations/leads/LD-005',
  },
  {
    id: 'arr-4',
    arrivalDate: '20 Oct 2026',
    bookingGuest: 'Travel Agent Group',
    guestType: 'Group',
    property: 'SOSEI Kyoto',
    nights: 7,
    rooms: 40,
    status: 'Confirmed',
    outstandingActions: 'Guest details',
    requiresAttention: false,
    targetHref: '/dashboard/reservations/leads/LD-003',
  },
  {
    id: 'arr-5',
    arrivalDate: '25 Oct 2026',
    bookingGuest: 'Executive Meeting',
    guestType: 'Group',
    property: 'SOSEI Geneva',
    nights: 3,
    rooms: 22,
    status: 'Confirmed',
    outstandingActions: 'Rooming list',
    requiresAttention: false,
    targetHref: '/dashboard/reservations/bookings/BK-003',
  },
  {
    id: 'arr-6',
    arrivalDate: '28 Oct 2026',
    bookingGuest: 'Corporate Incentive',
    guestType: 'Group',
    property: 'SOSEI AlUla',
    nights: 5,
    rooms: 36,
    status: 'Tentative',
    outstandingActions: 'Deposit, special requests',
    requiresAttention: true,
    targetHref: '/dashboard/reservations/leads/LD-001',
  },
];

const GROUP_CORPORATE_DATA: GroupCorporateRow[] = [
  {
    id: 'gc-1',
    bookingEvent: 'Corporate Incentive',
    property: 'SOSEI AlUla',
    stayPeriod: '28 Oct – 2 Nov',
    roomNights: 180,
    value: 45000,
    status: 'Tentative',
    nextMilestone: 'Deposit due 1 Oct',
    targetHref: '/dashboard/reservations/leads/LD-001',
  },
  {
    id: 'gc-2',
    bookingEvent: 'Executive Meeting',
    property: 'SOSEI Geneva',
    stayPeriod: '25 – 28 Oct',
    roomNights: 90,
    value: 18000,
    status: 'Incomplete',
    nextMilestone: 'Rooming list due',
    targetHref: '/dashboard/reservations/bookings/BK-003',
  },
  {
    id: 'gc-3',
    bookingEvent: 'Family Reunion',
    property: 'SOSEI Courchevel',
    stayPeriod: '12 – 18 Nov',
    roomNights: 210,
    value: 37000,
    status: 'Tentative',
    nextMilestone: 'Confirm by 5 Oct',
    targetHref: '/dashboard/reservations/leads/LD-002',
  },
  {
    id: 'gc-4',
    bookingEvent: 'Winter Lodge Buyout',
    property: 'SOSEI Courchevel',
    stayPeriod: '15 – 22 Dec',
    roomNights: 420,
    value: 54000,
    status: 'Confirming',
    nextMilestone: 'Contract review',
    targetHref: '/dashboard/reservations/bookings/BK-002',
  },
  {
    id: 'gc-5',
    bookingEvent: 'Wellness Retreat',
    property: 'SOSEI Patagonia',
    stayPeriod: '5 – 10 Oct',
    roomNights: 120,
    value: 21500,
    status: 'Confirmed',
    nextMilestone: 'Final guest list',
    targetHref: '/dashboard/reservations/leads/LD-008',
  },
];

function fmtCompactUsd(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${Math.round(val).toLocaleString('en-US')}`;
}

function fmtFullUsd(val: number): string {
  return `$${Math.round(val).toLocaleString('en-US')}`;
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ReservationOverviewPage() {
  const navigate = useNavigate();

  /* ─── Filter & Interactive States ─── */
  const [hotel, setHotel] = useState<string>('all');
  const [asOfPeriod, setAsOfPeriod] = useState<string>('08 Oct 2026');
  const [pipelineMetric, setPipelineMetric] = useState<PipelineMetricMode>('value');
  const [pipelineHorizon, setPipelineHorizon] = useState<string>('Next 6 Months');
  const [activePipelineStage, setActivePipelineStage] = useState<string>('tentative');
  const [taskTab, setTaskTab] = useState<TaskFilterTab>('today');
  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({
    'tsk-10': true,
  });
  const [arrivalTab, setArrivalTab] = useState<ArrivalFilterTab>('all');
  const [propertyMetricTab, setPropertyMetricTab] = useState<PropertyMetricTab>('value');

  const horizonScale =
    pipelineHorizon === 'Next 3 Months' ? 0.65 : pipelineHorizon === 'Full Year' ? 1.45 : 1;

  /* ─── Filtered Datasets by Property ─── */
  const filteredLeads = useMemo(
    () => LEADS.filter((l) => matchHotel(l.hotel, hotel)),
    [hotel],
  );
  const filteredBookings = useMemo(
    () => BOOKINGS.filter((b) => matchHotel(b.hotel, hotel)),
    [hotel],
  );

  const priorityActions = useMemo(
    () =>
      INITIAL_PRIORITY_ACTIONS.filter((item) =>
        hotel === 'all' ? true : matchHotel(item.property, hotel),
      ),
    [hotel],
  );

  const filteredTasks = useMemo(() => {
    const byProp = INITIAL_TASKS.filter((item) =>
      hotel === 'all' ? true : matchHotel(item.property, hotel),
    );
    if (taskTab === 'today') return byProp;
    return byProp.filter((t) => t.bucket === taskTab);
  }, [hotel, taskTab]);

  const filteredArrivals = useMemo(() => {
    const byProp = UPCOMING_ARRIVALS_DATA.filter((item) =>
      hotel === 'all' ? true : matchHotel(item.property, hotel),
    );
    if (arrivalTab === 'vvip') return byProp.filter((a) => a.guestType === 'VVIP');
    if (arrivalTab === 'vip') return byProp.filter((a) => a.guestType === 'VIP');
    if (arrivalTab === 'groups') return byProp.filter((a) => a.guestType === 'Group');
    if (arrivalTab === 'attention') return byProp.filter((a) => a.requiresAttention);
    return byProp;
  }, [hotel, arrivalTab]);

  const filteredGroupBookings = useMemo(
    () =>
      GROUP_CORPORATE_DATA.filter((item) =>
        hotel === 'all' ? true : matchHotel(item.property, hotel),
      ),
    [hotel],
  );

  /* ─── Section 03: Lead Pipeline Stage Aggregation (Prospect → Postponed) ─── */
  const pipelineStagesData = useMemo(() => {
    const baseStageDefaults: Record<
      string,
      { fallbackCount: number; fallbackNights: number; fallbackVal: number }
    > = {
      prospect: { fallbackCount: 6, fallbackNights: 420, fallbackVal: 142300 },
      'verbal-definite': { fallbackCount: 8, fallbackNights: 618, fallbackVal: 213400 },
      tentative: { fallbackCount: 10, fallbackNights: 1284, fallbackVal: 284600 },
      definite: { fallbackCount: 6, fallbackNights: 486, fallbackVal: 156200 },
      'turned-down': { fallbackCount: 3, fallbackNights: 190, fallbackVal: 64800 },
      cancelled: { fallbackCount: 2, fallbackNights: 110, fallbackVal: 38200 },
      postponed: { fallbackCount: 2, fallbackNights: 96, fallbackVal: 28500 },
    };

    const propScale = hotel === 'all' ? 1 : 0.24;

    return PIPELINE_STAGES.map((stage) => {
      const matching = filteredLeads.filter((l) => l.stage === stage.id);
      const actualVal = matching.reduce((s, l) => s + parseMoney(l.totalValue), 0);
      const def = baseStageDefaults[stage.id];

      const value = Math.round(
        (hotel === 'all'
          ? Math.max(def.fallbackVal, actualVal)
          : actualVal > 0
          ? actualVal
          : def.fallbackVal * propScale) * horizonScale,
      );
      const leadsCount =
        hotel === 'all'
          ? Math.max(def.fallbackCount, matching.length)
          : Math.max(1, matching.length || Math.round(def.fallbackCount * propScale));
      const roomNights = Math.round(
        (hotel === 'all' ? def.fallbackNights : def.fallbackNights * propScale) *
          horizonScale,
      );

      return {
        ...stage,
        value,
        leadsCount,
        roomNights,
      };
    });
  }, [filteredLeads, hotel, horizonScale]);

  /* ─── Section 01: 5 Key Indicators (INCOMPLETE RECORDS excluded per user X mark) ─── */
  const keyIndicators = useMemo(() => {
    const pendingStages = pipelineStagesData.filter(
      (s) => s.id === 'prospect' || s.id === 'verbal-definite' || s.id === 'tentative',
    );
    const pendingVal =
      hotel === 'all'
        ? 492300
        : pendingStages.reduce((acc, s) => acc + s.value, 0);
    const pendingCount =
      hotel === 'all'
        ? 12
        : pendingStages.reduce((acc, s) => acc + s.leadsCount, 0);
    const pendingNights =
      hotel === 'all'
        ? 1284
        : pendingStages.reduce((acc, s) => acc + s.roomNights, 0);

    const confirmedVal =
      hotel === 'all'
        ? 264300
        : filteredBookings
            .filter((b) => b.bookingStatus !== 'Cancelled')
            .reduce((acc, b) => acc + parseMoney(b.revenue), 0) || 68400;
    const confirmedCount =
      hotel === 'all'
        ? 15
        : Math.max(2, filteredBookings.filter((b) => b.bookingStatus !== 'Cancelled').length);
    const confirmedNights =
      hotel === 'all' ? 920 : Math.max(110, confirmedCount * 62);

    const arrivalCount = filteredArrivals.length;
    const arrivalNights = filteredArrivals.reduce(
      (acc, a) => acc + a.nights * Math.max(1, Math.round(a.rooms / 4)),
      0,
    );
    const vvipVipCount = filteredArrivals.filter(
      (a) => a.guestType === 'VVIP' || a.guestType === 'VIP',
    ).length;
    const groupArrCount = filteredArrivals.filter((a) => a.guestType === 'Group').length;

    const overdueCount = hotel === 'all' ? 8 : Math.max(1, priorityActions.length);
    const totalBookingRev = pendingVal + confirmedVal - (hotel === 'all' ? 2800 : 0);

    return {
      pendingVal,
      pendingCount,
      pendingNights,
      confirmedVal,
      confirmedCount,
      confirmedNights,
      arrivalCount,
      arrivalNights: hotel === 'all' ? 386 : arrivalNights,
      vvipVipCount,
      groupArrCount,
      overdueCount,
      totalBookingRev: hotel === 'all' ? 753800 : totalBookingRev,
      totalBookingsCount: hotel === 'all' ? 35 : pendingCount + confirmedCount,
      totalRoomNights: hotel === 'all' ? 2850 : pendingNights + confirmedNights,
    };
  }, [pipelineStagesData, hotel, filteredBookings, filteredArrivals, priorityActions.length]);

  /* ─── Section 05 Left: Property Pipeline Overview (All SOSEI Properties) ─── */
  const propertyPipelineRows = useMemo(() => {
    const baseRows = SANCTUARY_HOTELS.map((propName, idx) => {
      const propLeads = LEADS.filter((l) => matchHotel(l.hotel, propName));
      const propBookings = BOOKINGS.filter(
        (b) => matchHotel(b.hotel, propName) && b.bookingStatus !== 'Cancelled',
      );
      const countStage = (st: string, fallback: number) =>
        propLeads.filter((l) => l.stage === st).length || fallback;

      const prospect = countStage('prospect', (idx % 3) + 1);
      const verbal = countStage('verbal-definite', ((idx + 1) % 3) + 1);
      const tentative = countStage('tentative', ((idx + 2) % 4) + 1);
      const definite = countStage('definite', (idx % 2) + 1);
      const confirmed = Math.max(1, propBookings.length);

      const leadVal = propLeads.reduce((s, l) => s + parseMoney(l.totalValue), 0);
      const bookVal = propBookings.reduce((s, b) => s + parseMoney(b.revenue), 0);
      const value = Math.max(54100 + idx * 14200, leadVal + bookVal);
      const roomNights = 282 + ((idx * 89) % 550);

      return {
        property: propName,
        prospect,
        verbal,
        tentative,
        definite,
        confirmed,
        totalLeads: prospect + verbal + tentative + definite + confirmed,
        roomNights,
        value,
      };
    });
    return baseRows.sort((a, b) => b.value - a.value);
  }, []);

  const maxPropMetric = useMemo(() => {
    if (propertyMetricTab === 'nights') {
      return Math.max(1, ...propertyPipelineRows.map((r) => r.roomNights));
    }
    if (propertyMetricTab === 'leads') {
      return Math.max(1, ...propertyPipelineRows.map((r) => r.totalLeads));
    }
    return Math.max(1, ...propertyPipelineRows.map((r) => r.value));
  }, [propertyPipelineRows, propertyMetricTab]);

  /* ─── Section 05 Right: Reservation Team Workload, Performance & SLA ─── */
  const reservationTeamRows = useMemo(() => {
    const scale = hotel === 'all' ? 1 : 0.35;
    const baseTeam = [
      {
        name: 'Sarah Jenkins',
        openTasks: 8,
        overdue: 3,
        slaAvg: '1.2h',
        slaPct: 98,
        pendingVal: Math.round(238500 * scale),
        confirmedVal: Math.round(117600 * scale),
        roomNights: Math.round(920 * scale),
      },
      {
        name: 'Emma Watson',
        openTasks: 9,
        overdue: 2,
        slaAvg: '1.5h',
        slaPct: 95,
        pendingVal: Math.round(219100 * scale),
        confirmedVal: Math.round(61200 * scale),
        roomNights: Math.round(612 * scale),
      },
      {
        name: 'David Miller',
        openTasks: 8,
        overdue: 2,
        slaAvg: '1.8h',
        slaPct: 92,
        pendingVal: Math.round(109300 * scale),
        confirmedVal: Math.round(85500 * scale),
        roomNights: Math.round(486 * scale),
      },
      {
        name: 'James Lee',
        openTasks: 6,
        overdue: 1,
        slaAvg: '1.4h',
        slaPct: 96,
        pendingVal: Math.round(74600 * scale),
        confirmedVal: Math.round(52300 * scale),
        roomNights: Math.round(402 * scale),
      },
      {
        name: 'Priya Rao',
        openTasks: 5,
        overdue: 0,
        slaAvg: '0.9h',
        slaPct: 100,
        pendingVal: Math.round(62100 * scale),
        confirmedVal: Math.round(41800 * scale),
        roomNights: Math.round(310 * scale),
      },
      {
        name: 'Michael Kim',
        openTasks: 4,
        overdue: 0,
        slaAvg: '1.1h',
        slaPct: 99,
        pendingVal: Math.round(48900 * scale),
        confirmedVal: Math.round(37200 * scale),
        roomNights: Math.round(276 * scale),
      },
    ];
    return baseTeam.map((m) => ({
      ...m,
      totalValue: m.pendingVal + m.confirmedVal,
    }));
  }, [hotel]);

  const maxTeamValue = Math.max(1, ...reservationTeamRows.map((m) => m.totalValue));

  const toggleTaskDone = (id: string) => {
    setCompletedTaskIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 bg-white text-[10px]">
      {/* ─── TOP EXECUTIVE HEADER (Consistent with other Dashboards) ─── */}
      <div className="shrink-0 flex flex-col gap-3 pt-4 lg:pt-6 animate-card-enter">
        <div className="w-full border-b border-zinc-200/80 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
              Reservations
            </h1>
            <p className="text-[10px] text-zinc-500 font-normal mt-0.5">
              From enquiries to exceptional stays
            </p>
          </div>
          <HeaderClockDisplay />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{asOfPeriod}</strong>
            </span>
            <span className="text-zinc-300">·</span>
            <span>
              Property:{' '}
              <strong className="font-semibold text-zinc-900">
                {hotel === 'all' ? 'All SOSEI Properties' : hotel}
              </strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Property Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-lg">
              <Buildings2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <Select value={hotel} onValueChange={setHotel}>
                <SelectTrigger
                  id="reservation-property-filter"
                  className="h-5 border-0 bg-transparent p-0 text-[10px] font-medium text-zinc-900 shadow-none focus:ring-0 cursor-pointer min-w-[135px]"
                >
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All SOSEI Properties</SelectItem>
                    {SANCTUARY_HOTELS.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* As Of Period Pills */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg">
              {(['Yesterday', '08 Oct 2026', 'YTD 2026'] as const).map((periodLabel) => {
                const active = asOfPeriod === periodLabel;
                const display =
                  periodLabel === '08 Oct 2026'
                    ? 'MTD (08 Oct)'
                    : periodLabel === 'YTD 2026'
                    ? 'YTD'
                    : 'Yesterday';
                return (
                  <button
                    key={periodLabel}
                    type="button"
                    onClick={() => setAsOfPeriod(periodLabel)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {display}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT GRID (Borderless & Backgroundless Cards) ─── */}
      <div className="flex flex-col gap-4">
        {/* ─── 01. KEY INDICATORS (5 KPI Cards — Incomplete Records Excluded per X Mark) ─── */}
        <section
          aria-label="Key Indicators"
          className="-mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {/* KPI 1: Pending Confirmation */}
          <div
            onClick={() => navigate('/dashboard/reservations/leads')}
            className={CARD_CLASS}
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 min-w-0">
                <ClockCircle className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="text-[9.5px] font-normal tracking-normal uppercase text-zinc-900 truncate">
                  PENDING CONFIRMATION
                </span>
              </div>
              <span className="inline-flex items-center shrink-0 whitespace-nowrap text-[8px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                +12% vs LM
              </span>
            </div>
            <div className="text-[20px] xl:text-[22px] font-normal text-zinc-900 leading-tight my-1.5 tabular-nums">
              {fmtCompactUsd(keyIndicators.pendingVal)}
            </div>
            <div className="text-[9.5px] text-zinc-500 font-medium truncate">
              {keyIndicators.pendingCount} leads · {keyIndicators.pendingNights.toLocaleString()} room nights
            </div>
          </div>

          {/* KPI 2: Confirmed Bookings */}
          <div
            onClick={() => navigate('/dashboard/reservations/bookings')}
            className={CARD_CLASS}
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 min-w-0">
                <CheckCircle className="w-3 h-3 text-[#14532d] shrink-0" />
                <span className="text-[9.5px] font-normal tracking-normal uppercase text-zinc-900 truncate">
                  CONFIRMED BOOKINGS
                </span>
              </div>
              <span className="inline-flex items-center shrink-0 whitespace-nowrap text-[8px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                +8% vs LM
              </span>
            </div>
            <div className="text-[20px] xl:text-[22px] font-normal text-zinc-900 leading-tight my-1.5 tabular-nums">
              {fmtCompactUsd(keyIndicators.confirmedVal)}
            </div>
            <div className="text-[9.5px] text-zinc-500 font-medium truncate">
              {keyIndicators.confirmedCount} bookings · {keyIndicators.confirmedNights.toLocaleString()} room nights
            </div>
          </div>

          {/* KPI 3: Upcoming Arrivals */}
          <div
            onClick={() => navigate('/dashboard/reservations/bookings')}
            className={CARD_CLASS}
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 min-w-0">
                <Calendar className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="text-[9.5px] font-normal tracking-normal uppercase text-zinc-900 truncate">
                  UPCOMING ARRIVALS
                </span>
              </div>
              <span className="inline-flex items-center shrink-0 whitespace-nowrap text-[8px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                Next 30 days
              </span>
            </div>
            <div className="flex items-baseline justify-between my-1.5">
              <div className="text-[20px] xl:text-[22px] font-normal text-zinc-900 leading-tight tabular-nums">
                {keyIndicators.arrivalCount}{' '}
                <span className="text-[12px] text-zinc-500 font-normal">bookings</span>
              </div>
              <div className="flex flex-col text-right text-[9px] text-zinc-600 font-medium shrink-0 whitespace-nowrap">
                <span>
                  <strong className="text-zinc-900">{keyIndicators.vvipVipCount}</strong> VIP/VVIP
                </span>
                <span>
                  <strong className="text-zinc-900">{keyIndicators.groupArrCount}</strong> Groups
                </span>
              </div>
            </div>
            <div className="text-[9.5px] text-zinc-500 font-medium truncate">
              {keyIndicators.arrivalNights.toLocaleString()} room nights
            </div>
          </div>

          {/* KPI 4: Overdue Tasks */}
          <div
            onClick={() => setTaskTab('overdue')}
            className={CARD_CLASS}
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 min-w-0">
                <DangerTriangle className="w-3 h-3 text-[#800020] shrink-0" />
                <span className="text-[9.5px] font-normal tracking-normal uppercase text-zinc-900 truncate">
                  OVERDUE TASKS
                </span>
              </div>
              <span className="inline-flex items-center shrink-0 whitespace-nowrap text-[8px] font-semibold px-1.5 py-0.5 rounded bg-[#fff1f2] text-[#800020]">
                +3 vs LW
              </span>
            </div>
            <div className="text-[20px] xl:text-[22px] font-normal text-[#800020] leading-tight my-1.5 tabular-nums">
              {keyIndicators.overdueCount}
            </div>
            <div className="text-[9.5px] text-zinc-500 font-medium truncate">
              Total outstanding actions
            </div>
          </div>

          {/* KPI 5: Booking Revenue */}
          <div
            onClick={() => navigate('/dashboard/reservations/bookings')}
            className={CARD_CLASS}
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 min-w-0">
                <GraphUp className="w-3 h-3 text-[#14532d] shrink-0" />
                <span className="text-[9.5px] font-normal tracking-normal uppercase text-zinc-900 truncate">
                  BOOKING REVENUE
                </span>
              </div>
              <span className="inline-flex items-center shrink-0 whitespace-nowrap text-[8px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                +15% vs LM
              </span>
            </div>
            <div className="text-[20px] xl:text-[22px] font-normal text-zinc-900 leading-tight my-1.5 tabular-nums">
              {fmtCompactUsd(keyIndicators.totalBookingRev)}
            </div>
            <div className="text-[9.5px] text-zinc-500 font-medium truncate">
              {keyIndicators.totalBookingsCount} bookings · {keyIndicators.totalRoomNights.toLocaleString()} room nights
            </div>
          </div>
        </section>

        {/* ─── 02. PRIORITY ACTIONS (7 cols) & MY TASKS (5 cols) ─── */}
        <section
          aria-label="Priority Actions and Tasks"
          className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
        >
          {/* Left: Priority Actions */}
          <div className={`lg:col-span-7 ${CARD_CLASS}`}>
            <div>
              <div className="flex items-center justify-between h-4 mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    PRIORITY ACTIONS
                  </h2>
                  <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#fff1f2] text-[#800020]">
                    {priorityActions.length} urgent
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/reservations/leads')}
                  className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  All Leads &amp; Bookings
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                      <th className="py-2 pr-2">Priority</th>
                      <th className="py-2 pr-2">Type</th>
                      <th className="py-2 pr-2">Booking / Lead</th>
                      <th className="py-2 pr-2">Property</th>
                      <th className="py-2 pr-2">Action Required</th>
                      <th className="py-2 pr-2">Due Date</th>
                      <th className="py-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100/60 text-[10px]">
                    {priorityActions.map((item) => {
                      const dotColor =
                        item.priority === 'Critical'
                          ? 'bg-[#800020]'
                          : item.priority === 'High'
                          ? 'bg-zinc-900'
                          : item.priority === 'Medium'
                          ? 'bg-zinc-500'
                          : 'bg-zinc-300';
                      const priorityTextColor =
                        item.priority === 'Critical'
                          ? 'text-[#800020] font-semibold'
                          : item.priority === 'High'
                          ? 'text-zinc-900 font-semibold'
                          : 'text-zinc-600 font-medium';
                      return (
                        <tr
                          key={item.id}
                          onClick={() => navigate(item.targetHref)}
                          className="hover:bg-zinc-200/40 transition-colors cursor-pointer"
                        >
                          <td className="py-2 pr-2 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                              <span className={priorityTextColor}>{item.priority}</span>
                            </div>
                          </td>
                          <td className="py-2 pr-2 text-zinc-600 whitespace-nowrap">{item.type}</td>
                          <td className="py-2 pr-2 font-medium text-zinc-900 truncate max-w-[140px]">
                            {item.bookingOrLead}
                          </td>
                          <td className="py-2 pr-2 text-zinc-600 whitespace-nowrap">
                            {item.property.replace('SOSEI ', '')}
                          </td>
                          <td className="py-2 pr-2 text-zinc-700 truncate max-w-[145px]">
                            {item.actionRequired}
                          </td>
                          <td
                            className={`py-2 pr-2 whitespace-nowrap font-medium ${
                              item.isDueToday ? 'text-[#800020]' : 'text-zinc-600'
                            }`}
                          >
                            {item.dueDate}
                          </td>
                          <td className="py-2 text-right font-medium text-zinc-900 tabular-nums whitespace-nowrap">
                            {fmtFullUsd(item.value)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: My Tasks */}
          <div className={`lg:col-span-5 ${CARD_CLASS}`}>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <ChecklistMinimalistic className="w-3.5 h-3.5 text-zinc-700" />
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    MY TASKS
                  </h2>
                </div>

                {/* Filter Pills: Today | Upcoming | Overdue | Completed */}
                <div
                  className="inline-flex items-center bg-zinc-100 p-0.5 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(
                    [
                      { id: 'today', label: 'Today', count: 5 },
                      { id: 'upcoming', label: 'Upcoming', count: 12 },
                      { id: 'overdue', label: 'Overdue', count: 8 },
                      { id: 'completed', label: 'Completed', count: 14 },
                    ] as const
                  ).map((t) => {
                    const active = taskTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTaskTab(t.id)}
                        className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <span>{t.label}</span>
                        <span
                          className={`text-[8px] ${
                            active
                              ? 'text-zinc-300'
                              : t.id === 'overdue'
                              ? 'text-[#800020] font-semibold'
                              : 'text-zinc-400'
                          }`}
                        >
                          {t.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                      <th className="py-2 pr-2">Task</th>
                      <th className="py-2 pr-2">Booking / Lead</th>
                      <th className="py-2 pr-2">Property</th>
                      <th className="py-2 text-right">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100/60 text-[10px]">
                    {filteredTasks.slice(0, 7).map((tsk) => {
                      const isChecked = Boolean(completedTaskIds[tsk.id]);
                      return (
                        <tr
                          key={tsk.id}
                          className="hover:bg-zinc-200/40 transition-colors"
                        >
                          <td className="py-2 pr-2" onClick={(e) => e.stopPropagation()}>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleTaskDone(tsk.id)}
                                className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer accent-zinc-900"
                              />
                              <span
                                className={`font-medium truncate max-w-[155px] ${
                                  isChecked ? 'line-through text-zinc-400' : 'text-zinc-800'
                                }`}
                              >
                                {tsk.task}
                              </span>
                            </label>
                          </td>
                          <td
                            onClick={() => navigate(tsk.targetHref)}
                            className="py-2 pr-2 text-zinc-600 hover:text-zinc-900 cursor-pointer truncate max-w-[115px]"
                          >
                            {tsk.bookingOrLead}
                          </td>
                          <td className="py-2 pr-2 text-zinc-500 whitespace-nowrap">
                            {tsk.property.replace('SOSEI ', '')}
                          </td>
                          <td
                            className={`py-2 text-right font-medium whitespace-nowrap ${
                              tsk.isDueToday ? 'text-[#800020]' : 'text-zinc-600'
                            }`}
                          >
                            {tsk.dueDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 03. RESERVATION PIPELINE (Full Width — Uses Exact LeadDetailPage PipelineStepper) ─── */}
        <div className="-mx-4">
          <section aria-label="Reservation Pipeline" className={CARD_CLASS}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  RESERVATION PIPELINE
                </h2>
                <p className="text-[9px] text-zinc-400 font-normal">
                  End-to-end lead conversion pipeline from Prospect to Definite &amp; Terminal stages
                </p>
              </div>

              <div
                className="flex flex-wrap items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Metric Toggle: Value | Room Nights | Leads */}
                <div className="inline-flex items-center bg-zinc-100 p-0.5 rounded-lg">
                  {(
                    [
                      { id: 'value', label: 'Value' },
                      { id: 'nights', label: 'Room Nights' },
                      { id: 'leads', label: 'Leads' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPipelineMetric(tab.id)}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-medium transition-all cursor-pointer ${
                        pipelineMetric === tab.id
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Horizon Select */}
                <Select value={pipelineHorizon} onValueChange={setPipelineHorizon}>
                  <SelectTrigger className="h-7 text-[9.5px] bg-zinc-100 border-0 rounded-lg px-2.5 text-zinc-800 cursor-pointer w-[125px] shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Next 3 Months">Next 3 Months</SelectItem>
                      <SelectItem value="Next 6 Months">Next 6 Months</SelectItem>
                      <SelectItem value="Full Year">Full Year</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exact Lead Pipeline Chevron Stepper */}
            <div onClick={(e) => e.stopPropagation()}>
              <PipelineStepper
                stages={PIPELINE_STAGES}
                value={activePipelineStage}
                onChange={setActivePipelineStage}
              />
            </div>

            {/* Stage Metrics Aligned Underneath the 7 Stepper Columns (Borderless & Backgroundless) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-3">
              {pipelineStagesData.map((stg) => {
                const isTerminalDanger =
                  stg.id === 'turned-down' || stg.id === 'cancelled';
                const isSelected = activePipelineStage === stg.id;

                const primaryDisplay =
                  pipelineMetric === 'value'
                    ? fmtCompactUsd(stg.value)
                    : pipelineMetric === 'nights'
                    ? `${stg.roomNights.toLocaleString()} RN`
                    : `${stg.leadsCount} Leads`;

                return (
                  <div
                    key={stg.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePipelineStage(stg.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex flex-col gap-0.5 ${
                      isSelected ? 'bg-zinc-100/80' : 'hover:bg-zinc-100/50'
                    }`}
                  >
                    <div
                      className={`text-[18px] font-normal leading-tight tabular-nums ${
                        isTerminalDanger ? 'text-[#800020]' : 'text-zinc-900'
                      }`}
                    >
                      {primaryDisplay}
                    </div>
                    <div className="text-[9px] text-zinc-500 font-medium tabular-nums">
                      {stg.leadsCount} leads · {fmtCompactUsd(stg.value)}
                    </div>
                    <div className="text-[8.5px] text-zinc-400 tabular-nums">
                      {stg.roomNights.toLocaleString()} room nights
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ─── 04. UPCOMING ARRIVALS (7 cols) & GROUP & CORPORATE BOOKINGS (5 cols) ─── */}
        <section
          aria-label="Upcoming Arrivals and Group Bookings"
          className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
        >
          {/* Left: Upcoming Arrivals */}
          <div className={`lg:col-span-7 ${CARD_CLASS}`}>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                    UPCOMING ARRIVALS
                  </h2>
                  <p className="text-[9px] text-zinc-400 font-normal">
                    VIP/VVIP and group arrivals in the next 30 days
                  </p>
                </div>

                {/* Filter Pills: All | VVIP | VIP | Groups | Requiring Attention */}
                <div
                  className="inline-flex flex-wrap items-center bg-zinc-100 p-0.5 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(
                    [
                      { id: 'all', label: 'All', count: 6 },
                      { id: 'vvip', label: 'VVIP', count: 1 },
                      { id: 'vip', label: 'VIP', count: 1 },
                      { id: 'groups', label: 'Groups', count: 3 },
                      { id: 'attention', label: 'Requiring Attention', count: 2 },
                    ] as const
                  ).map((tab) => {
                    const active = arrivalTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setArrivalTab(tab.id)}
                        className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={active ? 'text-zinc-300' : 'text-zinc-400'}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                      <th className="py-2 pr-2">Arrival</th>
                      <th className="py-2 pr-2">Booking / Guest</th>
                      <th className="py-2 pr-2">Type</th>
                      <th className="py-2 pr-2">Property</th>
                      <th className="py-2 pr-2 text-right">Nights</th>
                      <th className="py-2 pr-2 text-right">Rooms</th>
                      <th className="py-2 pr-2">Status</th>
                      <th className="py-2">Outstanding Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100/60 text-[10px]">
                    {filteredArrivals.map((arr) => {
                      const statusBadge =
                        arr.status === 'Confirmed'
                          ? 'bg-[#ecfdf5] text-[#14532d]'
                          : arr.status === 'Tentative'
                          ? 'bg-[#fff1f2] text-[#800020]'
                          : 'bg-zinc-100 text-zinc-700';
                      return (
                        <tr
                          key={arr.id}
                          onClick={() => navigate(arr.targetHref)}
                          className="hover:bg-zinc-200/40 transition-colors cursor-pointer"
                        >
                          <td className="py-2 pr-2 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  arr.requiresAttention ? 'bg-[#800020]' : 'bg-zinc-400'
                                }`}
                              />
                              <span className="font-medium text-zinc-800">{arr.arrivalDate}</span>
                            </div>
                          </td>
                          <td className="py-2 pr-2 font-medium text-zinc-900 whitespace-nowrap">
                            {arr.bookingGuest}
                          </td>
                          <td className="py-2 pr-2 whitespace-nowrap">
                            <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800">
                              {arr.guestType}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-zinc-600 whitespace-nowrap">
                            {arr.property.replace('SOSEI ', '')}
                          </td>
                          <td className="py-2 pr-2 text-right text-zinc-700 tabular-nums">
                            {arr.nights}
                          </td>
                          <td className="py-2 pr-2 text-right text-zinc-700 tabular-nums">
                            {arr.rooms}
                          </td>
                          <td className="py-2 pr-2 whitespace-nowrap">
                            <span className={`text-[8.5px] font-medium px-1.5 py-0.5 rounded ${statusBadge}`}>
                              {arr.status}
                            </span>
                          </td>
                          <td
                            className={`py-2 truncate max-w-[150px] ${
                              arr.requiresAttention
                                ? 'text-[#800020] font-medium'
                                : 'text-zinc-600'
                            }`}
                          >
                            {arr.outstandingActions}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Group & Corporate Bookings */}
          <div className={`lg:col-span-5 ${CARD_CLASS}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                    GROUP &amp; CORPORATE BOOKINGS
                  </h2>
                  <p className="text-[9px] text-zinc-400 font-normal">
                    Key upcoming groups and corporate events
                  </p>
                </div>
                <UsersGroupTwoRounded className="w-4 h-4 text-zinc-400 shrink-0" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                      <th className="py-2 pr-2">Booking / Event</th>
                      <th className="py-2 pr-2">Property</th>
                      <th className="py-2 pr-2">Stay Period</th>
                      <th className="py-2 pr-2 text-right">RN</th>
                      <th className="py-2 pr-2 text-right">Value</th>
                      <th className="py-2 pr-2">Status</th>
                      <th className="py-2">Next Milestone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100/60 text-[10px]">
                    {filteredGroupBookings.map((grp) => {
                      const badgeStyle =
                        grp.status === 'Confirmed'
                          ? 'bg-[#ecfdf5] text-[#14532d]'
                          : grp.status === 'Incomplete'
                          ? 'bg-[#fff1f2] text-[#800020]'
                          : 'bg-zinc-100 text-zinc-700';
                      return (
                        <tr
                          key={grp.id}
                          onClick={() => navigate(grp.targetHref)}
                          className="hover:bg-zinc-200/40 transition-colors cursor-pointer"
                        >
                          <td className="py-2.5 pr-2 font-medium text-zinc-900 whitespace-nowrap">
                            {grp.bookingEvent}
                          </td>
                          <td className="py-2.5 pr-2 text-zinc-600 whitespace-nowrap">
                            {grp.property.replace('SOSEI ', '')}
                          </td>
                          <td className="py-2.5 pr-2 text-zinc-500 whitespace-nowrap text-[9.5px]">
                            {grp.stayPeriod}
                          </td>
                          <td className="py-2.5 pr-2 text-right text-zinc-700 tabular-nums">
                            {grp.roomNights}
                          </td>
                          <td className="py-2.5 pr-2 text-right font-medium text-zinc-900 tabular-nums">
                            {fmtCompactUsd(grp.value)}
                          </td>
                          <td className="py-2.5 pr-2 whitespace-nowrap">
                            <span className={`text-[8.5px] font-medium px-1.5 py-0.5 rounded ${badgeStyle}`}>
                              {grp.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-zinc-600 whitespace-nowrap text-[9.5px]">
                            {grp.nextMilestone}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 05. PROPERTY PIPELINE OVERVIEW (6 cols) & RESERVATION TEAM WITH SLA (6 cols) ─── */}
        <section
          aria-label="Property Pipeline and Team SLA"
          className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
        >
          {/* Left: Property Pipeline Overview */}
          <div className={`lg:col-span-6 ${CARD_CLASS}`}>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                    PROPERTY PIPELINE OVERVIEW
                  </h2>
                  <p className="text-[9px] text-zinc-400 font-normal">
                    Pipeline stage counts, room nights &amp; value by property
                  </p>
                </div>

                {/* 3-Part Segmented Toggle */}
                <div
                  className="inline-flex items-center bg-zinc-100 p-0.5 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(
                    [
                      { id: 'value', label: 'Value' },
                      { id: 'nights', label: 'Room Nights' },
                      { id: 'leads', label: 'Leads' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPropertyMetricTab(t.id)}
                      className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                        propertyMetricTab === t.id
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                      <th className="py-2 pr-2">Property</th>
                      <th className="py-2 px-1 text-center">Prospect</th>
                      <th className="py-2 px-1 text-center">Verbal</th>
                      <th className="py-2 px-1 text-center">Tentative</th>
                      <th className="py-2 px-1 text-center">Definite</th>
                      <th className="py-2 px-1 text-center">Confirmed</th>
                      <th className="py-2 px-1.5 text-right">Room Nights</th>
                      <th className="py-2 pl-2 w-[26%]">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100/60 text-[10px]">
                    {propertyPipelineRows.map((row) => {
                      const barMetric =
                        propertyMetricTab === 'nights'
                          ? row.roomNights
                          : propertyMetricTab === 'leads'
                          ? row.totalLeads
                          : row.value;
                      const barWidthPct = Math.min(100, (barMetric / maxPropMetric) * 100);
                      const isSelected = hotel === row.property;

                      return (
                        <tr
                          key={row.property}
                          onClick={() =>
                            setHotel(isSelected ? 'all' : row.property)
                          }
                          className={`hover:bg-zinc-200/40 transition-colors cursor-pointer ${
                            isSelected ? 'bg-zinc-100 font-semibold' : ''
                          }`}
                        >
                          <td className="py-2 pr-2 font-medium text-zinc-900 whitespace-nowrap">
                            {row.property}
                          </td>
                          <td className="py-2 px-1 text-center text-zinc-600 tabular-nums">
                            {row.prospect}
                          </td>
                          <td className="py-2 px-1 text-center text-zinc-600 tabular-nums">
                            {row.verbal}
                          </td>
                          <td className="py-2 px-1 text-center text-zinc-700 font-medium tabular-nums">
                            {row.tentative}
                          </td>
                          <td className="py-2 px-1 text-center text-zinc-700 font-medium tabular-nums">
                            {row.definite}
                          </td>
                          <td className="py-2 px-1 text-center text-[#14532d] font-medium tabular-nums">
                            {row.confirmed}
                          </td>
                          <td className="py-2 px-1.5 text-right text-zinc-700 tabular-nums">
                            {row.roomNights}
                          </td>
                          <td className="py-2 pl-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-zinc-900 w-12 text-right tabular-nums shrink-0">
                                {fmtCompactUsd(row.value)}
                              </span>
                              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-zinc-800 rounded-full transition-all duration-300"
                                  style={{ width: `${barWidthPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Reservation Team (With SLA Column) */}
          <div className={`lg:col-span-6 ${CARD_CLASS}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                    RESERVATION TEAM
                  </h2>
                  <p className="text-[9px] text-zinc-400 font-normal">
                    Workload, response SLA compliance and booking conversion performance
                  </p>
                </div>
                <span className="text-[8.5px] font-medium px-2 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                  Target SLA &lt; 2.0h (96% Avg)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                      <th className="py-2 pr-2">Owner</th>
                      <th className="py-2 px-1 text-center">Open</th>
                      <th className="py-2 px-1 text-center">Overdue</th>
                      <th className="py-2 px-1.5 text-center">SLA</th>
                      <th className="py-2 px-1.5 text-right">Pending Conf.</th>
                      <th className="py-2 px-1.5 text-right">Confirmed</th>
                      <th className="py-2 px-1.5 text-right">RN</th>
                      <th className="py-2 pl-2 w-[20%]">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100/60 text-[10px]">
                    {reservationTeamRows.map((member) => {
                      const barPct = Math.min(100, (member.totalValue / maxTeamValue) * 100);
                      const slaGood = member.slaPct >= 95;
                      return (
                        <tr key={member.name} className="hover:bg-zinc-200/40 transition-colors">
                          <td className="py-2 pr-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[8.5px] font-semibold flex items-center justify-center shrink-0">
                                {initialsOf(member.name)}
                              </span>
                              <span className="font-medium text-zinc-900">{member.name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-1 text-center text-zinc-700 tabular-nums">
                            {member.openTasks}
                          </td>
                          <td
                            className={`py-2 px-1 text-center font-semibold tabular-nums ${
                              member.overdue > 0 ? 'text-[#800020]' : 'text-zinc-400'
                            }`}
                          >
                            {member.overdue}
                          </td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">
                            <span
                              className={`text-[8.5px] font-semibold px-1.5 py-0.5 rounded tabular-nums ${
                                slaGood
                                  ? 'bg-[#ecfdf5] text-[#14532d]'
                                  : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              {member.slaAvg} · {member.slaPct}%
                            </span>
                          </td>
                          <td className="py-2 px-1.5 text-right text-zinc-700 tabular-nums">
                            {fmtCompactUsd(member.pendingVal)}
                          </td>
                          <td className="py-2 px-1.5 text-right font-medium text-zinc-900 tabular-nums">
                            {fmtCompactUsd(member.confirmedVal)}
                          </td>
                          <td className="py-2 px-1.5 text-right text-zinc-600 tabular-nums">
                            {member.roomNights}
                          </td>
                          <td className="py-2 pl-2">
                            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden flex">
                              <div
                                className="h-full bg-zinc-900"
                                style={{
                                  width: `${
                                    (member.confirmedVal / Math.max(1, member.totalValue)) *
                                    barPct
                                  }%`,
                                }}
                                title={`Confirmed: ${fmtCompactUsd(member.confirmedVal)}`}
                              />
                              <div
                                className="h-full bg-zinc-400"
                                style={{
                                  width: `${
                                    (member.pendingVal / Math.max(1, member.totalValue)) *
                                    barPct
                                  }%`,
                                }}
                                title={`Pending: ${fmtCompactUsd(member.pendingVal)}`}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
