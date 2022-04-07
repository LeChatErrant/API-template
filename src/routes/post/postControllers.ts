import { StatusCodes } from 'http-status-codes';
import { Post } from '@prisma/client';

import db from '../../appDatabase';
import { ApiError } from '../../appErrors';

import type { PostCreateDto, PostUpdateDto } from './postTypes';
import { buildPostRo } from './postHelpers';

export async function listPosts() {
  // Todo: pagination
  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } });
  return posts.map((post) => buildPostRo(post));
}

export async function listPostsByUser(authorId: string) {
  const posts = await db.post.findMany({ where: { authorId },
    orderBy: { createdAt: 'desc' },
  });
  return posts.map((post) => buildPostRo(post));
}


export async function createNewPost(authorId: string, payload: PostCreateDto) {
  const alreadyExists = !!await db.post.findUnique({
    where: {
      authorId_title: {
        authorId, title: payload.title,
      },
    },
  });
  if (alreadyExists) {
    throw new ApiError(StatusCodes.CONFLICT, `User ${authorId} already has a post named ${payload.title}`);
  }

  const post = await db.post.create({
    data: {
      ...payload,
      author: {
        connect: { id: authorId },
      },
    },
  });
  return buildPostRo(post);
}

export async function getPost(post: Post) {
  return buildPostRo(post);
}

export async function updatePost(post: Post, payload: PostUpdateDto) {
  const updatedPost = await db.post.update({
    where: { id: post.id },
    data: payload,
  });
  return buildPostRo(updatedPost);
}

export async function deletePost(post: Post) {
  await db.post.delete({ where: { id: post.id } });
}
