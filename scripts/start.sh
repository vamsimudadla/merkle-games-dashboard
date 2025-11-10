#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
while ! nc -z ${DB_HOST:-postgres} ${DB_PORT:-5432}; do
  sleep 1
done
echo "PostgreSQL is ready!"

echo "Running database migrations..."
npx sequelize-cli db:migrate

# Check if database is already seeded by checking if genres table has data
echo "Checking if database needs seeding..."
GENRE_COUNT=$(npx sequelize-cli db:seed:status 2>/dev/null | grep -c "up" || echo "0")

if [ "$GENRE_COUNT" = "0" ]; then
  echo "Database is empty. Seeding with sample data..."
  npx sequelize-cli db:seed:all
else
  echo "Database already has data. Skipping seed."
fi

echo "Starting the application..."
npm start