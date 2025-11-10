const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       required:
 *         - genreName
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the genre
 *         genreName:
 *           type: string
 *           description: The name of the genre
 */

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Returns list of all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: The list of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 */
router.get('/', genreController.getAllGenres);

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     summary: Get a genre by ID with associated games
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The genre ID
 *     responses:
 *       200:
 *         description: The genre details with games
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genre not found
 */
router.get('/:id', genreController.getGenreById);


module.exports = router;