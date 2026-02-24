import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGetJobs, useBulkDeleteJobs } from '@/features/jobs/hooks/useJobs';
import type { JobFilters } from '@/features/jobs/services/jobApi';
import type { JobApplication } from '@/features/jobs/types';
import { JobTable } from '@/features/jobs/components/JobTable';
import { JobDetailsModal } from '@/features/jobs/components/JobDetailsModal';
import { AddJobSlideOver } from '@/features/jobs/components/AddJobSlideOver';
import { JobSearchFilter } from '@/features/jobs/components/JobSearchFilter';
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
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [jobToEdit, setJobToEdit] = useState<JobApplication | null>(null);

    // Filter sync from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPageStr = searchParams.get('page');
    const urlPage = currentPageStr ? parseInt(currentPageStr, 10) : 1;
    const currentPerPageStr = searchParams.get('per_page');
    const urlPerPage = currentPerPageStr ? parseInt(currentPerPageStr, 10) : 10;

    const filters: JobFilters = {
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || undefined,
        date_applied: searchParams.get('date_applied') || undefined,
    };

    const { data: response, isLoading, isFetching } = useGetJobs(urlPage, urlPerPage, filters);
    const { mutateAsync: bulkDeleteJobs } = useBulkDeleteJobs();

    const jobs = response?.data || [];
    const pagination = response?.meta || null;
    const activeFetching = isLoading || isFetching;

    const handleBulkDelete = async () => {
        setIsDeleteConfirmOpen(false);
        try {
            await bulkDeleteJobs(selectedIds);
            setSelectedIds([]);
        } catch (error) {
            console.error("Bulk delete failed", error);
        }
    };

    const handleSuccess = () => {
        setIsAddOpen(false);
        setJobToEdit(null);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleDeleteSuccess = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedJobId(null), 300);
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = e.target.value;

        // Reset URL page strictly, and set new layout limit
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set('page', '1');
            params.set('per_page', newPerPage);
            return params;
        });
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
                    <JobSearchFilter />

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

            {jobs.length > 0 || activeFetching ? (
                <>
                    <div className={`${activeFetching ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200`}>
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
                                    onClick={() => {
                                        setSearchParams(prev => {
                                            const p = new URLSearchParams(prev);
                                            p.set('page', (pagination.current_page - 1).toString());
                                            return p;
                                        });
                                    }}
                                    className="p-2 text-brand hover:bg-brand/10 rounded-lg disabled:opacity-20 transition-colors"
                                >
                                    ←
                                </button>
                                <div className="flex gap-1">
                                    {getPageNumbers(pagination.current_page, pagination.last_page).map((page, idx) => (
                                        <button
                                            key={idx}
                                            disabled={page === '...'}
                                            onClick={() => {
                                                if (typeof page === 'number') {
                                                    setSearchParams(prev => {
                                                        const p = new URLSearchParams(prev);
                                                        p.set('page', page.toString());
                                                        return p;
                                                    });
                                                }
                                            }}
                                            className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${page === pagination.current_page
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
                                    onClick={() => {
                                        setSearchParams(prev => {
                                            const p = new URLSearchParams(prev);
                                            p.set('page', (pagination.current_page + 1).toString());
                                            return p;
                                        });
                                    }}
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
                                        className="text-xs border border-surface-border rounded-lg bg-workspace text-text-main py-1.5 px-3 outline-none focus:ring-2 focus:ring-brand/30 transition-all font-bold cursor-pointer hover:border-brand/50 shadow-sm"
                                        value={urlPerPage}
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
                    {searchParams.get('search') || searchParams.get('status') || searchParams.get('date_applied') ? (
                        <>
                            <p className="text-text-main opacity-80 font-bold mb-2">No applications found matching your filters.</p>
                            <p className="text-text-main opacity-60 text-sm">Try tweaking your search or clearing active filters to see more results.</p>
                        </>
                    ) : (
                        <p className="text-text-main opacity-60 font-medium">Your journey starts here. Add your first application!</p>
                    )}
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