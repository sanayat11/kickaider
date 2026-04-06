import { useState, useRef, useEffect, type FC, useMemo } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';
import { Calendar } from '@/shared/ui/calendar/view/Calendar';
import { CalendarIcon } from '@/shared/assets/icons/IconCalendar';
import { ArrowDownIcon } from '@/shared/assets/icons/IconArrowDown';
import classNames from 'classnames';
import type { CalendarStatusType } from '@/shared/api/mock/productionCalendar.mock';

import styles from '../view/CalendarBlock.module.scss';

interface AssignEventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  eventRange: {
    from: string;
    to: string;
    status: CalendarStatusType;
  };
  setEventRange: (range: any) => void;
  statusOptions: Array<{ label: string; value: string; tone: string }>;
}

const formatDateToDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
};

const dateToISO = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const AssignEventModal: FC<AssignEventModalProps> = ({
  open,
  onClose,
  onSubmit,
  eventRange,
  setEventRange,
  statusOptions,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<'from' | 'to' | null>(null);
  
  const statusRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const selectedStatus = statusOptions.find((opt) => opt.value === eventRange.status);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (statusRef.current && !statusRef.current.contains(target)) {
        setIsStatusOpen(false);
      }
      if (fromRef.current && !fromRef.current.contains(target)) {
        if (activePicker === 'from') setActivePicker(null);
      }
      if (toRef.current && !toRef.current.contains(target)) {
        if (activePicker === 'to') setActivePicker(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePicker]);

  const fromDateObj = useMemo(() => new Date(eventRange.from), [eventRange.from]);
  const toDateObj = useMemo(() => new Date(eventRange.to), [eventRange.to]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Назначить мероприятие"
      size="md"
      className={styles.modalCustom}
    >
      <div className={styles.modalContent}>
        <div className={styles.rangeRow}>
          <div className={styles.pickerWrapper} ref={fromRef}>
            <div 
              className={classNames(styles.dateField, { [styles.active]: activePicker === 'from' })}
              onClick={() => setActivePicker(activePicker === 'from' ? null : 'from')}
            >
              <span className={styles.dateValue}>{formatDateToDisplay(eventRange.from)}</span>
              <CalendarIcon color="#64748b" />
            </div>
            {activePicker === 'from' && (
              <div className={styles.pickerPopover}>
                <Calendar 
                  value={fromDateObj}
                  onSelectDate={(date) => {
                    setEventRange({ ...eventRange, from: dateToISO(date) });
                    setActivePicker(null);
                  }}
                />
              </div>
            )}
          </div>

          <span className={styles.separator}>-</span>

          {/* TO PICKER */}
          <div className={styles.pickerWrapper} ref={toRef}>
            <div 
              className={classNames(styles.dateField, { [styles.active]: activePicker === 'to' })}
              onClick={() => setActivePicker(activePicker === 'to' ? null : 'to')}
            >
              <span className={styles.dateValue}>{formatDateToDisplay(eventRange.to)}</span>
              <CalendarIcon color="#64748b" />
            </div>
            {activePicker === 'to' && (
              <div className={styles.pickerPopover}>
                <Calendar 
                  value={toDateObj}
                  onSelectDate={(date) => {
                    setEventRange({ ...eventRange, to: dateToISO(date) });
                    setActivePicker(null);
                  }}
                />
              </div>
            )}
          </div>
          
          {/* STATUS SELECT */}
          <div className={styles.selectWrapper} ref={statusRef}>
            <div 
              className={classNames(styles.customDropdownTrigger, { [styles.active]: isStatusOpen })}
              onClick={() => setIsStatusOpen(!isStatusOpen)}
            >
              {selectedStatus ? (
                <Chip tone={selectedStatus.tone as any} variant="filter" className={styles.triggerChip}>
                  {selectedStatus.label}
                </Chip>
              ) : (
                <Chip tone="blue" variant="filter" className={styles.triggerChip}>
                  Категории
                </Chip>
              )}
              <ArrowDownIcon className={styles.chevron} />
            </div>

            {isStatusOpen && (
              <div className={styles.customDropdownMenu}>
                <div className={styles.dropdownOption}>
                  <Chip tone="blue" variant="filter" className={styles.optionChip}>
                    Категории
                  </Chip>
                </div>
                {statusOptions.map((opt) => (
                  <div 
                    key={opt.value}
                    className={styles.dropdownOption}
                    onClick={() => {
                      setEventRange({ ...eventRange, status: opt.value as CalendarStatusType });
                      setIsStatusOpen(false);
                    }}
                  >
                    <Chip tone={opt.tone as any} variant="filter" className={styles.optionChip}>
                      {opt.label}
                    </Chip>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button onClick={onSubmit} className={styles.submitBtn}>
            Применить
          </Button>
          <Button variant="outline" onClick={onClose} className={styles.cancelBtn}>
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  );
};

