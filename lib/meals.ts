import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

import { Meal } from '@/types/Meal';
import ImageKit from 'imagekit';

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
    const isRepeatedSlug = !!db
      .prepare('SELECT * FROM meals WHERE slug = ?')
      .get(meal.slug);

    if (isRepeatedSlug) {
      meal.slug = slugify(`${meal.title}-${new Date().getTime()}`, {
        lower: true,
      });
    }

    meal.instructions = xss(meal.instructions);

    const extension = meal?.imageFile?.name.split('.').pop();
    const fileName = `${meal.slug}-${new Date().getTime()}.${extension}`;
    const arrayBuffer = await meal?.imageFile?.arrayBuffer();
    const bufferedImage = arrayBuffer ? Buffer.from(arrayBuffer) : undefined;

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });

    if (!bufferedImage) {
      throw new Error('Image file is missing or could not be processed.');
    }

    const uploadResult = await imagekit.upload({
      file: bufferedImage,
      fileName: fileName,
      folder: 'images',
      useUniqueFileName: true,
      isPrivateFile: false,
    });

    if (!uploadResult || !uploadResult.url) {
      throw new Error('Image upload failed. Please try again later.');
    }

    meal.image = uploadResult.url;

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
