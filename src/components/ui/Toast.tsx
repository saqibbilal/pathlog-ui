import { motion, AnimatePresence } from 'framer-motion';

const encouragements = [
    "One step closer to the dream! 🚀",
    "Nice work! Your future self is thanking you.",
    "Application sent. You're doing great!",
    "Another seed planted. Let it grow! 🌱",
    "Consistency is key. Keep that momentum!",
];

interface Props {
    isVisible: boolean;
    message?: string;
}

export const SuccessToast = ({ isVisible }: Props) => {
    const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 right-8 z-[100]"
                >
                    <div className="bg-surface border-brand/20 text-text-main px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2">
                        <div className="bg-brand h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--brand-primary),0.5)]" />
                        <p className="font-bold text-sm tracking-tight">
                            {randomMessage}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};