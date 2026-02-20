import type { JobStatus } from '@/features/jobs/types';

const statusStyles: Record<JobStatus, string> = {
    applied: 'bg-sky-500/10 text-sky-600 border-sky-200/50',
    interviewing: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
    offered: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
    rejected: 'bg-rose-500/10 text-rose-600 border-rose-200/50',
};

export const JobStatusBadge = ({ status }: { status: JobStatus }) => {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[status]}`}>
            {status}
        </span>
    );
};