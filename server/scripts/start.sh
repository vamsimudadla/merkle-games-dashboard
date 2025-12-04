#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
while ! nc -z ${DB_HOST:-postgres} ${DB_PORT:-5432}; do
  sleep 1
done
echo "PostgreSQL is ready!"

echo "Running database migrations..."
npx sequelize-cli db:migrate

# Check if database is already seeded by querying the genres table directly
echo "Checking if database needs seeding..."

# Use psql via environment variables to check if genres table has data
GENRE_COUNT=$(PGPASSWORD=${DB_PASSWORD:-gamedb_pass} psql -h ${DB_HOST:-postgres} -U ${DB_USER:-postgres} -d ${DB_NAME:-gamedb} -t -c "SELECT COUNT(*) FROM genres;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$GENRE_COUNT" = "0" ] || [ -z "$GENRE_COUNT" ]; then
  echo "Database is empty (genre count: ${GENRE_COUNT:-0}). Seeding with sample data..."
  npx sequelize-cli db:seed:all
else
  echo "Database already has data (${GENRE_COUNT} genres). Skipping seed."
fi

echo "Starting the application..."
npm start &
APP_PID=$!

# Wait for application to start
sleep 10

# Run sanity tests if in development mode
if [ "${NODE_ENV:-development}" = "development" ]; then
    echo "🧪 Running sanity checks..."
    sh scripts/test-sanity.sh

    if [ $? -ne 0 ]; then
        echo "❌ Sanity checks failed. Stopping application."
        kill $APP_PID
        exit 1
    fi
fi

# Keep the application running
wait $APP_PID