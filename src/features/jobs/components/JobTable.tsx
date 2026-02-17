import type { JobApplication } from '@/features/jobs/types';
import { JobStatusBadge } from '@/features/jobs/components/JobStatusBadge';

interface Props {
    jobs: JobApplication[];
    onViewDetails: (id: number) => void;
}

export const JobTable = ({ jobs, onViewDetails }: Props) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 text-sm font-semibold text-slate-600">Company</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Position</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Applied</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 font-medium text-slate-900">{job.company_name}</td>
                        <td className="p-4 text-slate-600">{job.job_title}</td>
                        <td className="p-4"><JobStatusBadge status={job.status} /></td>
                        <td className="p-4 text-sm text-slate-500">{job.applied_at}</td>
                        <td className="p-4 text-right">
                            <button
                                onClick={() => onViewDetails(job.id)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
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