import { Meal } from '@/types/Meal';
import sql from 'better-sqlite3';

const db = sql('meals.db');

export const getMeals = async (): Promise<Meal[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return db.prepare('SELECT * FROM meals').all() as Meal[];
  } catch {
    throw new Error('Failed to fetch meal data. Please try again later.');
  }
};
