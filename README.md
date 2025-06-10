# 🐍 Twitter-Clone Backend

A Node.js + Express + MongoDB backend powering a Twitter-clone API, featuring:

- User authentication (signup, login) with JWT
- Tweet creation, update, delete
- Likes and comments (separate Comment model)
- Pagination for tweets and comments (infinite-scroll friendly)
- User analytics (tweets made, likes given, comments made)
- Admin routes for user management and analytics
- Error handling, validation, and security best practices

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- MongoDB (local or Atlas)
- (Optional) Postman for testing APIs

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/DigpalSinghPanwar/tweetapp.git
   cd tweetapp
   ```

2. **Install dependencies**

   ```bash
    npm install
   ```

3. **Create a `config.env` file**

   ```bash
   NODE_ENV=development
   PORT=8000
   DATABASE_URL=your_mongodb_connection_string
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   JWT_COOKIE_EXPIRES_IN=30
   ```

4. **Run the server**
   ```bash
   npm start
   ```

### Testing the API

You can use Postman or any API client to test the endpoints.

---

🗂️ Project Structure

├── controllers/ # Request handlers
├── models/ # Mongoose schemas (User, Tweet, Comment)
├── routes/ # Express routes
├── utils/ # Pagination, error handlers, auth utilities
├── middleware/ # protect, restrictTo, error catcher
├── config.env # Environment variables (not committed)
├── package.json # Project metadata and dependencies
├── README.md # Project documentation
├── app.js # Express app setup
├── .github # GitHub workflows for CI/CD
├── .gitignore # Files to ignore in git
├── .dockerignore # Files to ignore in Docker builds
├── Dockerfile # Dockerfile for containerization
└── server.js # Server bootstrap

---

📘 API Endpoints

Auth Routes

- POST /api/v1/auth/signup - Register a new user
- POST /api/v1/auth/login - Login existing user

Tweet Routes

- GET /api/v1/tweets - Get all tweets with pagination
- GET /api/v1/tweets/:id - Get a specific tweet
- POST /api/v1/tweets - Create a new tweet
- PATCH /api/v1/tweets/:id - Update tweet (owner only)
- DELETE /api/v1/tweets/:id - Delete tweet (owner only)

Comment Routes

- GET /api/v1/comments/:tweetId - Get comments for a tweet
- POST /api/v1/comments/:tweetId - Add comment to a tweet

Like Routes

- Get /api/v1/tweets/:id/like - Like/Unlike a tweet

Analytics Routes

- GET /api/v1/users/:id/analytics - Get user analytics

Note: All routes except auth routes require JWT authentication token in the Authorization header.
Query Parameters:

- page: Page number for pagination
- limit: Number of items per page

---

🔮 Future Enhancements

Real-time updates with WebSockets

Message resource and endpoints

Rate limiting & caching for performance

End-to-end and integration tests

---

📄 License & Contact

MIT License.

Built by Digpal Singh Panwar.

Feel free to connect on LinkedIn - https://www.linkedin.com/in/digpal-singh-panwar-875b551b0
