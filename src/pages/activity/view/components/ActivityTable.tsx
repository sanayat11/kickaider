import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from '../ActivityPage.module.scss';
import { Avatar } from '@/shared/ui/avatar/view/Avatar';
import { TimeBar } from '@/shared/ui/timeBar/view/TimeBar';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import type { Employee, ActivityBlock } from '@/shared/api/mock/activity.mock';
import type { TimeBarSegmentTone } from '@/shared/ui/timeBar/types/TimeBar';
import { ActivityDetailsPopup } from './ActivityDetailsPopup';

const stateToToneMap: Record<string, TimeBarSegmentTone> = {
  productive: 'success',
  unproductive: 'danger',
  idle: 'warning',
  nodata: 'primary',
  uncategorized: 'neutral',
  neutral: 'neutral'
};

interface ActivityTableProps {
  employees: Employee[];
  date: string;
  loading: boolean;
  scale: string;
}

export const ActivityTable: FC<ActivityTableProps> = ({ employees, date, loading, scale }) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  if (loading) {
    return <div className={styles.loader}><Typography variant="body1">Загрузка...</Typography></div>;
  }

  const getTimeBlocks = (blocks: ActivityBlock[]) => {
    return blocks.map((b, i) => {
      const [sh, sm] = b.start.split(':').map(Number);
      const [eh, em] = b.end.split(':').map(Number);
      const duration = (eh * 60 + em) - (sh * 60 + sm);

      return {
        id: `${b.start}-${i}`,
        value: duration,
        tone: stateToToneMap[b.state] || 'neutral'
      };
    });
  };

  const allDayLabels = ['00:00', '06:00', '12:00', '18:00', '23:59'];
  const workTimeLabels = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const labelsToUse = scale === 'allDay' ? allDayLabels : workTimeLabels;

  const handleSegmentClick = (empId: string) => {
    setSelectedEmpId(prev => prev === empId ? null : empId);
  };

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
                  <div className={styles.axis}>
                     {labelsToUse.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
            </th>
            <th>Общее время</th>
            <th>Скриншоты</th>
          </tr>
        </thead>
        <tbody>
          {employees.slice(0, 10).map((emp) => (
            <tr key={emp.id} style={{ position: 'relative' }}>
              <td>
                <Link to={`/activity/${emp.id}?date=${date}`} className={styles.empLink}>
                  <Avatar initials={emp.fullName[0]} size="md" status={emp.id === 'emp-1' ? 'online' : 'none'} />
                  <div className={styles.empInfo}>
                    <Typography variant="body2" className={styles.name}>{emp.fullName}</Typography>
                    <Typography variant="caption" className={styles.desktop}>{emp.hostname}</Typography>
                  </div>
                </Link>
              </td>
              <td className={styles.mutedText}>{emp.department}</td>
              <td className={styles.mutedText}>{date.split('-').reverse().join('.')}</td>
              <td className={styles.timelineCell}>
                <div style={{ position: 'relative' }}>
                  <TimeBar
                    height="sm"
                    segments={getTimeBlocks(emp.timeline)}
                    onSegmentClick={() => handleSegmentClick(emp.id)}
                  />

                  {selectedEmpId === emp.id && (
                    <ActivityDetailsPopup 
                      employee={emp} 
                      date={date} 
                      onClose={() => setSelectedEmpId(null)}
                      style={{ left: '10%' }}
                    />
                  )}
                </div>
              </td>
              <td className={styles.mutedText}>08:15:00</td>
              <td>
                <div 
                  className={styles.screenshotThumb} 
                  style={{ backgroundImage: `url(/src/shared/assets/images/imgBoost2.png)` }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
