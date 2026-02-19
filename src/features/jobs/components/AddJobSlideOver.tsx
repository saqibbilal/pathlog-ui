import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobApi } from '../services/jobApi';
import type { CreateJobRequest, JobApplication } from '@/features/jobs/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jobToEdit?: JobApplication | null;
}

export const AddJobSlideOver = ({ isOpen, onClose, onSuccess, jobToEdit }: Props) => {
    const [loading, setLoading] = useState(false);
    const isEditMode = !!jobToEdit;

    const [formData, setFormData] = useState<CreateJobRequest>({
        company_name: '',
        job_title: '',
        status: 'applied',
        applied_at: new Date().toISOString().split('T')[0],
        job_description_url: '',
        job_description_text: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (jobToEdit) {
                setFormData({
                    company_name: jobToEdit.company_name,
                    job_title: jobToEdit.job_title,
                    status: jobToEdit.status,
                    applied_at: jobToEdit.applied_at,
                    job_description_url: jobToEdit.job_description_url || '',
                    job_description_text: jobToEdit.job_description_text || '',
                });
            } else {
                setFormData({
                    company_name: '',
                    job_title: '',
                    status: 'applied',
                    applied_at: new Date().toISOString().split('T')[0],
                    job_description_url: '',
                    job_description_text: '',
                });
            }
        }
    }, [jobToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode && jobToEdit) {
                await jobApi.updateJob(jobToEdit.id, formData);
            } else {
                await jobApi.createJob(formData);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save job:", error);
        } finally {
            setLoading(false);
        }
    };

    // Reusable styling constant to keep JSX clean
    const inputClasses = "w-full rounded-lg border border-indigo-200 text-slate-800 p-2.5 placeholder:text-slate-400 focus:bg-indigo-50/25 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-slate-500/20 focus:shadow-md transition-all duration-200 hover:bg-slate-50";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-screen max-w-md"
                        >
                            <div className="flex h-full flex-col bg-white shadow-2xl">
                                <div className="bg-slate-50 px-6 py-6 border-b border-slate-100 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{isEditMode ? 'Edit Application' : 'Add New Application'}</h2>
                                        <p className="mt-1 text-sm text-slate-500">Enter the details of your job hunt lead.</p>
                                    </div>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">✕</button>
                                </div>

                                <div className="relative flex-1 overflow-y-auto p-6">
                                    <form id="job-form" onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                                            <input
                                                value={formData.company_name}
                                                onChange={e => setFormData({...formData, company_name: e.target.value})}
                                                required className={inputClasses} placeholder="e.g. Google, Shopify..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                                            <input
                                                value={formData.job_title}
                                                onChange={e => setFormData({...formData, job_title: e.target.value})}
                                                required className={inputClasses} placeholder="e.g. Full Stack Developer"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-3">Current Status</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(['applied', 'interviewing', 'offered', 'rejected'] as const).map((s) => (
                                                    <label key={s} className="relative cursor-pointer">
                                                        <input type="radio" checked={formData.status === s} onChange={() => setFormData({...formData, status: s})} className="peer sr-only" />
                                                        <div className="px-4 py-3 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 text-center transition-all peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 hover:bg-slate-50">
                                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Job URL</label>
                                            <input
                                                value={formData.job_description_url}
                                                onChange={e => setFormData({...formData, job_description_url: e.target.value})}
                                                type="url" className={inputClasses} placeholder="https://linkedin.com/jobs/..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Job Description (Text)</label>
                                            <textarea
                                                value={formData.job_description_text}
                                                onChange={e => setFormData({...formData, job_description_text: e.target.value})}
                                                rows={5} className={inputClasses} placeholder="Paste requirements here..."
                                            />
                                        </div>
                                    </form>
                                </div>

                                <div className="border-t border-slate-100 bg-slate-50 p-6 flex justify-end gap-3">
                                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900">Cancel</button>
                                    <button form="job-form" disabled={loading} className="bg-slate-900 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-slate-800 shadow-md disabled:bg-slate-400 transition-all active:scale-95">
                                        {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save Application')}
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