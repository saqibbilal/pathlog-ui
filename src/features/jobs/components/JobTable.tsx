import type { JobApplication } from '@/features/jobs/types';
import { JobStatusBadge } from '@/features/jobs/components/JobStatusBadge';

interface Props {
    jobs: JobApplication[];
    onViewDetails: (id: number) => void;
    selectedIds: number[]; // New Prop
    onSelectionChange: (ids: number[]) => void; // New Prop
}

export const JobTable = ({ jobs, onViewDetails, selectedIds, onSelectionChange }: Props) => {

    // Helper to toggle all visible jobs
    const toggleAll = () => {
        if (selectedIds.length === jobs.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(jobs.map(job => job.id));
        }
    };

    // Helper to toggle a single job
    const toggleOne = (id: number) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(item => item !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 w-10">
                        <input
                            type="checkbox"
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                            checked={jobs.length > 0 && selectedIds.length === jobs.length}
                            onChange={toggleAll}
                        />
                    </th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Company</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Position</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-center">Applied</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                    <tr
                        key={job.id}
                        className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(job.id) ? 'bg-indigo-50/30' : ''}`}
                    >
                        <td className="p-4">
                            <input
                                type="checkbox"
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                checked={selectedIds.includes(job.id)}
                                onChange={() => toggleOne(job.id)}
                            />
                        </td>
                        <td className="p-4 font-medium text-slate-900">{job.company_name}</td>
                        <td className="p-4 text-slate-600">{job.job_title}</td>
                        <td className="p-4">
                            <JobStatusBadge status={job.status} />
                        </td>
                        <td className="p-4 text-sm text-slate-500 text-center">{job.applied_at}</td>
                        <td className="p-4 text-right">
                            <button
                                onClick={() => onViewDetails(job.id)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-lg hover:bg-indigo-50"
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