
import dotenv from 'dotenv';
import { S3Client } from "@aws-sdk/client-s3";
import { Redis } from "@upstash/redis";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
 // Create OpenAI client within the method to avoid 'this' binding issues
 const apiKey = process.env.OPEN_API_KEY;
 if (!apiKey) {
     console.error('OpenAI API key is missing');
        throw new Error('OpenAI API key is missing');
 }
 
 
// Environment variables with defaults
export const AWS_REGION = process.env.AWS_REGION || "us-east-1";
export const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "dovaai"; // Fixed typo in env var name


export const s3Client = new S3Client({
     region: AWS_REGION 
    });
export const API_KEY = process.env.MAIL_KEY

 // Redis client setup
export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
// Initialize Google AI with Imagen 4
export const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
});