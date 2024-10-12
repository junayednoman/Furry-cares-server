# Furry Cares Backend 🐾

Welcome to the **Furry Cares** backend repository! This project serves as the server-side part of the web application that provides APIs for user authentication, content management, and premium monetization for pet care tips and stories.

## Features ✨

- **User Authentication**: JWT-based authentication with secure login, registration, and token expiration.
- **Roles and Permissions**: Role-based access control for Users and Admins.
- **Content Management**: APIs for creating, updating, deleting, and fetching posts (Tips & Stories).
- **Premium Content Monetization**: Integration with payment gateways (Aamarpay, Stripe) for premium content access.
- **Commenting and Upvoting**: API endpoints for user interactions such as commenting and upvoting posts.
- **Advanced Search**: Full-text search and filtering based on categories or keywords.
- **Admin Controls**: API endpoints for managing users, posts, and premium subscriptions.

## Tech Stack 🛠️

- **Node.js**: JavaScript runtime for building the backend server.
- **Express**: Fast, minimal web framework for handling routes and middleware.
- **Mongoose**: MongoDB object modeling tool for managing database schemas and interactions.
- **JWT (JSON Web Tokens)**: For user authentication and secure API access.
- **Aamarpay**: Integrated payment gateways for handling transactions.
- **Cloudinary**: For image uploads and management (if needed for posts).

## Getting Started 🚀

### Prerequisites

- Node.js installed (v14 or later)
- MongoDB installed and running locally or using a cloud service like MongoDB Atlas

## Installation & Setup 🛠️

1. Clone the repository:
    ```sh
    https://github.com/junayednoman/Furry-Cares-Backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```
