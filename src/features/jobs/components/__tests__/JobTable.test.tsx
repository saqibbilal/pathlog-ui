import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobTable } from '../JobTable';

// Mock the JobStatusBadge since we just want to test JobTable isolation
vi.mock('../JobStatusBadge', () => ({
    JobStatusBadge: ({ status }: { status: string }) => <div data-testid="status-badge">{status}</div>
}));

describe('JobTable Component', () => {
    const mockJobs = [
        { id: 1, company_name: 'Company A', job_title: 'Frontend Engineer', status: 'applied', applied_at: '2026-02-20', job_description_url: '', job_description_text: '' },
        { id: 2, company_name: 'Company B', job_title: 'Backend Engineer', status: 'interviewing', applied_at: '2026-02-21', job_description_url: '', job_description_text: '' },
    ] as any;

    it('renders essentially table headers and rows', () => {
        const onViewDetails = vi.fn();
        const onSelectionChange = vi.fn();

        render(
            <JobTable
                jobs={mockJobs}
                selectedIds={[]}
                onViewDetails={onViewDetails}
                onSelectionChange={onSelectionChange}
            />
        );

        expect(screen.getByText('Company A')).toBeInTheDocument();
        expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
        expect(screen.getByText('Company B')).toBeInTheDocument();
    });

    it('calls onViewDetails when clicking view button', () => {
        const onViewDetails = vi.fn();
        const onSelectionChange = vi.fn();

        render(
            <JobTable
                jobs={mockJobs}
                selectedIds={[]}
                onViewDetails={onViewDetails}
                onSelectionChange={onSelectionChange}
            />
        );

        const buttons = screen.getAllByRole('button', { name: /view details/i });
        fireEvent.click(buttons[0]);

        expect(onViewDetails).toHaveBeenCalledWith(1);
    });

    it('handles selection toggling', () => {
        const onViewDetails = vi.fn();
        const onSelectionChange = vi.fn();

        render(
            <JobTable
                jobs={mockJobs}
                selectedIds={[1]}
                onViewDetails={onViewDetails}
                onSelectionChange={onSelectionChange}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        // checkboxes[0] is the 'select all' header checkbox
        // checkboxes[1] is the first row checkbox
        // checkboxes[2] is the second row checkbox

        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).not.toBeChecked();

        fireEvent.click(checkboxes[2]);
        expect(onSelectionChange).toHaveBeenCalledWith([1, 2]); // Added 2

        fireEvent.click(checkboxes[1]);
        expect(onSelectionChange).toHaveBeenCalledWith([]); // Removed 1
    });
});
