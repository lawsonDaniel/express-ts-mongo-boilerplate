// src/server.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import router from './routes/api';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { Database } from './db';
import { YupToOpenApiConverter } from './util/yupToOpenApi';
import { AuthValidation } from './validations/authValidation';

dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Generate OpenAPI components from Yup schemas
const authSchemas = YupToOpenApiConverter.generateComponents(
  AuthValidation.getAllSchemas()
);

// Set up Swagger options with auto-generated schemas
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'template API',
      version: '1.0.0',
      description: 'This is the server for template'
    },
    ...authSchemas, // Merge auto-generated schemas
    // You can also define response schemas
    components: {
      ...authSchemas.components,
      schemas: {
        ...authSchemas.components.schemas,
        // Add common response schemas
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
apis: ['./src/routes/**/*.ts'], // Path to the API docs
};

app.use(cors({
  origin: ['http://localhost:3000'], // Allow frontend port
}));

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", router);

// Define a sample route
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

// Database connection
const db = Database.getInstance();
db.connect();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});