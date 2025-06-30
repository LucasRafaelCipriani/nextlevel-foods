'use server';

import { redirect } from 'next/navigation';

import { Meal } from '@/types/Meal';
import { saveMeal } from './meals';

function isInvalidText(text: string) {
  return !text || text.trim() === '';
}

export const shareMeal = async (
  prevState: { payload: FormData | null; message: string | null },
  formData: FormData
): Promise<{ payload: FormData | null; message: string | null }> => {
  const meal: Meal = {
    title: formData.get('title')?.toString() ?? '',
    creator: formData.get('name')?.toString() ?? '',
    creator_email: formData.get('email')?.toString() ?? '',
    imageFile: formData.get('image') as File,
    image: formData.get('image')?.toString() ?? '',
    summary: formData.get('summary')?.toString() ?? '',
    instructions: formData.get('instructions')?.toString() ?? '',
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.imageFile ||
    meal.imageFile.size === 0
  ) {
    return {
      payload: formData,
      message: 'Failed to create meal. Please try again. ',
    };
  }

  await saveMeal(meal);

  redirect('/meals');
};
