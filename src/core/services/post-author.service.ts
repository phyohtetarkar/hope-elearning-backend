export interface PostAuthorService {
  existByPostAndAuthor(postId: string, authorId: string): Promise<boolean>;
}

export const POST_AUTHOR_SERVICE = 'PostAuthorService';
