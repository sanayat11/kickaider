import { CalendarToolbar } from '../components/CalendarToolbar';
import { CalendarGrid } from '../components/CalendarGrid';
import { AssignEventModal } from '../components/AssignEventModal';
import { useProductionCalendar } from '../model/useCalendar';

import styles from './CalendarBlock.module.scss';
import { Typography } from '@/shared/ui';

export const ProductionCalendar = () => {
  const calendar = useProductionCalendar();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Typography variant='h1' weight='bold' context='dashboard'>Производственный календарь</Typography>
          <Typography variant='h4' weight='regular' className={styles.subtitle}>
            Общий аналитический обзор по компании или сотруднику
          </Typography>
        </div>
      </div>

      <div className={styles.calendarCard}>
        <CalendarToolbar
        viewMode={calendar.viewMode}
        search={calendar.search}
        selectedEmployeeId={calendar.selectedEmployeeId}
        monthLabel={calendar.monthLabel}
        statusOptions={calendar.statusOptions}
        employeeOptions={calendar.employeeOptions}
        setSearch={calendar.setSearch}
        setViewMode={calendar.setViewMode}
        setSelectedEmployeeId={calendar.setSelectedEmployeeId}
        goPrevMonth={calendar.goPrevMonth}
        goNextMonth={calendar.goNextMonth}
      />

        <CalendarGrid
          viewMode={calendar.viewMode}
          days={calendar.days}
          statusMap={calendar.statusMap}
          activePopover={calendar.activePopover}
          selectedEmployeeId={calendar.selectedEmployeeId}
          openDayActions={calendar.openDayActions}
          setDayStatus={calendar.setDayStatus}
          statusOptions={calendar.statusOptions}
          monthItems={calendar.monthItems}
          selectMonth={calendar.selectMonth}
          currentDate={calendar.currentDate}
        />
      </div>

      <AssignEventModal
        open={calendar.isAssignEventModalOpen}
        onClose={() => calendar.setIsAssignEventModalOpen(false)}
        onSubmit={calendar.handleAddEvent}
        eventRange={calendar.eventRange}
        setEventRange={calendar.setEventRange}
        statusOptions={calendar.statusOptions}
        employeeOptions={calendar.employeeOptions}
      />
    </div>
  );
};