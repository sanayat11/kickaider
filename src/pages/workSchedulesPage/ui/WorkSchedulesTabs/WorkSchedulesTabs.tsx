import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedControl } from '@/shared/ui/segmentedControl/view/SegmentedControl';
import type { WorkSchedulesTab } from '../../model/types';
import styles from './WorkSchedulesTabs.module.scss';

type WorkSchedulesTabsProps = {
    activeTab: WorkSchedulesTab;
    onChange: (tab: WorkSchedulesTab) => void;
};

export const WorkSchedulesTabs: FC<WorkSchedulesTabsProps> = ({ activeTab, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.tabsContainer}>
            <SegmentedControl
                fullWidth
                size='medium'
                value={activeTab}
                onChange={(val) => onChange(val as WorkSchedulesTab)}
                className={styles.segmentedControl}
                options={[
                    { label: t('settings.schedules.tabs.company'), value: 'company' },
                    { label: t('settings.schedules.tabs.departments'), value: 'departments' },
                    { label: t('settings.schedules.tabs.employees'), value: 'employees' },
                ]}
            />
        </div>
    );
};
