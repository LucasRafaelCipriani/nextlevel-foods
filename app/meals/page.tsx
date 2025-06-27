import { Suspense } from 'react';
import Link from 'next/link';

import { getMeals } from '@/lib/meals';
import MealsGrid from '@/components/meals/meals-grid';
import classes from './page.module.css';

const Meals: React.FC = async () => {
  const meals = await getMeals();

  return (
    <main className={classes.main}>
      <MealsGrid meals={meals} />
    </main>
  );
};

const MealsPage: React.FC = () => {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{' '}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It is easy and fun!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <Suspense fallback={<p className={classes.loading}>Fetching Meals...</p>}>
        <Meals />
      </Suspense>
    </>
  );
};

export default MealsPage;
