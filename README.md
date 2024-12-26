# Node.js with Express, TypeScript, and MongoDB

A starter template for building backend applications using Node.js, Express, TypeScript, and MongoDB. This repository provides a solid foundation for creating scalable and maintainable server-side applications.

---

## Features

- **Node.js** for the runtime environment
- **Express.js** for building web APIs
- **TypeScript** for strong typing and improved developer experience
- **MongoDB** as the database
- Pre-configured **ESLint** and **Prettier** for code quality and consistency
- Built-in **dotenv** for environment variable management
- Modular folder structure for scalability

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Yarn](https://yarnpkg.com/) or npm

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/lawsonDaniel/express-ts-mongo-boilerplate
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/your-database-name
   ```

4. Run the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Access the API:
   The server will start on `http://localhost:3000`. You can test the API endpoints using tools like Postman or curl.

---

## Scripts

- **`yarn dev`**: Start the development server with live reloading
- **`yarn build`**: Compile TypeScript to JavaScript
- **`yarn start`**: Start the production server
- **`yarn lint`**: Run ESLint to analyze code
- **`yarn format`**: Format code using Prettier

---

## Folder Structure

```plaintext
src/
├── controller/    # Route handlers
├── middleware/    # Custom middleware
├── model/         # MongoDB models (schemas)
├── route/         # Application routes
├── service/       # Business logic
├── utils/          # Utility functions
├── main.ts       # Entry point
```

---

## Technologies Used

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB**
- **ESLint**
- **Prettier**
- **dotenv**

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
