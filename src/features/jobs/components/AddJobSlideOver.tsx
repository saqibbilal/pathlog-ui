import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateJob, useUpdateJob } from '@/features/jobs/hooks/useJobs';
import type { CreateJobRequest, JobApplication } from '@/features/jobs/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jobToEdit?: JobApplication | null;
}

export const AddJobSlideOver = ({ isOpen, onClose, onSuccess, jobToEdit }: Props) => {
    const isEditMode = !!jobToEdit;

    const { mutateAsync: createJob, isPending: isCreating } = useCreateJob();
    const { mutateAsync: updateJob, isPending: isUpdating } = useUpdateJob();
    const loading = isCreating || isUpdating;

    const [formData, setFormData] = useState<CreateJobRequest>({
        company_name: '', job_title: '', status: 'applied',
        applied_at: new Date().toISOString().split('T')[0],
        job_description_url: '', job_description_text: '',
        contact_person: '', contact_person_email: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (jobToEdit) {
                setFormData({
                    company_name: jobToEdit.company_name, job_title: jobToEdit.job_title,
                    status: jobToEdit.status, applied_at: jobToEdit.applied_at,
                    job_description_url: jobToEdit.job_description_url || '',
                    job_description_text: jobToEdit.job_description_text || '',
                    contact_person: jobToEdit.contact?.name || '',
                    contact_person_email: jobToEdit.contact?.email || '',
                });
            } else {
                setFormData({
                    company_name: '', job_title: '', status: 'applied',
                    applied_at: new Date().toISOString().split('T')[0],
                    job_description_url: '', job_description_text: '',
                    contact_person: '', contact_person_email: '',
                });
            }
        }
    }, [jobToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && jobToEdit) { await updateJob({ id: jobToEdit.id, data: formData }); }
            else { await createJob(formData); }
            onSuccess();
        } catch (error) { console.error("Save failed", error); }
    };

    const inputClasses = "w-full rounded-xl border border-surface-border bg-surface text-text-main p-3 placeholder:opacity-30 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-screen max-w-md"
                        >
                            <div className="flex h-full flex-col bg-surface shadow-2xl border-l border-surface-border">
                                <div className="bg-workspace px-6 py-8 border-b border-surface-border flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-text-main">{isEditMode ? 'Edit Application' : 'Add New Application'}</h2>
                                        <p className="mt-1 text-xs text-text-main opacity-50">Log your job hunt progress details.</p>
                                    </div>
                                    <button onClick={onClose} className="text-text-main opacity-30 hover:opacity-100 p-2">✕</button>
                                </div>

                                <div className="relative flex-1 overflow-y-auto p-6">
                                    <form id="job-form" onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-2">Company Name</label>
                                            <input value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} required className={inputClasses} placeholder="Google, Shopify..." />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-2">Job Title</label>
                                            <input value={formData.job_title} onChange={e => setFormData({ ...formData, job_title: e.target.value })} required className={inputClasses} placeholder="Frontend Developer" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-3">Status</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(['applied', 'interviewing', 'offered', 'rejected'] as const).map((s) => (
                                                    <label key={s} className="relative cursor-pointer">
                                                        <input type="radio" checked={formData.status === s} onChange={() => setFormData({ ...formData, status: s })} className="peer sr-only" />
                                                        <div className="px-4 py-3 text-xs font-bold border border-surface-border rounded-xl text-text-main opacity-60 text-center transition-all peer-checked:border-brand peer-checked:bg-brand/5 peer-checked:text-brand peer-checked:opacity-100">
                                                            {s.toUpperCase()}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-2">Contact Person</label>
                                                <input value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} className={inputClasses} placeholder="Jane Doe" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-2">Contact Email</label>
                                                <input type="email" value={formData.contact_person_email} onChange={e => setFormData({ ...formData, contact_person_email: e.target.value })} className={inputClasses} placeholder="jane@company.com" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-2">Job URL</label>
                                            <input type="url" value={formData.job_description_url} onChange={e => setFormData({ ...formData, job_description_url: e.target.value })} className={inputClasses} placeholder="https://linkedin.com/jobs/..." />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-text-main opacity-50 uppercase tracking-widest mb-2">Description</label>
                                            <textarea value={formData.job_description_text} onChange={e => setFormData({ ...formData, job_description_text: e.target.value })} rows={6} className={inputClasses} placeholder="Requirements, notes, etc." />
                                        </div>
                                    </form>
                                </div>

                                <div className="border-t border-surface-border bg-workspace p-6 flex justify-end gap-3">
                                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-text-main opacity-40">Cancel</button>
                                    <button form="job-form" disabled={loading} className="bg-brand text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all">
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