// components/BackButton.tsx
import React from 'react';
import { router } from '@inertiajs/react';

export default function BackButton({ label = 'Back' }: { label?: string }) {
    return (
        <button
            type="button"
            onClick={() => router.visit(document.referrer || '/')}
            className="inline-flex items-center rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
        >
            ← {label}
        </button>
    );
}
