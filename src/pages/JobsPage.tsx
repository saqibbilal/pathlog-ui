import { useEffect, useState, useCallback } from 'react';
import { jobApi } from '@/features/jobs/services/jobApi';
import type { JobApplication } from '@/features/jobs/types';
import { JobTable } from '@/features/jobs/components/JobTable';
import { JobDetailsModal } from '@/features/jobs/components/JobDetailsModal';
import { AddJobSlideOver } from '@/features/jobs/components/AddJobSlideOver';
import { SuccessToast } from '@/components/ui/Toast';

export const JobsPage = () => {
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    // State for Modal & Slide-over Management
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [showToast, setShowToast] = useState(false);

    // 3. Memoize the fetch function so we can reuse it
    const fetchJobs = useCallback(async () => {
        try {
            const response = await jobApi.getJobs();
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleViewDetails = (id: number) => {
        setSelectedJobId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJobId(null);
    };

    const handleAddSuccess = () => {
        setIsAddOpen(false);
        fetchJobs(); // Refresh the list

        // Trigger the motivation!
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000); // Hide after 4 seconds
    };

    if (loading) return <div className="p-8 text-slate-500">Loading your applications...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Log</h1>
                    <p className="text-slate-500">Manage and track your active applications.</p>
                </div>
                {/* 4. Update Click Handler */}
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm"
                >
                    Add New Job
                </button>
            </div>

            {jobs.length > 0 ? (
                <JobTable jobs={jobs} onViewDetails={handleViewDetails} />
            ) : (
                <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">Your journey starts here. Your first application is just one click away! 💡</p>
                </div>
            )}

            {/* Modal Logic */}
            {isModalOpen && selectedJobId && (
                <JobDetailsModal
                    jobId={selectedJobId}
                    onClose={handleCloseModal}
                />
            )}

            {/* 5. Add Slide-over Component */}
            <AddJobSlideOver
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
            />
            <SuccessToast isVisible={showToast} />
        </div>
    );
};