export class PostUpdateInput {
  id: number;
  cover?: string;
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  authorId: string;
  tags: number[];
}
