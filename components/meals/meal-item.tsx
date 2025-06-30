import Link from 'next/link';
import { ImageKitProvider, Image } from '@imagekit/next';

import { Meal } from '@/types/Meal';
import classes from './meal-item.module.css';

const MealItem: React.FC<Meal> = ({ title, slug, image, summary, creator }) => {
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <ImageKitProvider urlEndpoint={process.env.IMAGEKIT_URL_ENDPOINT}>
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </ImageKitProvider>
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
};

export default MealItem;
