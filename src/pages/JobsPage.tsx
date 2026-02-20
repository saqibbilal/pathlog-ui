import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { jobApi } from '@/features/jobs/services/jobApi';
import type { JobApplication, JobPaginationResponse } from '@/features/jobs/types';
import { JobTable } from '@/features/jobs/components/JobTable';
import { JobDetailsModal } from '@/features/jobs/components/JobDetailsModal';
import { AddJobSlideOver } from '@/features/jobs/components/AddJobSlideOver';
import { SuccessToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const getPageNumbers = (current: number, last: number) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;
    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        }
    }
    for (const i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }
    return rangeWithDots;
};

export const JobsPage = () => {
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<JobPaginationResponse['meta'] | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(10);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [jobToEdit, setJobToEdit] = useState<JobApplication | null>(null);

    const fetchJobs = useCallback(async (page = 1, currentPerPage = perPage) => {
        setLoading(true);
        try {
            const response = await jobApi.getJobs(page, currentPerPage);
            setJobs(response.data);
            setPagination(response.meta);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    }, [perPage]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleBulkDelete = async () => {
        setIsDeleteConfirmOpen(false);
        try {
            await jobApi.bulkDeleteJobs(selectedIds);
            setSelectedIds([]);
            fetchJobs(pagination?.current_page || 1);
        } catch (error) {
            console.error("Bulk delete failed", error);
        }
    };

    const handleSuccess = () => {
        setIsAddOpen(false);
        setJobToEdit(null);
        fetchJobs(pagination?.current_page || 1);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleDeleteSuccess = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedJobId(null), 300);
        fetchJobs(pagination?.current_page || 1);
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = Number(e.target.value);
        setPerPage(newPerPage);
        fetchJobs(1, newPerPage);
    };

    const handleEditTrigger = (job: JobApplication) => {
        setIsModalOpen(false);
        setTimeout(() => {
            setJobToEdit(job);
            setIsAddOpen(true);
            setSelectedJobId(null);
        }, 300);
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight">Job Log</h1>
                    <p className="opacity-60 text-text-main">Manage and track your active applications.</p>
                </div>

                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            className="bg-rose-500/10 text-rose-600 px-5 py-2.5 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all border border-rose-200"
                        >
                            🗑️ Delete ({selectedIds.length})
                        </button>
                    )}

                    <button
                        onClick={() => { setJobToEdit(null); setIsAddOpen(true); }}
                        className="bg-brand text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 active:scale-95"
                    >
                        + Add New Job
                    </button>
                </div>
            </div>

            {jobs.length > 0 || loading ? (
                <>
                    <div className={`${loading ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200`}>
                        <JobTable
                            jobs={jobs}
                            selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                            onViewDetails={(id) => { setSelectedJobId(id); setIsModalOpen(true); }}
                        />
                    </div>

                    {pagination && (
                        <div className="mt-8 flex items-center justify-between bg-surface p-4 rounded-2xl border border-surface-border shadow-sm">
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={pagination.current_page === 1}
                                    onClick={() => fetchJobs(pagination.current_page - 1)}
                                    className="p-2 text-brand hover:bg-brand/10 rounded-lg disabled:opacity-20 transition-colors"
                                >
                                    ←
                                </button>
                                <div className="flex gap-1">
                                    {getPageNumbers(pagination.current_page, pagination.last_page).map((page, idx) => (
                                        <button
                                            key={idx}
                                            disabled={page === '...'}
                                            onClick={() => typeof page === 'number' && fetchJobs(page)}
                                            className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                                page === pagination.current_page
                                                    ? 'bg-brand text-white shadow-md'
                                                    : 'text-text-main hover:bg-brand/10'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => fetchJobs(pagination.current_page + 1)}
                                    className="p-2 text-brand hover:bg-brand/10 rounded-lg disabled:opacity-20 transition-colors"
                                >
                                    →
                                </button>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="text-sm text-text-main opacity-60 italic">
                                    {pagination.total > 0 ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total}` : 'No entries'}
                                </span>
                                <div className="flex items-center gap-2 border-l border-surface-border pl-6">
                                    <span className="text-xs text-text-main opacity-50 uppercase font-bold tracking-wider">Per Page:</span>
                                    <select
                                        className="text-xs border-surface-border rounded-lg bg-workspace text-text-main py-1 px-2 outline-none focus:ring-2 focus:ring-brand/20"
                                        value={perPage}
                                        onChange={handlePerPageChange}
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center p-20 bg-surface rounded-3xl border-2 border-dashed border-surface-border">
                    <p className="text-text-main opacity-60 font-medium">Your journey starts here. Add your first application!</p>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && selectedJobId && (
                    <JobDetailsModal
                        key="job-details-modal"
                        jobId={selectedJobId}
                        onClose={() => { setIsModalOpen(false); setTimeout(() => setSelectedJobId(null), 300); }}
                        onDelete={handleDeleteSuccess}
                        onEdit={handleEditTrigger}
                    />
                )}
            </AnimatePresence>

            <AddJobSlideOver
                isOpen={isAddOpen}
                jobToEdit={jobToEdit}
                onClose={() => { setIsAddOpen(false); setJobToEdit(null); }}
                onSuccess={handleSuccess}
            />

            <SuccessToast isVisible={showToast} />

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                title="Delete Applications?"
                message={`Are you sure you want to delete ${selectedIds.length} applications? This action is permanent.`}
                onConfirm={handleBulkDelete}
                onCancel={() => setIsDeleteConfirmOpen(false)}
            />
        </div>
    );
};