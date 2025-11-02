# Socialy

<p align="center">
  A modern social media platform built with NestJS, TypeScript, and PostgreSQL
</p>

## Features

- **User Management**: Registration, authentication, and profile management
- **JWT Authentication**: Secure token-based authentication with Passport.js
- **Follow System**: Users can follow/unfollow each other
- **Password Security**: Bcrypt hashing for secure password storage
- **Database**: PostgreSQL with TypeORM for data persistence
- **API Documentation**: Auto-generated documentation with Compodoc
- **Testing**: Comprehensive unit and e2e tests with Jest
- **Docker Support**: Containerized development and deployment

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL, TypeORM
- **Authentication**: JWT, Passport.js (Local & Google OAuth)
- **Security**: Bcrypt password hashing
- **Testing**: Jest, Supertest
- **Documentation**: Compodoc
- **DevOps**: Docker, GitHub Actions CI/CD

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm
- PostgreSQL
- Docker (optional)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Configure the following variables in your `.env` file:

```bash
# Environment
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=socialy_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Development

```bash
# Start development server
pnpm run start:dev

# Run with Docker
docker-compose -f docker-compose.dev.yaml up
```

### Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

### Production

```bash
# Build for production
pnpm run build

# Start production server
pnpm run start:prod

# Deploy with Docker
docker-compose up
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Users
- `GET /users` - Get all users (with pagination)
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Follow System
- `POST /follow` - Follow a user
- `DELETE /follow/:id` - Unfollow a user
- `GET /follow/followers/:userId` - Get user's followers
- `GET /follow/following/:userId` - Get users being followed

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management
├── follow/         # Follow system
├── configs/        # Configuration files
├── utils/          # Shared utilities
└── main.ts         # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
