import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetJob, useDeleteJob } from '@/features/jobs/hooks/useJobs';
import type { JobApplication } from '@/features/jobs/types';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Props {
    jobId: number;
    onClose: () => void;
    onDelete: () => void;
    onEdit: (job: JobApplication) => void;
}

export const JobDetailsModal = ({ jobId, onClose, onDelete, onEdit }: Props) => {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const { data: job, isLoading: loading } = useGetJob(jobId);
    const { mutateAsync: deleteJobAsync, isPending: isDeleting } = useDeleteJob();

    const handleDelete = async () => {
        setIsDeleteConfirmOpen(false);
        try {
            await deleteJobAsync(jobId);
            onDelete();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative bg-surface w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-surface-border"
            >
                <div className="p-6 border-b border-surface-border flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main">
                            {loading ? 'Loading...' : job?.company_name}
                        </h2>
                        <p className="text-lg text-text-main opacity-70">{job?.job_title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-workspace rounded-full transition-colors text-text-main/20">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-surface-border rounded w-3/4"></div>
                            <div className="h-20 bg-surface-border opacity-50 rounded-2xl"></div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 p-4 bg-workspace rounded-2xl border border-surface-border">
                                <h3 className="text-[10px] font-bold text-text-main opacity-40 uppercase tracking-widest mb-2">Point of Contact</h3>
                                <p className="text-text-main font-medium">{job?.contact?.name || 'No contact listed'}</p>
                                <p className="text-brand text-sm font-bold">{job?.contact?.email || 'No email provided'}</p>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-[10px] font-bold text-text-main opacity-40 uppercase tracking-widest mb-2">Job Description</h3>
                                <div className="text-text-main opacity-80 whitespace-pre-wrap leading-relaxed text-sm">
                                    {job?.job_description_text || "No description saved."}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-surface-border bg-workspace flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            disabled={loading || isDeleting}
                            className="text-rose-600 hover:text-rose-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                            onClick={() => job && onEdit(job)}
                            className="text-text-main hover:text-brand text-sm font-bold px-4 py-2 rounded-lg hover:bg-surface transition-colors"
                        >
                            Edit Details
                        </button>
                    </div>
                    <button onClick={onClose} className="px-8 py-2.5 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand-hover shadow-md transition-all active:scale-95">
                        Close
                    </button>
                </div>
            </motion.div>

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                title="Delete Application?"
                message="This action is permanent. Are you sure?"
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteConfirmOpen(false)}
            />
        </div>
    );
};