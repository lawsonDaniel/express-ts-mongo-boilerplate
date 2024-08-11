import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import router from './routes/api';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;

// Set up Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Oga Promo Admin',
      version: '1.0.0',
      description: 'A simple API'
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};
const dbconnectionString: string = process.env.DB_CONNECTION_STRING as string 
mongoose.connect(dbconnectionString).then((res)=>{
  console.log("database connected")
}).catch((err)=>{
  console.log("error from database connection",err)
})

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// parse application/json
app.use(bodyParser.json())
// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1",router)
// Define a sample route
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
