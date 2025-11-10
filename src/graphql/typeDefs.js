const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Genre {
    id: ID!
    genreName: String!
    games: [Game]
    createdAt: String
    updatedAt: String
  }

  type Company {
    id: ID!
    name: String!
    country: String
    foundedYear: Int
    logo: String
    companyType: CompanyType!
    developedGames: [Game]
    publishedGames: [Game]
    createdAt: String
    updatedAt: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    registrationDate: String
    reviews: [Review]
    createdAt: String
    updatedAt: String
  }

  type Game {
    id: ID!
    title: String!
    description: String
    genre: Genre
    platform: String
    releaseDate: String
    developer: Company
    publisher: Company
    reviews: [Review]
    images: [Image]
    averageRating: Float
    totalReviews: Int
    createdAt: String
    updatedAt: String
  }

  type Review {
    id: ID!
    game: Game!
    user: User!
    ratingScore: Float!
    reviewText: String
    reviewDate: String
    createdAt: String
    updatedAt: String
  }

  type Image {
    id: ID!
    imageUrl: String!
    imageType: ImageType!
    relations: [ImageRelation]
    createdAt: String
    updatedAt: String
  }

  type ImageRelation {
    id: ID!
    image: Image!
    relatedType: RelatedType!
    relatedId: Int!
    createdDate: String
    createdAt: String
    updatedAt: String
  }


  type GameStats {
    id: ID!
    title: String!
    averageRating: Float
    totalReviews: Int
  }

  type PaginatedGames {
    games: [Game]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  enum CompanyType {
    Developer
    Publisher
  }

  enum ImageType {
    Screenshot
    Cover
    Artwork
  }

  enum RelatedType {
    Game
    Company
    Genre
    Rating
    User
  }


  type Query {
    # Games
    games(page: Int, limit: Int, genreId: ID, platform: String, search: String): PaginatedGames!
    game(id: ID!): Game
    gameStats(id: ID!): GameStats

    # Companies
    companies(type: CompanyType, country: String, search: String): [Company]!
    company(id: ID!): Company

    # Genres
    genres: [Genre]!
    genre(id: ID!): Genre

    # Reviews
    reviews(gameId: ID, userId: ID, minRating: Float, maxRating: Float): [Review]!
    review(id: ID!): Review

    # Users
    users: [User]!
    user(id: ID!): User

    # Images
    images(relatedType: RelatedType, relatedId: Int): [Image]!
    image(id: ID!): Image
  }
`;

module.exports = typeDefs;