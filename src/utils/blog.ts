import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post } from '~/types';
import { APP_BLOG } from '~/utils/config';
import { cleanSlug, trimSlash, BLOG_BASE, POST_PERMALINK_PATTERN, CATEGORY_BASE, TAG_BASE } from './permalinks';
import { newsPagePostsQuery, findLatestPostsAPI } from "~/utils/api";
import slugify from 'slugify';

interface PaginateOptions {
  params: Record<string, string | undefined>;
  pageSize: number;
  props?: Record<string, unknown>;
}

interface PaginateFunction {
  (items: unknown[], options: PaginateOptions): Array<{ params: Record<string, string>; props: Record<string, unknown> }>;
}

interface PaginateContext {
  paginate: PaginateFunction;
}

interface CategoryNode {
  name: string;
}

interface TermNode {
  name: string;
}

interface PostWithCategories {
  categories?: {
    nodes: CategoryNode[];
  };
  terms?: {
    nodes: TermNode[];
  };
}

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, slug: rawSlug = '', data } = post;
  const { Content, remarkPluginFrontmatter } = await post.render();

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
    metadata = {},
  } = data;

  const slug = cleanSlug(rawSlug);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;
  const category = rawCategory ? cleanSlug(rawCategory) : undefined;
  const tags = rawTags.map((tag: string) => cleanSlug(tag));

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate, category }),
    publishDate: publishDate,
    updateDate: updateDate,
    date: publishDate.toISOString(),
    title: title,
    excerpt: excerpt,
    image: image,
    category: category,
    tags: tags,
    author: author,
    draft: draft,
    metadata,
    Content: Content,
    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

const load = async function (): Promise<Array<Post>> {
  const posts = await getCollection('post');
  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

let _posts: Array<Post>;

/** */
export const isBlogEnabled = APP_BLOG.isEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/** */
export const fetchPosts = async (): Promise<Array<Post>> => {
  if (!_posts) {
    _posts = await load();
  }

  return _posts;
};

/** */
export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchPosts();

  return slugs.reduce(function (r: Array<Post>, slug: string) {
    posts.some(function (post: Post) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts();

  return ids.reduce(function (r: Array<Post>, id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findLatestPosts = async ({ count }: { count?: number }): Promise<Array<Post>> => {
  const _count = count || 4;
  const posts = await findLatestPostsAPI();

  return posts ? posts.slice(0, _count) : [];
};

/** */

export const getStaticPathsBlogList = async ({ paginate }: PaginateContext) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];

  const allPosts = await newsPagePostsQuery();

  return paginate(allPosts, {
    params: { blog: BLOG_BASE || undefined },
    pageSize: blogPostsPerPage,
  });
};

/** */
export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  return (await fetchPosts()).flatMap((post) => ({
    params: {
      blog: post.permalink,
    },
    props: { post },
  }));
};

/** */
export const getStaticPathsBlogCategory = async ({ paginate }: PaginateContext) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await newsPagePostsQuery() as PostWithCategories[];
  const categories = new Set<string>();

  posts.forEach((post) => {
    const categoryNodes = post.categories?.nodes;
    if (categoryNodes && categoryNodes.length > 0) {
      categoryNodes.forEach((category: CategoryNode) => {
        if (category.name) {
          const normalizedCategory = slugify(category.name, { lower: true });
          categories.add(normalizedCategory);
        }
      });
    }
  });

  const paths = Array.from(categories).flatMap((category) =>
    paginate(
      posts.filter((post) => {
        const categoryNodes = post.categories?.nodes;
        return categoryNodes && categoryNodes.some((cat: CategoryNode) =>
          cat.name && category === slugify(cat.name, { lower: true })
        );
      }),
      {
        params: { category: category, blog: CATEGORY_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { category },
      }
    )
  );

  return paths;
};

/** */
export const getStaticPathsBlogTag = async ({ paginate }: PaginateContext) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = await newsPagePostsQuery() as PostWithCategories[];
  const tags = new Set<string>();

  posts.forEach((post) => {
    const termNodes = post.terms?.nodes;
    if (termNodes && termNodes.length > 0) {
      termNodes.forEach((term: TermNode) => {
        if (term.name) {
          const normalizedTag = slugify(term.name, { lower: true });
          tags.add(encodeURIComponent(normalizedTag));
        }
      });
    }
  });

  const paths = Array.from(tags).flatMap((tag) =>
    paginate(
      posts.filter((post) => {
        const termNodes = post.terms?.nodes;
        return termNodes && termNodes.some((term: TermNode) =>
          term.name && tag === encodeURIComponent(slugify(term.name, { lower: true }))
        );
      }),
      {
        params: { tag: tag, blog: TAG_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { tag },
      }
    )
  );

  return paths;
};
