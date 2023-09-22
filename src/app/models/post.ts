export interface Post {
    id ?: string,
    title: string,
    permalink: string,
    excerpt: string,
    category:{
        categoryId: string,
        category: string
    }
    postImgPath: string,
    content: string,
    isFeatured: boolean,
    views: number,
    status: string,
    createdAt: any
}
