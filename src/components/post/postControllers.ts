import httpStatus from 'http-status-codes';
import createError from 'http-errors';

import db from '../../appDatabase';

import type { NewPostDto } from './postTypes';
import { buildPostRo } from './postHelpers';

export async function listPosts(authorId: string) {
  const posts = await db.post.findMany({
    where: { authorId },
    orderBy: { createdAt: 'desc' },
  });
  return posts.map((post) => buildPostRo(post));
}

export async function createNewPost(authorId: string, payload: NewPostDto) {
  const alreadyExists = !!await db.post.findUnique({
    where: {
      authorId_title: {
        authorId, title: payload.title,
      },
    },
  });
  if (alreadyExists) {
    throw createError(httpStatus.CONFLICT, `User ${authorId} already has a post named ${payload.title}`);
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

export async function getPost(authorId: string, postId: string) {
  const post = await db.post.findFirst({
    where: { id: postId, authorId },
  });
  if (!post) throw createError(httpStatus.NOT_FOUND, `Post ${postId} doesn't exist on user ${authorId}`);
  return buildPostRo(post);
}
