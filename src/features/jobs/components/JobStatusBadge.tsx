import type { JobStatus } from '@/features/jobs/types';

const statusStyles: Record<JobStatus, string> = {
    applied: 'bg-blue-100 text-blue-700 border-blue-200',
    interviewing: 'bg-amber-100 text-amber-700 border-amber-200',
    offered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-700 border-rose-200',
};

export const JobStatusBadge = ({ status }: { status: JobStatus }) => {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
    );
};