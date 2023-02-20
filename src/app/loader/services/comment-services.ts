/* eslint-disable max-len */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable prettier/prettier */
/* eslint-disable implicit-arrow-linebreak */

import Loader from '../loader';
import { CreateCommentRequest, Endpoints, Methods, Token, UpdateComment } from '../loader-requests.types';
import { CommentResponse } from '../loader-responses.types';

export const createComment = (token: Token, params: CreateCommentRequest): Promise<CommentResponse> =>
  Loader.postData(Methods.Post, Endpoints.CreateComment, params, token);

export const updateComment = (id: number, params: UpdateComment): Promise<CommentResponse> =>
  Loader.putData(Methods.Put, `${Endpoints.UpdateComment}${id}`, params);

export const deleteComment = (id: number): Promise<void> =>
  Loader.deleteData(Methods.Delete, `${Endpoints.DeleteComment}${id}`);
