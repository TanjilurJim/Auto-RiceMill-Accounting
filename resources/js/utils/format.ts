// resources/js/utils/format.ts
export const fmtDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString('en-GB'); // e.g. 24/07/2025

export const fmtDateTime = (iso: string | Date) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }); // e.g. 24/07/2025, 16:30

export const fmtMoney = (n: number | string) =>
  new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 }).format(Number(n));
