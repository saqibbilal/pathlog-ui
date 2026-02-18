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
    // Select a random message each time it shows
    const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 right-8 z-[100]"
                >
                    <div className="bg-white border-slate-100 text-slate-600 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border">
                        <div className="bg-emerald-500 h-2 w-2 rounded-full animate-pulse" />
                        <p className="font-medium text-sm tracking-wide">
                            {randomMessage}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};