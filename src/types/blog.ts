export interface Post {
  id: string;
  slug: string;
  permalink: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  category?: string;
  author?: string;
  tags?: Array<string>;
  draft?: boolean;
}

export interface BlogConfig {
  title?: string;
  description?: string;
  postsPerPage?: number;
  blog?: {
    permalink?: string;
    page?: string;
    post?: string;
    tag?: string;
    category?: string;
  };
}

export interface BlogData {
  posts: Array<Post>;
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    nextPage?: string;
    previousPage?: string;
  };
}

export interface BlogCategory {
  name: string;
  slug: string;
  permalink: string;
  count: number;
}

export interface BlogTag {
  name: string;
  slug: string;
  permalink: string;
  count: number;
} 