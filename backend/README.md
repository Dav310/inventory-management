# Inventory Management - Backend

Hey there! This is the backend for our Inventory Management system. It's the engine under the hood, handling all the API requests, talking to the database, and managing the core business logic.

We've tried to keep things clean and organized. If you have any questions, feel free to ask!

## What's inside?

Here's a quick rundown of what this backend is built with and what it does:

- **RESTful API**: Built with [Express.js](https://expressjs.com/) to provide clean and predictable endpoints for the frontend.
- **Built with TypeScript**: For type safety and a better development experience. No more `undefined is not a function` surprises!
- **Database**: We're using PostgreSQL for our data storage. It's reliable and powerful.
- **Authentication**: Secure authentication using JSON Web Tokens (JWT).
- **Asynchronous Messaging**: We've got KafkaJS integrated for handling asynchronous tasks and events, which helps keep things snappy.

## Getting Started

Ready to get this running on your machine? Here’s what you’ll need.

### Prerequisites

Make sure you have these installed before you start:

- Node.js (v18 or newer is recommended)
- pnpm (our package manager of choice)
- A running PostgreSQL instance.
- (Optional) A running Kafka instance if you want to test messaging features.

### Installation

1.  **Clone the repository** (if you haven't already).

2.  **Navigate to the backend directory**:

    ```bash
    cd backend
    ```

3.  **Install dependencies**:

    ```bash
    pnpm install
    ```

4.  **Set up your environment variables**:
    Copy the `.env.example` file to a new file named `.env` and fill in your details.

    ```bash
    # For Windows (Command Prompt)
    copy .env.example .env

    # For macOS/Linux
    cp .env.example .env
    ```

    Now, open the `.env` file and add your database URL, JWT secret, etc.

## Available Scripts

Once you're set up, you can use these scripts from the `package.json`:

- **`pnpm dev`**
  Starts the development server using `tsx` with watch mode. The server will automatically restart when you make changes to the code. This is what you'll use most of the time.

- **`pnpm build`**
  Compiles the TypeScript code to JavaScript and puts it in the `dist` directory. You'll need to run this before starting the app in production.

- **`pnpm start`**
  Starts the compiled app from the `dist` directory. This is for running the app in a production environment.

- **`pnpm hash`**
  A utility script to hash a password. Useful for creating test users or for debugging.

## API Endpoints

> **Note**: This section is a work in progress. Please help keep it updated!

Here are some of the main endpoints. For a full list, it's best to check the router files in `src/`.

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in and get a JWT.
- `GET /api/products` - Get a list of all products.
- ... (add more as we build them)

## Contributing

Got an idea or found a bug? Feel free to open an issue or submit a pull request. We appreciate all contributions!

---

