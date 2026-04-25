export const getFormattedDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return '';
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const localDate = new Date(year, month, day);
  return `${localDate.getDate().toString().padStart(2, '0')} ${localDate.toLocaleString('en-US', { month: 'long' })} ${localDate.getFullYear()}`;
};

export const getPreviousYearDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return '';
  const year = parseInt(parts[0], 10) - 1; // Subtract 1 year
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const localDate = new Date(year, month, day);
  return `${localDate.getDate().toString().padStart(2, '0')} ${localDate.toLocaleString('en-US', { month: 'long' })} ${localDate.getFullYear()}`;
};

export const getPreviousDayDate = (dateString: string | undefined): string => {
  // Sometimes previous year reporting date is used instead of start date
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return '';
  const localDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  localDate.setDate(localDate.getDate() - 1);
  return `${localDate.getDate().toString().padStart(2, '0')} ${localDate.toLocaleString('en-US', { month: 'long' })} ${localDate.getFullYear()}`;
};
