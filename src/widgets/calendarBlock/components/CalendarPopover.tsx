import classNames from 'classnames';
import styles from '../view/CalendarBlock.module.scss';
import { TrashIcon } from '@/shared/assets/icons/index';

interface CalendarPopoverProps {
  date: string;
  options: Array<{ label: string; value: string; icon?: any }>;
  onSelect: (value: string) => void;
  onReset: () => void;
}

export const CalendarPopover = ({ date, options, onSelect, onReset }: CalendarPopoverProps) => {
  return (
    <div className={styles.popover}>
      <div className={styles.popoverHeader}>{date}</div>

      <div className={styles.popoverList}>
        {options.map((item: { label: string; value: string; icon?: any }) => {
          const Icon = item.icon;

          return (
            <button 
              key={item.value} 
              onClick={() => onSelect(item.value)}
              className={styles.popoverAction}
            >
              {Icon && <Icon />}
              {item.label}
            </button>
          );
        })}

        <button 
          onClick={onReset} 
          className={classNames(styles.popoverAction, styles.resetAction)}
        >
          <TrashIcon />
          Сбросить
        </button>
      </div>
    </div>
  );
};