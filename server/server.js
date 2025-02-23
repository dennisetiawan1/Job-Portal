import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebHooks } from './controllers/webhooks.js'

(async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize express
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Routes
    app.get('/', (req, res) => res.send("API Working"));
    app.get("/debug-sentry", function mainHandler(req, res) {
      throw new Error("My first Sentry error!");
    });
    app.post('/webhooks', clerkWebHooks);

    // Port
    const PORT = process.env.PORT || 5000;

    Sentry.setupExpressErrorHandler(app);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
})();
