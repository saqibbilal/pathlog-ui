import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    type?: 'danger' | 'info';
}

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", type = 'danger' }: Props) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-surface border border-surface-border rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
                    >
                        <div className="p-8">
                            <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">{title}</h3>
                            <p className="text-text-main opacity-60 text-sm leading-relaxed">{message}</p>
                        </div>
                        <div className="bg-workspace p-4 px-6 flex justify-end gap-3 border-t border-surface-border">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm font-bold text-text-main opacity-50 hover:opacity-100 transition-opacity"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md active:scale-95 ${
                                    type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand hover:bg-brand-hover'
                                }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};