import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';

export const GlobalToast = () => {
    const { isVisible, message, type, hideToast } = useToastStore();

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                hideToast();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, hideToast]);

    const isError = type === 'error';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 right-8 z-[100]"
                >
                    <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 ${isError
                            ? 'bg-surface border-rose-500 text-text-main'
                            : 'bg-brand border-brand-hover text-white'
                        }`}>
                        <div className={`h-2 w-2 rounded-full animate-pulse ${isError ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                            }`} />
                        <p className="font-bold text-sm tracking-tight">
                            {message}
                        </p>
                        <button
                            onClick={hideToast}
                            className={`ml-2 p-1 rounded-full transition-colors opacity-60 hover:opacity-100 ${isError ? 'hover:bg-rose-500/10' : 'hover:bg-black/10'
                                }`}
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
