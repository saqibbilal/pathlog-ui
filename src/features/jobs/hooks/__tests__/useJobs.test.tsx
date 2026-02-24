import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetJobs, useGetJob, useCreateJob } from '../useJobs';
import { jobApi } from '../../services/jobApi';

// Mock the API module
vi.mock('../../services/jobApi', () => ({
    jobApi: {
        getJobs: vi.fn(),
        getJobById: vi.fn(),
        createJob: vi.fn(),
        updateJob: vi.fn(),
        deleteJob: vi.fn(),
        bulkDeleteJobs: vi.fn(),
    }
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useJobs Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('useGetJobs fetches jobs successfully', async () => {
        const mockResponse = {
            data: [{ id: 1, company_name: 'Test Co', job_title: 'Dev' }],
            meta: { current_page: 1, last_page: 1, per_page: 10, total: 1, from: 1, to: 1, path: '' },
            links: { first: '', last: '', prev: null, next: null }
        };
        vi.mocked(jobApi.getJobs).mockResolvedValueOnce(mockResponse as any);

        const { result } = renderHook(() => useGetJobs(1, 10), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.data).toHaveLength(1);
        expect(jobApi.getJobs).toHaveBeenCalledWith(1, 10, undefined, expect.any(Object));
    });

    it('useGetJob fetches single job', async () => {
        const mockJob = { id: 2, company_name: 'Google', job_title: 'Engineer' };
        vi.mocked(jobApi.getJobById).mockResolvedValueOnce(mockJob as any);

        const { result } = renderHook(() => useGetJob(2), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.company_name).toBe('Google');
        expect(jobApi.getJobById).toHaveBeenCalledWith(2);
    });

    it('useCreateJob invalidates cache on success', async () => {
        const newJob = { company_name: 'Apple', job_title: 'Developer', status: 'applied', applied_at: '2026-02-23' };
        const mockResponse = { id: 3, ...newJob };

        vi.mocked(jobApi.createJob).mockResolvedValueOnce(mockResponse as any);

        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useCreateJob(), { wrapper });

        result.current.mutate(newJob as any);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(jobApi.createJob).toHaveBeenCalledWith(newJob);
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['jobs'] });
    });
});
