export const formatDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp));
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
