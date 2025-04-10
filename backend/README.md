
# Islamic Games Backend

This is the backend API for the Islamic Games application, built with Express, TypeScript, and MongoDB.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Build for production: `npm run build`
6. Start production server: `npm start`

## Environment Variables

- `PORT`: The port the server will run on (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `NODE_ENV`: Environment (development, production)
- `FRONTEND_URL`: URL of the frontend application (for CORS)

## API Documentation

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `GET /api/auth/me`: Get current user info (requires authentication)

### Users

- `GET /api/users/profile/:id`: Get user profile
- `PUT /api/users/profile/:id`: Update user profile
- `DELETE /api/users/profile/:id`: Delete user account

### Games

- `GET /api/games`: Get all games
- `GET /api/games/:slug`: Get a game by slug
- `POST /api/games`: Create a new game (admin only)
- `PUT /api/games/:id`: Update a game (admin only)
- `DELETE /api/games/:id`: Delete a game (admin only)

### Progress

- `GET /api/progress`: Get user progress for all games
- `GET /api/progress/:gameSlug`: Get user progress for a specific game
- `PUT /api/progress/:gameSlug`: Update user progress for a game

### Word of the Day

- `GET /api/word-of-the-day/today`: Get the word of the day
- `GET /api/word-of-the-day/date/:date`: Get word for a specific date
- `POST /api/word-of-the-day`: Create a new word (admin only)
- `PUT /api/word-of-the-day/:id`: Update a word (admin only)
- `DELETE /api/word-of-the-day/:id`: Delete a word (admin only)

## Deployment

The backend can be deployed using Docker:

```bash
# Build the Docker image
docker build -t islamic-games-backend .

# Run the container
docker run -p 5000:5000 --env-file .env islamic-games-backend
```
