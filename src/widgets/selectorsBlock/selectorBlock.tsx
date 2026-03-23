import { useState } from 'react';
import { SegmentedControl } from '@/shared/ui/segmentedControl/view/SegmentedControl';
import styles from './selectorBlock.module.scss';

export const SelectorExamples = () => {
  const [analytics, setAnalytics] = useState('time');
  const [period, setPeriod] = useState('all-days');
  const [topTabs, setTopTabs] = useState('detailed');
  const [mode, setMode] = useState('day');

  return (
    <div className={styles.wrapper}>
      <SegmentedControl
        value={analytics}
        onChange={setAnalytics}
        options={[
          { value: 'time', label: 'Время' },
          { value: 'efficiency', label: 'Эффективность' },
          { value: 'analysis', label: 'Анализ' },
        ]}
        className={styles.longControl}
      />

      <div className={styles.stack}>
        <SegmentedControl
          value={period}
          onChange={setPeriod}
          options={[
            { value: 'all-days', label: 'Все дни' },
            { value: 'work-time', label: 'Рабочее время' },
            { value: 'group-time', label: 'Групповое время' },
          ]}
          className={styles.mediumControl}
        />

        <SegmentedControl
          value="productive"
          onChange={() => {}}
          options={[
            { value: 'work', label: 'Рабочее время' },
            { value: 'idle', label: 'Рабочее время' },
            { value: 'productive', label: 'Продуктивное время' },
          ]}
          className={styles.mediumControl}
        />
      </div>

      <SegmentedControl
        value={topTabs}
        onChange={setTopTabs}
        options={[
          { value: 'detailed', label: 'Подробный год' },
          { value: 'summary', label: 'Сокращенный год' },
        ]}
        className={styles.shortControl}
      />

      <SegmentedControl
        size="small"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'month', label: 'Month' },
        ]}
        className={styles.tinyControl}
      />
    </div>
  );
};