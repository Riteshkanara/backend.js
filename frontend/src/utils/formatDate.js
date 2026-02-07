import { formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => {
    if(!date)
        return "Long Ago" // If date is missing don't crash it.
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatFullDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};