import type { Post } from '@prisma/client';

import type { PostRo } from './post.types';

/**
 * Build a post Response Object (RO) with only the fields to be shown to the user
 * Can be used to compute or add extra information to the post object, useful for front-end display
 *
 * @param post The post object to format
 * @returns A post Response Object ready to be sent into API responses
 */
export function buildPostRo(post: Post): PostRo {
  return {
    id: post.id,
    authorId: post.authorId,
    imageLink: post.imageLink,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}
