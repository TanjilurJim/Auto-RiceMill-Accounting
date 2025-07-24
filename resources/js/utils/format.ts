// resources/js/utils/format.ts

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB'); // e.g. 24-07-2025

export const fmtMoney = (n: number | string) =>
  new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 }).format(Number(n));
