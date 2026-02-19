import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { jobApi } from '@/features/jobs/services/jobApi';
import type { JobApplication } from '@/features/jobs/types';
import { JobStatusBadge } from '@/features/jobs/components/JobStatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Props {
    jobId: number;
    onClose: () => void;
    onDelete: () => void;
    onEdit: (job: JobApplication) => void;
}

export const JobDetailsModal = ({ jobId, onClose, onDelete, onEdit }: Props) => {
    const [job, setJob] = useState<JobApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            try {
                const data = await jobApi.getJobById(jobId);
                setJob(data);
            } catch (error) {
                console.error("Failed to fetch job details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [jobId]);

    const handleDelete = async () => {
        setIsDeleteConfirmOpen(false);
        setIsDeleting(true);
        try {
            await jobApi.deleteJob(jobId);
            onDelete();
        } catch (error) {
            console.error("Delete failed", error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Fade */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Slide & Scale */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {loading ? 'Loading...' : job?.company_name}
                        </h2>
                        <p className="text-lg text-slate-600">{job?.job_title}</p>
                        <div className="mt-2 flex gap-2">
                            {!loading && job && (
                                <>
                                    <JobStatusBadge status={job.status} />
                                    <span className="text-sm text-slate-400 font-medium">Applied on {job.applied_at}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded"></div>
                            <div className="h-20 bg-slate-50 rounded-2xl"></div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Point of Contact</h3>
                                <p className="text-slate-900 font-medium">{job?.contact?.name || 'No contact listed'}</p>
                                <p className="text-indigo-600 text-sm">{job?.contact?.email || 'No email provided'}</p>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Job Description</h3>
                                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                    {job?.job_description_text || "No description saved."}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            disabled={loading || isDeleting}
                            className="text-rose-600 hover:text-rose-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                            onClick={() => job && onEdit(job)}
                            disabled={loading}
                            className="text-slate-600 hover:text-slate-900 text-sm font-bold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Edit Details
                        </button>
                    </div>
                    <button onClick={onClose} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-95">
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