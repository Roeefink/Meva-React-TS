import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Load environment variables
import path from 'path';

// Load environment variables from the root of the API service
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://roeefink.github.io'], // Add mobile app URL schemes here later
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/v1', routes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});