/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config/config.env' });

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
    console.log('Database connected!');
  }
);

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.listen(process.env.PORT || 2020, (req, res) => {
  console.log(`server is up and running on port ${process.env.PORT || 2020}`);
});
