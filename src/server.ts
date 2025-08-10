import app from './app.js';
import connectDB from './config/database.js';
import config from './config/env.js';

app.listen(config.port, () => {
  connectDB();
  console.log(`Server is running on port ${config.port}`);
});
