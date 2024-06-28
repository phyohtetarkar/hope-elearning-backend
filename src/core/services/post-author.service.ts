export interface PostAuthorService {
  existByPostAndAuthor(postId: number, authorId: string): Promise<boolean>;
}

export const POST_AUTHOR_SERVICE = 'PostAuthorService';
