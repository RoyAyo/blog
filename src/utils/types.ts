export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    category?: string;
    excerpt: string;
    publishedAt: string;
    tags: string[];
}