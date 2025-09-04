import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

declare global {
  interface Window {
    Echo?: any;
  }
}


/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */
type CounterMap = Record<string, number>;

const CounterContext = createContext<CounterMap>({});

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */
interface Props {
  /** Counters sent from Laravel in the initial Inertia response */
  initialCounters: CounterMap;
  /** Current user id (needed for Echo channel name)               */
  userId: number | null;
  children: ReactNode;
}

export function NotificationProvider({
  initialCounters,
  userId,
  children,
}: Props) {
  const [counters, setCounters] = useState<CounterMap>(initialCounters);

  /* Subscribe to Laravel Echo only once --------------------------- */
  useEffect(() => {
    if (!userId || !window.Echo) return;

    /* Private channel: approvals.{userId} ------------------------- */
    const channelName = `approvals.${userId}`;
    window.Echo.private(channelName).listen(
      'ApprovalCountersUpdated',
      (e: any) => {
        // e.counters has the fresh numbers
        setCounters(e.counters);
      }
    );

    /* Clean up when React unmounts -------------------------------- */
    return () => {
      window.Echo.leave(channelName);
    };
  }, [userId]);

  return (
    <CounterContext.Provider value={counters}>
      {children}
    </CounterContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook for any component that needs the numbers                     */
/* ------------------------------------------------------------------ */
export const useCounters = () => useContext(CounterContext);
