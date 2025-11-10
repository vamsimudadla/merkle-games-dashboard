const validateGameInput = (req, res, next) => {
  const { title, genre_id } = req.body;

  if (!title || !genre_id) {
    return res.status(400).json({
      error: 'Title and genre_id are required fields'
    });
  }

  next();
};

const validateReviewInput = (req, res, next) => {
  const { game_id, rating_score } = req.body;

  if (!game_id || rating_score === undefined) {
    return res.status(400).json({
      error: 'game_id and rating_score are required fields'
    });
  }

  if (rating_score < 0 || rating_score > 10) {
    return res.status(400).json({
      error: 'rating_score must be between 0 and 10'
    });
  }

  next();
};

const validatePaginationParams = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      error: 'Invalid pagination parameters'
    });
  }

  req.pagination = {
    page,
    limit,
    offset: (page - 1) * limit
  };

  next();
};

module.exports = {
  validateGameInput,
  validateReviewInput,
  validatePaginationParams
};