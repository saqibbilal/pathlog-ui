import { useEffect, useState } from 'react';
import { jobApi } from '@/features/jobs/services/jobApi';
import type { JobApplication } from '@/features/jobs/types';
import { JobTable } from '@/features/jobs/components/JobTable';
import { JobDetailsModal } from '@/features/jobs/components/JobDetailsModal'; // New Import

export const JobsPage = () => {
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    // State for Modal Management
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobApi.getJobs();
                setJobs(response.data);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleViewDetails = (id: number) => {
        setSelectedJobId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJobId(null);
    };

    if (loading) return <div className="p-8 text-slate-500">Loading your applications...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Log</h1>
                    <p className="text-slate-500">Manage and track your active applications.</p>
                </div>
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm">
                    Add New Job
                </button>
            </div>

            {jobs.length > 0 ? (
                <JobTable jobs={jobs} onViewDetails={handleViewDetails} />
            ) : (
                <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">No applications found. Time to start applying!</p>
                </div>
            )}

            {/* Modal Logic */}
            {isModalOpen && selectedJobId && (
                <JobDetailsModal
                    jobId={selectedJobId}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};