'use strict';

const fs = require('fs');
const path = require('path');

// Load JSON data files
const loadJSONData = (filename) => {
  const filePath = path.join(__dirname, '..', 'scripts', 'seed-data', filename);
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('🎮 Starting database seeding...');

      // 1. Seed Genres
      console.log('📚 Seeding genres...');
      const genresData = loadJSONData('genres.json');
      const genres = genresData.genres.map(genre => ({
        id: genre.id,
        genre_name: genre.genreName,
        created_at: new Date(),
        updated_at: new Date()
      }));
      await queryInterface.bulkInsert('genres', genres);
      console.log(`✅ Inserted ${genres.length} genres`);

      // 2. Seed Companies
      console.log('🏢 Seeding companies...');
      const companiesData = loadJSONData('companies.json');
      const companies = companiesData.companies.map(company => ({
        id: company.id,
        name: company.name,
        country: company.country,
        founded_year: company.foundedYear,
        company_type: company.companyType,
        created_at: new Date(),
        updated_at: new Date()
      }));
      await queryInterface.bulkInsert('companies', companies);
      console.log(`✅ Inserted ${companies.length} companies`);

      // 3. Seed Users
      console.log('👤 Seeding users...');
      const usersData = loadJSONData('users.json');
      const users = usersData.users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        registration_date: user.registrationDate,
        created_at: new Date(),
        updated_at: new Date()
      }));
      await queryInterface.bulkInsert('users', users);
      console.log(`✅ Inserted ${users.length} users`);

      // 4. Seed Games
      console.log('🎮 Seeding games...');
      const gamesData = loadJSONData('games.json');
      const games = gamesData.games.map(game => ({
        id: game.id,
        title: game.title,
        description: game.description,
        genre_id: game.genreId,
        platform: game.platform,
        release_date: game.releaseDate,
        developer_id: game.developerId,
        publisher_id: game.publisherId,
        created_at: new Date(),
        updated_at: new Date()
      }));

      // Insert games in batches to avoid memory issues
      const batchSize = 50;
      for (let i = 0; i < games.length; i += batchSize) {
        const batch = games.slice(i, i + batchSize);
        await queryInterface.bulkInsert('games', batch);
        console.log(`  Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(games.length/batchSize)}`);
      }
      console.log(`✅ Inserted ${games.length} games`);

      // 5. Seed Reviews
      console.log('⭐ Seeding reviews...');
      const reviewsData = loadJSONData('reviews.json');

      // Filter out duplicate game/user combinations
      const seenCombos = new Set();
      const reviews = reviewsData.reviews.filter(review => {
        const combo = `${review.gameId}-${review.userId}`;
        if (seenCombos.has(combo)) {
          return false;
        }
        seenCombos.add(combo);
        return true;
      }).map(review => ({
        id: review.id,
        game_id: review.gameId,
        user_id: review.userId,
        rating_score: review.ratingScore,
        review_text: review.reviewText,
        review_date: review.reviewDate,
        created_at: new Date(),
        updated_at: new Date()
      }));

      // Insert reviews in batches
      for (let i = 0; i < reviews.length; i += batchSize) {
        const batch = reviews.slice(i, i + batchSize);
        await queryInterface.bulkInsert('user_reviews', batch);
        if (i % 200 === 0) {
          console.log(`  Inserted ${i + batch.length}/${reviews.length} reviews`);
        }
      }
      console.log(`✅ Inserted ${reviews.length} reviews`);

      // 6. Seed Images
      console.log('🖼️ Seeding images...');
      const imagesData = loadJSONData('images.json');
      const images = imagesData.images.map(image => ({
        id: image.id,
        image_url: image.imageUrl,
        image_type: image.imageType,
        created_at: new Date(),
        updated_at: new Date()
      }));

      // Insert images in batches
      for (let i = 0; i < images.length; i += batchSize) {
        const batch = images.slice(i, i + batchSize);
        await queryInterface.bulkInsert('images', batch);
        if (i % 200 === 0) {
          console.log(`  Inserted ${i + batch.length}/${images.length} images`);
        }
      }
      console.log(`✅ Inserted ${images.length} images`);

      // 7. Seed Image Relations (simplified - only link images that exist)
      console.log('🔗 Seeding image relations...');
      const imageRelationsData = loadJSONData('imageRelations.json');

      // Filter to only include relations for images that actually exist (1-1038)
      const validImageRelations = imageRelationsData.imageRelations
        .filter(relation => relation.imageId <= images.length)
        .map(relation => ({
          id: relation.id,
          image_id: relation.imageId,
          related_type: relation.relatedType,
          related_id: relation.relatedId,
          created_date: relation.createdDate,
          created_at: new Date(),
          updated_at: new Date()
        }));

      // Insert image relations in batches
      for (let i = 0; i < validImageRelations.length; i += batchSize) {
        const batch = validImageRelations.slice(i, i + batchSize);
        await queryInterface.bulkInsert('image_relations', batch);
        if (i % 200 === 0) {
          console.log(`  Inserted ${i + batch.length}/${validImageRelations.length} image relations`);
        }
      }
      console.log(`✅ Inserted ${validImageRelations.length} image relations`);

      // Reset sequences to continue from the max ID
      console.log('🔄 Resetting sequences...');
      const tables = ['genres', 'companies', 'users', 'games', 'user_reviews', 'images', 'image_relations'];
      for (const table of tables) {
        await queryInterface.sequelize.query(
          `SELECT setval('${table}_id_seq', (SELECT MAX(id) FROM ${table}));`
        );
      }

      console.log('\n🎉 Database seeding completed successfully!');
      console.log('📊 Final counts:');
      console.log(`  - Genres: ${genres.length}`);
      console.log(`  - Companies: ${companies.length} (20 publishers, 80 developers)`);
      console.log(`  - Users: ${users.length}`);
      console.log(`  - Games: ${games.length}`);
      console.log(`  - Reviews: ${reviews.length}`);
      console.log(`  - Images: ${images.length}`);
      console.log(`  - Image Relations: ${validImageRelations.length}`);

    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Delete in reverse order of foreign key dependencies
    await queryInterface.bulkDelete('image_relations', null, {});
    await queryInterface.bulkDelete('images', null, {});
    await queryInterface.bulkDelete('user_reviews', null, {});
    await queryInterface.bulkDelete('games', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('companies', null, {});
    await queryInterface.bulkDelete('genres', null, {});
  }
};