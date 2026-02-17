import { useEffect, useState } from 'react';
import { jobApi } from '@/features/jobs/services/jobApi';
import type { JobApplication } from '@/features/jobs/types';
import { JobStatusBadge } from '@/features/jobs/components/JobStatusBadge';

interface Props {
    jobId: number;
    onClose: () => void;
}

export const JobDetailsModal = ({ jobId, onClose }: Props) => {
    const [job, setJob] = useState<JobApplication | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true); // Reset loading state when jobId changes
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

    // Safety: If there is no job data and we aren't loading,
    // something went wrong, so don't render a broken UI.
    if (!job && !loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
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
                                    <span className="text-sm text-slate-400">Applied on {job.applied_at}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded"></div>
                            <div className="h-8 bg-slate-100 rounded-2xl"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    ) : (
                        <>
                            {/* Contact Section - Added more defensive chaining here */}
                            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Point of Contact</h3>
                                <p className="text-slate-900 font-medium">
                                    {job?.contact?.name || 'No contact listed'}
                                </p>
                                <p className="text-indigo-600 text-sm">
                                    {job?.contact?.email || 'No email provided'}
                                </p>
                            </div>

                            {/* Description Section */}
                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Job Description</h3>
                                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                    {job?.job_description_text || "No description saved for this application."}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    {!loading && job?.job_description_url && (
                        <a
                            href={job.job_description_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            View Original Post ↗
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};