import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

import { Meal } from '@/types/Meal';

const db = sql('meals.db');

export const getMeals = async (): Promise<Meal[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return db.prepare('SELECT * FROM meals').all() as Meal[];
  } catch {
    throw new Error('Failed to fetch meal data. Please try again later.');
  }
};

export const getMeal = async (slug: string): Promise<Meal> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug) as Meal;
  } catch {
    throw new Error('Failed to fetch meal data. Please try again later.');
  }
};

export const saveMeal = async (meal: Meal): Promise<void> => {
  try {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    const extension = meal?.imageFile?.name.split('.').pop();
    const fileName = `${meal.slug}-${new Date().getTime()}.${extension}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal?.imageFile?.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        throw new Error('Failed to save meal data. Please try again later.');
      }
    });

    meal.image = `/images/${fileName}`;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    db.prepare(
      `
      INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)  
      VALUES (
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @slug
      )
    `
    ).run(meal);
  } catch {
    throw new Error('Failed to save meal data. Please try again later.');
  }
};
