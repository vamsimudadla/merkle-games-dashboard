const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { validatePaginationParams } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - title
 *         - genre_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the game
 *         title:
 *           type: string
 *           description: The game title
 *         description:
 *           type: string
 *           description: Game description
 *         genre_id:
 *           type: integer
 *           description: Genre ID
 *         platform:
 *           type: string
 *           description: Supported platforms
 *         release_date:
 *           type: string
 *           format: date
 *           description: Release date
 *         developer_id:
 *           type: integer
 *           description: Developer company ID
 *         publisher_id:
 *           type: integer
 *           description: Publisher company ID
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Returns list of all games
 *     tags: [Games]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: integer
 *         description: Filter by genre ID
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *         description: Filter by platform
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in game titles
 *     responses:
 *       200:
 *         description: The list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 games:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get('/', validatePaginationParams, gameController.getAllGames);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get a game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game ID
 *     responses:
 *       200:
 *         description: The game details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 */
router.get('/:id', gameController.getGameById);

/**
 * @swagger
 * /games/{id}/stats:
 *   get:
 *     summary: Get game statistics (average rating, total reviews)
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game ID
 *     responses:
 *       200:
 *         description: Game statistics
 *       404:
 *         description: Game not found
 */
router.get('/:id/stats', gameController.getGameStats);


module.exports = router;