import type { JobApplication } from '@/features/jobs/types';
import { JobStatusBadge } from '@/features/jobs/components/JobStatusBadge';

interface Props {
    jobs: JobApplication[];
    onViewDetails: (id: number) => void;
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
}

export const JobTable = ({ jobs, onViewDetails, selectedIds, onSelectionChange }: Props) => {
    const toggleAll = () => {
        if (selectedIds.length === jobs.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(jobs.map(job => job.id));
        }
    };

    const toggleOne = (id: number) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(item => item !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    return (
        <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-workspace border-b border-surface-border">
                <tr>
                    <th className="p-4 w-10">
                        <input
                            type="checkbox"
                            className="rounded border-surface-border text-brand focus:ring-brand transition-all cursor-pointer"
                            checked={jobs.length > 0 && selectedIds.length === jobs.length}
                            onChange={toggleAll}
                        />
                    </th>
                    <th className="p-4 text-sm font-bold text-text-main opacity-60 uppercase tracking-wider">Company</th>
                    <th className="p-4 text-sm font-bold text-text-main opacity-60 uppercase tracking-wider">Position</th>
                    <th className="p-4 text-sm font-bold text-text-main opacity-60 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-sm font-bold text-text-main opacity-60 uppercase tracking-wider text-center">Applied</th>
                    <th className="p-4 text-sm font-bold text-text-main opacity-60 uppercase tracking-wider text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                {jobs.map((job) => (
                    <tr
                        key={job.id}
                        className={`hover:bg-brand/5 transition-colors group ${selectedIds.includes(job.id) ? 'bg-brand/10' : ''}`}
                    >
                        <td className="p-4">
                            <input
                                type="checkbox"
                                className="rounded border-surface-border text-brand focus:ring-brand transition-all cursor-pointer"
                                checked={selectedIds.includes(job.id)}
                                onChange={() => toggleOne(job.id)}
                            />
                        </td>
                        <td className="p-4 font-bold text-text-main">{job.company_name}</td>
                        <td className="p-4 text-text-main opacity-80">{job.job_title}</td>
                        <td className="p-4">
                            <JobStatusBadge status={job.status} />
                        </td>
                        <td className="p-4 text-sm text-text-main opacity-60 text-center">{job.applied_at}</td>
                        <td className="p-4 text-right">
                            <button
                                onClick={() => onViewDetails(job.id)}
                                className="text-brand hover:text-brand-hover text-sm font-bold opacity-0 group-hover:opacity-100 transition-all px-3 py-1 rounded-lg hover:bg-brand/10"
                            >
                                View Details
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};