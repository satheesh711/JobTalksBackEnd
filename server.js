const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();  

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection failed:', err.message));

app.use(bodyParser.json());
app.use(cors());
app.use(cors({
  origin: ['https://job-talks.vercel.app', 'https://your-render-app.onrender.com'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));


const usersRoutes = require('./routes/users');
const companiesRoutes = require('./routes/companies');

app.use('/users', usersRoutes);
app.use('/companies', companiesRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the JobTalks API');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
