import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('ja');
dayjs.extend(relativeTime);

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date || !dayjs(date).isValid()) {
    return '-';
  }
  return dayjs(date).format('YYYY年MM月DD日');
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date || !dayjs(date).isValid()) {
    return '-';
  }
  return dayjs(date).format('YYYY年MM月DD日 HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const isThisWeek = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'week');
};

export const isThisMonth = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'month');
};