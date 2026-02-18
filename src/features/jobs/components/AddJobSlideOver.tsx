import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobApi } from '../services/jobApi';
import type { CreateJobRequest } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddJobSlideOver = ({ isOpen, onClose, onSuccess }: Props) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Construct the request object matching your CreateJobRequest type
        const payload: any = {
            company_name: formData.get('company_name'),
            job_title: formData.get('job_title'),
            status: formData.get('status'),
            job_description_url: formData.get('job_description_url'),
            job_description_text: formData.get('job_description_text'),
            // Laravel likely expects a date. We'll default to today if empty.
            applied_at: new Date().toISOString().split('T')[0]
        };

        try {
            await jobApi.createJob(payload);
            onSuccess();
        } catch (error) {
            console.error("Failed to save job:", error);
            // Hint: Check the Network tab in DevTools to see Laravel validation errors
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-screen max-w-md"
                        >
                            <div className="flex h-full flex-col bg-white shadow-2xl">
                                {/* Header */}
                                <div className="bg-slate-50 px-6 py-6 border-b border-slate-100 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Add New Application</h2>
                                        <p className="mt-1 text-sm text-slate-500">Enter the details of your new job hunt lead.</p>
                                    </div>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
                                        <span className="text-2xl">✕</span>
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className="relative flex-1 overflow-y-auto p-6">
                                    <form id="add-job-form" onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                                            <input
                                                name="company_name"
                                                required
                                                type="text"
                                                className="w-full rounded-lg border border-indigo-200 text-slate-800 pl-2 placeholder:text-slate-400 focus:bg-indigo-50/25 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-slate-500/20 focus:shadow-md transition-all duration-200 hover:bg-slate-50"
                                                placeholder="e.g. Google, Shopify..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                                            <input
                                                name="job_title"
                                                required
                                                type="text"
                                                className="w-full rounded-lg border border-indigo-200 text-slate-800 pl-2 placeholder:text-slate-400 focus:bg-indigo-50/25 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-slate-500/20 focus:shadow-md transition-all duration-200 hover:bg-slate-50"
                                                placeholder="e.g. Full Stack Developer"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-3">Current Status</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(['applied', 'interviewing', 'offered', 'rejected'] as const).map((status) => (
                                                    <label key={status} className="relative cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            value={status}
                                                            defaultChecked={status === 'applied'}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="px-4 py-3 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 text-center transition-all
          peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700
          hover:bg-slate-50">
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Job URL</label>
                                            <input
                                                name="job_description_url"
                                                type="url"
                                                className="w-full rounded-lg border border-indigo-200 text-slate-800 pl-2 placeholder:text-slate-400 focus:bg-indigo-50/25 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-slate-500/20 focus:shadow-md transition-all duration-200 hover:bg-slate-50"
                                                placeholder="https://linkedin.com/jobs/..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Job Description (Text)</label>
                                            <textarea
                                                name="job_description_text" // Added name matching Laravel DB
                                                rows={4}
                                                className="w-full rounded-lg border border-indigo-200 text-slate-800 pl-2 placeholder:text-slate-400 focus:bg-indigo-50/25 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-slate-500/20 focus:shadow-md transition-all duration-200 hover:bg-slate-50"
                                                placeholder="Paste the requirements here..."
                                            />
                                        </div>
                                    </form>
                                </div>

                                {/* Footer Actions */}
                                <div className="border-t border-slate-100 bg-slate-50 p-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        form="add-job-form"
                                        disabled={loading}
                                        type="submit"
                                        className="bg-slate-900 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md hover:shadow-lg disabled:bg-slate-400"
                                    >
                                        {loading ? 'Saving...' : 'Save Application'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};