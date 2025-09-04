// resources/js/lib/http.ts
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
if (token?.content) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// (optional) handle expired sessions gracefully
axios.interceptors.response.use(
    (r) => r,
    (err) => {
        if (err?.response?.status === 419) {
            window.location.reload();
        }
        return Promise.reject(err);
    },
);

export default axios; // export if you want to import this instance directly
