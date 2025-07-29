import app from './app';
import config from './config/config';

const PORT = process.env.PORT || 3000;

app.listen(config.port, () => {
  console.log(`Server is running on port ${PORT}`);
});
