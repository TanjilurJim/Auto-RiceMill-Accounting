import '../css/app.css';
import './echo'; // Import Echo for real-time events
import axios from 'axios';

import '@/lib/http';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { NotificationProvider } from '@/providers/NotificationProvider';


const appName = 'Auto Rice MIll';

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // ───────────────────────────────────────────────
        // grab counters + userId that Laravel shared
        // (HandleInertiaRequests middleware step 4)
        // ───────────────────────────────────────────────
        const pageProps = props.initialPage.props as any;
        const initial = pageProps.counters ?? {};
        const currentUser = pageProps.auth?.user?.id ?? null;
             root.render(

      <NotificationProvider
        userId={currentUser}
        initialCounters={initial}
      >
        <App {...props} />
      </NotificationProvider>
     );
   },

   progress: { color: '#4B5563' },
 });

 initializeTheme();  