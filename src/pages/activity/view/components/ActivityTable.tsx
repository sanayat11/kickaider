import { useState } from 'react';
import type { FC, MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from '../ActivityPage.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { ActivityDetailsPopup } from './ActivityDetailsPopup';
import { TimeBar } from '@/shared/ui/timeBar/view/TimeBar';
import type {
  TimeBarSegment,
  TimeBarSegmentTone,
} from '@/shared/ui/timeBar/types/TimeBar';

export type ActivityBlockState =
  | 'productive'
  | 'neutral'
  | 'unproductive'
  | 'uncategorized'
  | 'idle'
  | 'nodata';

export type ActivityBlock = {
  start: string;
  end: string;
  state: ActivityBlockState;
  appName?: string;
  windowTitle?: string;
};

export type ActivityEmployeeRow = {
  id: string;
  employeeId: number;
  fullName: string;
  hostname: string;
  department: string;
  timeline: ActivityBlock[];
  totalActiveTime: string;
  totalIdleTime: string;
  latestScreenshotUrl?: string;
  searchText: string;
};

interface ActivityTableProps {
  employees: ActivityEmployeeRow[];
  date: string;
  loading: boolean;
  scale: string;
}

const stateToToneMap: Record<ActivityBlockState, TimeBarSegmentTone> = {
  productive: 'success',
  unproductive: 'danger',
  neutral: 'primary',
  idle: 'warning',
  nodata: 'primary',
  uncategorized: 'neutral',
};

const parseTimeToMinutes = (time: string) => {
  const [hours = '0', minutes = '0'] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
};

const getScaleConfig = (scale: string) => {
  if (scale === 'workTime') {
    return {
      startMinute: 9 * 60,
      endMinute: 18 * 60,
      labels: [
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
      ],
    };
  }

  return {
    startMinute: 0,
    endMinute: 24 * 60,
    labels: ['00:00', '06:00', '12:00', '18:00', '23:59'],
  };
};

const clipBlockToScale = (block: ActivityBlock, scale: string) => {
  const { startMinute, endMinute } = getScaleConfig(scale);

  const rawStart = parseTimeToMinutes(block.start);
  const rawEnd = parseTimeToMinutes(block.end);

  const clippedStart = Math.max(rawStart, startMinute);
  const clippedEnd = Math.min(rawEnd, endMinute);

  if (clippedEnd <= clippedStart) {
    return null;
  }

  return {
    ...block,
    clippedStart,
    clippedEnd,
    durationMinutes: clippedEnd - clippedStart,
  };
};

const buildTimeBarSegments = (
  blocks: ActivityBlock[],
  scale: string,
): TimeBarSegment[] => {
  const clippedBlocks = blocks
    .map((block) => clipBlockToScale(block, scale))
    .filter(Boolean) as Array<
    ActivityBlock & {
      clippedStart: number;
      clippedEnd: number;
      durationMinutes: number;
    }
  >;

  if (clippedBlocks.length === 0) {
    return [
      {
        id: 'empty',
        value: 100,
        tone: 'neutral',
        title: 'Нет данных',
      },
    ];
  }

  return clippedBlocks.map((block, index) => ({
    id: `${block.start}-${block.end}-${index}`,
    value: Math.max(block.durationMinutes, 1),
    tone: stateToToneMap[block.state] ?? 'neutral',
    title:
      block.appName || block.windowTitle
        ? `${block.start}–${block.end} ${block.appName || ''} ${block.windowTitle || ''}`.trim()
        : `${block.start}–${block.end}`,
  }));
};

export const ActivityTable: FC<ActivityTableProps> = ({
  employees,
  date,
  loading,
  scale,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [popupCoords, setPopupCoords] = useState<{ top: number; left: number } | null>(null);

  const { labels } = getScaleConfig(scale);

  const handleBarClick = (
    empId: string,
    event?: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (selectedEmpId === empId) {
      setSelectedEmpId(null);
      setPopupCoords(null);
      return;
    }

    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPopupCoords({
        top: rect.top + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }

    setSelectedEmpId(empId);
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <Typography variant="body1">Загрузка...</Typography>
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className={styles.loader}>
        <Typography variant="body1">Нет данных</Typography>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Отдел</th>
            <th>Период</th>
            <th className={styles.timelineHeaderCell}>
              <div className={styles.axisWrapper}>
                <span>Общая активность</span>
              </div>
            </th>
            <th>Общее время</th>
            <th>Скриншоты</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => {
            const segments = buildTimeBarSegments(emp.timeline, scale);

            return (
              <tr key={emp.id} style={{ position: 'relative' }}>
                <td>
                  <Link
                    to={`/activity/${emp.employeeId}?date=${date}`}
                    className={styles.empLink}
                  >
                    <div className={styles.empInfo}>
                      <Typography variant="body2" className={styles.nameText}>
                        {emp.fullName}
                      </Typography>
                      <Typography variant="caption" className={styles.hostText}>
                        {emp.hostname}
                      </Typography>
                    </div>
                  </Link>
                </td>

                <td className={styles.mutedText}>{emp.department}</td>
                <td className={styles.mutedText}>{date.split('-').reverse().join('.')}</td>

                <td className={styles.timelineCell}>
                  <div
                    className={styles.timelineInteractive}
                    onClick={(event) => handleBarClick(emp.id, event)}
                  >
                    <TimeBar
                      className={styles.activityTimelineBar}
                      height="sm"
                      labels={labels}
                      segments={segments}
                    />
                  </div>

                  {selectedEmpId === emp.id && popupCoords && (
                    <ActivityDetailsPopup
                      employee={emp}
                      date={date}
                      onClose={() => {
                        setSelectedEmpId(null);
                        setPopupCoords(null);
                      }}
                      coords={popupCoords}
                    />
                  )}
                </td>

                <td className={styles.mutedText}>{emp.totalActiveTime}</td>

                <td>
                  {emp.latestScreenshotUrl ? (
                    <div
                      className={styles.screenshotThumb}
                      style={{ backgroundImage: `url(${emp.latestScreenshotUrl})` }}
                    />
                  ) : (
                    <div className={styles.mutedText}>—</div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};