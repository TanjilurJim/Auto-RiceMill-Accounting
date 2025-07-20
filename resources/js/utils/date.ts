import dayjs from 'dayjs';           // ⬅ I recommend dayjs over moment
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

/* Format an ISO date (YYYY-MM-DD) to DD/MM/YYYY for humans */
export const toDisplay = (iso: string | Date | null) =>
  iso ? dayjs(iso).format('DD/MM/YYYY') : '';

/* Parse DD/MM/YYYY from a form field to ISO for <input type="date"> or API */
export const toISO = (display: string | null) =>
  display ? dayjs(display, 'DD/MM/YYYY').format('YYYY-MM-DD') : '';
