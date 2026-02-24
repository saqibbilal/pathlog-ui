import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobApi, type JobFilters } from '../services/jobApi';
import type { CreateJobRequest } from '../types';

export const JOB_QUERY_KEYS = {
    all: ['jobs'] as const,
    lists: () => [...JOB_QUERY_KEYS.all, 'list'] as const,
    list: (page: number, perPage: number, filters?: JobFilters) => [...JOB_QUERY_KEYS.lists(), page, perPage, filters] as const,
    details: () => [...JOB_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...JOB_QUERY_KEYS.details(), id] as const,
};

export const useGetJobs = (page: number, perPage: number, filters?: JobFilters) => {
    return useQuery({
        queryKey: JOB_QUERY_KEYS.list(page, perPage, filters),
        queryFn: ({ signal }) => jobApi.getJobs(page, perPage, filters, signal),
        placeholderData: (previousData) => previousData, // keep previous data while fetching new page
    });
};

export const useGetJob = (id: number, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: JOB_QUERY_KEYS.detail(id),
        queryFn: () => jobApi.getJobById(id),
        enabled: options?.enabled ?? true,
    });
};

export const useCreateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateJobRequest) => jobApi.createJob(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all });
        },
    });
};

export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateJobRequest> }) => jobApi.updateJob(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.lists() });
        },
    });
};

export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => jobApi.deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all });
        },
    });
};

export const useBulkDeleteJobs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: number[]) => jobApi.bulkDeleteJobs(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all });
        },
    });
};
