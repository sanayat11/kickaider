import { ArrowUpIcon, FilterIcon } from '@/shared/assets/icons';
import { ArrowDownIcon } from '@/shared/assets/icons/IconArrowDown';
import { ArrowLeftIcon } from '@/shared/assets/icons/IconArrowLeft';
import { ArrowRightIcon } from '@/shared/assets/icons/IconArrowRight';
import { CalendarIcon } from '@/shared/assets/icons/IconCalendar';
import { ClockIcon } from '@/shared/assets/icons/IconClock';
import { DocumentIcon } from '@/shared/assets/icons/IconDocument';
import { SearchIcon } from '@/shared/assets/icons/IconSearch';
import { SettingIcon } from '@/shared/assets/icons/IconSetting';
import type { FC } from 'react';

export const NotFoundPage: FC = () => {
  return (
    <>
      <h1>ОШИБКА 404</h1>
      <SearchIcon />
      <SettingIcon/>
      <CalendarIcon/>
      <DocumentIcon/>
      <ClockIcon/>
      <ArrowDownIcon/>
      <ArrowUpIcon/>
      <ArrowRightIcon/>
      <ArrowLeftIcon/>
      <FilterIcon/>
    </>
  );
};
