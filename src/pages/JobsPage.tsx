import { useEffect, useState, useCallback } from 'react';
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
    // --- State Management ---
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

    // --- Data Fetching ---
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

    // --- Event Handlers ---
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

    const handleAddSuccess = () => {
        setIsAddOpen(false);
        fetchJobs();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleDeleteSuccess = () => {
        setIsModalOpen(false);
        setSelectedJobId(null);
        fetchJobs(pagination?.current_page || 1);
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = Number(e.target.value);
        setPerPage(newPerPage);
        fetchJobs(1, newPerPage);
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Log</h1>
                    <p className="text-slate-500">Manage and track your active applications.</p>
                </div>

                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl font-bold hover:bg-rose-100 transition-all border border-rose-100 flex items-center gap-2"
                        >
                            <span>🗑️</span> Delete ({selectedIds.length})
                        </button>
                    )}

                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                    >
                        + Add New Job
                    </button>
                </div>
            </div>

            {/* Table Section */}
            {jobs.length > 0 || loading ? (
                <>
                    <div className={`${loading ? 'opacity-50 pointer-events-none cursor-wait' : ''} transition-opacity duration-200`}>
                        <JobTable
                            jobs={jobs}
                            selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                            onViewDetails={(id) => { setSelectedJobId(id); setIsModalOpen(true); }}
                        />
                    </div>

                    {/* Persistant Footer Bar */}
                    {pagination && (
                        <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">

                            {/* Left: Page Numbers (Conditional) */}
                            <div className="flex items-center gap-1 min-h-[40px]">
                                {pagination.last_page > 1 ? (
                                    <>
                                        <button
                                            disabled={pagination.current_page === 1}
                                            onClick={() => fetchJobs(pagination.current_page - 1)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-10 transition-colors"
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
                                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                                            : page === '...'
                                                                ? 'text-slate-400 cursor-default'
                                                                : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            disabled={pagination.current_page === pagination.last_page}
                                            onClick={() => fetchJobs(pagination.current_page + 1)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-10 transition-colors"
                                        >
                                            →
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium px-2 italic">All caught up</span>
                                )}
                            </div>

                            {/* Right: Info & Density (Always Visible) */}
                            <div className="flex items-center gap-6">
                                <span className="text-sm text-slate-400 font-medium italic">
                                    {pagination.total > 0
                                        ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} entries`
                                        : 'No entries'
                                    }
                                </span>
                                <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Per Page:</span>
                                    <select
                                        className="text-xs border-slate-100 rounded-lg bg-slate-50 text-slate-500 py-1 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                <div className="text-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <div className="text-4xl mb-4">💡</div>
                    <p className="text-slate-500 font-medium">Your journey starts here. Your first application is just one click away!</p>
                </div>
            )}

            {/* Overlays */}
            {isModalOpen && selectedJobId && (
                <JobDetailsModal
                    jobId={selectedJobId}
                    onClose={() => { setIsModalOpen(false); setSelectedJobId(null); }}
                    onDelete={handleDeleteSuccess}
                />
            )}

            <AddJobSlideOver isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleAddSuccess} />
            <SuccessToast isVisible={showToast} />

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                title="Delete Applications?"
                message={`Are you sure you want to delete ${selectedIds.length} job applications? This action is permanent.`}
                confirmText="Yes, Delete Them"
                onConfirm={handleBulkDelete}
                onCancel={() => setIsDeleteConfirmOpen(false)}
            />
        </div>
    );
};