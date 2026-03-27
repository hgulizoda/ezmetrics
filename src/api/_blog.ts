import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// ----------------------------------------------------------------------
export type IPostComment = {
  id: string;
  name: string;
  avatarUrl: string;
  message: string;
  postedAt: Date;
  users: { id: string; name: string; avatarUrl: string }[];
  replyComment: {
    id: string;
    userId: string;
    message: string;
    postedAt: Date;
    tagUser?: string;
  }[];
};

export type IPostItem = {
  id: string;
  title: string;
  tags: string[];
  publish: string;
  content: string;
  coverUrl: string;
  metaTitle: string;
  totalViews: number;
  totalShares: number;
  description: string;
  totalComments: number;
  totalFavorites: number;
  metaKeywords: string[];
  metaDescription: string;
  comments: IPostComment[];
  createdAt: Date;
  favoritePerson: { name: string; avatarUrl: string }[];
  author: { name: string; avatarUrl: string };
};

const MOCK_POSTS: IPostItem[] = [];

export function useGetPosts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { posts: MOCK_POSTS };
    },
  });

  const memoizedValue = useMemo(
    () => ({
      posts: (data?.posts as IPostItem[]) || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: false,
      postsEmpty: !isLoading && !data?.posts.length,
    }),
    [data?.posts, error, isLoading]
  );

  return memoizedValue;
}

export function useGetPost(title: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', title],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { post: MOCK_POSTS.find((p) => p.title === title) || null };
    },
    enabled: !!title,
  });

  const memoizedValue = useMemo(
    () => ({
      post: data?.post as IPostItem,
      postLoading: isLoading,
      postError: error,
      postValidating: false,
    }),
    [data?.post, error, isLoading]
  );

  return memoizedValue;
}

export function useGetLatestPosts(title: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['latestPosts', title],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { latestPosts: MOCK_POSTS };
    },
    enabled: !!title,
  });

  const memoizedValue = useMemo(
    () => ({
      latestPosts: (data?.latestPosts as IPostItem[]) || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: false,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading]
  );

  return memoizedValue;
}

export function useSearchPosts(query: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['searchPosts', query],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { results: MOCK_POSTS.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())) };
    },
    enabled: !!query,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IPostItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: false,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading]
  );

  return memoizedValue;
}
