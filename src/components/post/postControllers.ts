import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { Post } from '@prisma/client';

import db from '../../appDatabase';

import type { PostCreateDto, PostUpdateDto } from './postTypes';
import { buildPostRo } from './postHelpers';

export async function listPosts(authorId: string) {
  const posts = await db.post.findMany({ where:{ authorId },
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
