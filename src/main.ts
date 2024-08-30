import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import router from './routes/api';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 3001;
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit to 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3002','https://ogapromo.vercel.app','https://ogapromoadmin.vercel.app'], // Allow frontend port
}));
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
