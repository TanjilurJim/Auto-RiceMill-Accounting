import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function FlashMessage() {
    const { flash } = usePage().props as { flash: { success?: string; error?: string } };
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash.success, flash.error]);

    const type = flash.success ? 'success' : 'error';
    const message = flash.success || flash.error;

    return (
        <AnimatePresence>
            {show && message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded px-4 py-2 text-white shadow-lg ${
                        type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                >
                    <span>{message}</span>
                    <button onClick={() => setShow(false)} className="hover:opacity-75 focus:outline-none">
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
