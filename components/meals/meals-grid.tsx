import { Meal } from '@/types/Meal';
import MealItem from './meal-item';
import classes from './meals-grid.module.css';

const MealsGrid: React.FC<{ meals: Meal[] }> = ({ meals }) => {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
};

export default MealsGrid;
