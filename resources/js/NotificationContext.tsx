// resources/js/NotificationContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext<Record<string, number>>({});

interface NotificationProviderProps {
  children: React.ReactNode;
  initial: Record<string, any>;
}

export function NotificationProvider({ children, initial }: NotificationProviderProps) {
  const [counters, set] = useState(initial);

  useEffect(() => {
    if (!window.Echo || !initial) return;

    window.Echo.private(`approvals.${initial.userId}`)
      .listen('ApprovalCountersUpdated', (e: any) => set(e.counters));

    return () => window.Echo.leave(`approvals.${initial.userId}`);
  }, []);

  return <Ctx.Provider value={counters}>{children}</Ctx.Provider>;
}

export const useCounters = () => useContext(Ctx);
