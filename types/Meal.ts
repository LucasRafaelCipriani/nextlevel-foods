export interface Meal {
  id?: string;
  title: string;
  slug?: string;
  image: string;
  imageFile: File;
  summary: string;
  instructions: string;
  creator: string;
  creator_email: string;
}
