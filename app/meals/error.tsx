'use client';

const MealsError: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>{error.message}</p>
    </main>
  );
};

export default MealsError;
