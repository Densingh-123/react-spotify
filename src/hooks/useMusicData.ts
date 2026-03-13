import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchTrending, searchMusic } from '@/services/api';

export const useTrendingMusic = () =>
  useQuery({ queryKey: ['trending'], queryFn: fetchTrending, staleTime: 1000 * 60 * 5 });

const PAGE_SIZE = 25;
export const useSearchMusic = (query: string) =>
  useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: ({ pageParam }) => searchMusic(query, pageParam as number),
    getNextPageParam: (lastPage, allPages) =>
      !lastPage || lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE,
    initialPageParam: 0,
    enabled: !!query && query.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });
