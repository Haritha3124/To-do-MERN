const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
connectDB();

// const __dirname = path.resolve();

const app = express();

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,            
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));  



app.use(session({ secret: 'session secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));


// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // const { match } = require('path-to-regexp');

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../frontend","build", 'index.html')
    )
  );
} 
else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
