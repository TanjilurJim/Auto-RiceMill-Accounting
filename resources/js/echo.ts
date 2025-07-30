// resources/js/echo.ts
import Echo   from 'laravel-echo';
import Pusher from 'pusher-js';
import axios  from 'axios';             // ← add

declare global {
  interface Window {
    axios: typeof axios;
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}
/* ---------- Axios global setup ---------- */
window.axios = axios;
window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const token = document
  .querySelector('meta[name="csrf-token"]')!
  .getAttribute('content');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

/* ---------- Echo / Pusher ---------- */
window.Pusher = Pusher;
window.Pusher.logToConsole = true;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'ap2',
  forceTLS: true,
  authorizer: (channel) => ({
    authorize: (socketId, callback) => {
      axios.post('/broadcasting/auth', {
        socket_id: socketId,
        channel_name: channel.name
      })
      .then(response => callback(false, response.data))
      .catch(error => callback(true, error));
    }
  })
});