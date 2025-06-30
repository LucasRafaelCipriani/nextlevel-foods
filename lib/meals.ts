import { Pool } from 'pg';
import slugify from 'slugify';
import xss from 'xss';

import { Meal } from '@/types/Meal';
import ImageKit from 'imagekit';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function isRepeatedSlug(slug: string): Promise<boolean> {
  const query = 'SELECT 1 FROM meals WHERE slug = $1 LIMIT 1';
  const values = [slug];
  const res = await pool.query(query, values);
  return (res.rowCount ?? 0) > 0;
}

export const getMeals = async (): Promise<Meal[]> => {
  try {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await pool.query('SELECT * FROM meals');
    return res.rows;
  } catch {
    throw new Error('Failed to fetch meal data. Please try again later.');
  }
};

export const getMeal = async (slug: string): Promise<Meal> => {
  try {
    const query = 'SELECT * FROM meals WHERE slug = $1';
    const values = [slug];
    const res = await pool.query(query, values);
    await new Promise((r) => setTimeout(r, 2000));
    return res.rows[0];
  } catch {
    throw new Error('Failed to fetch meal data. Please try again later.');
  }
};

export const saveMeal = async (
  meal: Meal & { imageFile?: File }
): Promise<void> => {
  try {
    meal.slug = slugify(meal.title, { lower: true });

    if (await isRepeatedSlug(meal.slug)) {
      meal.slug = slugify(`${meal.title}-${Date.now()}`, { lower: true });
    }

    meal.instructions = xss(meal.instructions);

    if (!meal.imageFile) {
      throw new Error('Image file is missing or could not be processed.');
    }

    const extension = meal.imageFile.name.split('.').pop();
    const fileName = `${meal.slug}-${Date.now()}.${extension}`;
    const arrayBuffer = await meal.imageFile.arrayBuffer();
    const bufferedImage = Buffer.from(arrayBuffer);

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });

    const uploadResult = await imagekit.upload({
      file: bufferedImage,
      fileName,
      folder: 'images',
      useUniqueFileName: true,
      isPrivateFile: false,
    });

    if (!uploadResult || !uploadResult.url) {
      throw new Error('Image upload failed. Please try again later.');
    }

    meal.image = uploadResult.url;

    await new Promise((r) => setTimeout(r, 2000));

    const query = `
      INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        instructions = EXCLUDED.instructions,
        creator = EXCLUDED.creator,
        creator_email = EXCLUDED.creator_email,
        image = EXCLUDED.image
    `;

    const values = [
      meal.title,
      meal.summary,
      meal.instructions,
      meal.creator,
      meal.creator_email,
      meal.image,
      meal.slug,
    ];

    await pool.query(query, values);
  } catch {
    throw new Error('Failed to save meal data. Please try again later.');
  }
};
