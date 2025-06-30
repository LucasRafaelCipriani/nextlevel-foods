import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Image, ImageKitProvider } from '@imagekit/next';

import classes from './page.module.css';
import { getMeal } from '@/lib/meals';

interface MealPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: MealPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const meal = await getMeal(slug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
};

const MealPage: React.FC<MealPageProps> = async ({ params }) => {
  const { slug } = await params;
  const meal = await getMeal(slug);

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <ImageKitProvider urlEndpoint={process.env.IMAGEKIT_URL_ENDPOINT}>
            <Image
              src={meal.image}
              alt={meal.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </ImageKitProvider>
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{ __html: meal.instructions }}
        ></p>
      </main>
    </>
  );
};

export default MealPage;
