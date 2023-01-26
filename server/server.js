const express = require('express');
const connetDb = require('./config/db');
const userRoute = require('./routes/api/users');
const profileRoute = require('./routes/api/profile');
const authRoute = require('./routes/api/auth');
const postRoute = require('./routes/api/posts');

const app = express();

//connect to mongo db
connetDb();

//init midleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API running...'));

//Define routes
app.use('/api/users', userRoute);
app.use('/api/profile', profileRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});