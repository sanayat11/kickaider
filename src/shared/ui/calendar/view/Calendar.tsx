import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './Calendar.module.scss';

export const Calendar = () => {
  const [selected, setSelected] = useState<Date | undefined>();

  return (
    <div className={styles.wrapper}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        showOutsideDays
        fixedWeeks
        weekStartsOn={1}
        className={styles.dayPicker}
        classNames={{
          root: styles.calendar,
          months: styles.months,
          month: styles.month,
          caption: styles.header,
          caption_label: styles.captionLabel,
          nav: styles.nav,
          nav_button: styles.navBtn,
          table: styles.table,
          head: styles.head,
          head_row: styles.week,
          head_cell: styles.weekday,
          tbody: styles.body,
          row: styles.row,
          cell: styles.cell,
          day: styles.day,
          day_selected: styles.daySelected,
          day_today: styles.dayToday,
          day_outside: styles.dayOutside,
          day_disabled: styles.dayDisabled,
        }}
      />
    </div>
  );
};