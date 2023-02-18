/* eslint-disable max-len */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable prettier/prettier */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/prefer-default-export */

import Loader from '../loader';
import { CommentResponse, CreateCommentRequest, Endpoints, Methods, Token } from '../loader.types';


export const createComment = (token: Token, params: CreateCommentRequest): Promise<CommentResponse> =>
  Loader.postData(Methods.Post, Endpoints.CreateComment, params, token);
