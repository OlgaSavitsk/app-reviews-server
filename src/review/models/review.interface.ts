export interface IReview {
  id: string;
  name: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  rating: number;
  img: any;
  filePath: string
 // userId: string | null;
}
