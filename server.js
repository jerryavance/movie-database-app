const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser'); // For parsing JSON data

const app = express();
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'movie-db', // Replace with your MySQL username
  password: 'environment', // Replace with your MySQL password
  database: 'movie_database',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + db.threadId);
});

// Handle CORS (Cross-Origin Resource Sharing) if your frontend is on a different domain
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Route to retrieve all movies
app.get('/movies', (req, res) => {
  const sql = 'SELECT * FROM movies';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Route to retrieve a single movie
app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const sql = 'SELECT * FROM movies WHERE id = ?';
  db.query(sql, [movieId], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
        res.json(result[0]);
    } else {
        res.status(404).json({ message: 'Movie not found' });
    }
  });
});

// Route to add a new movie
app.post('/movies', (req, res) => {
  const { title, genre, plot, release_date, personal_rating, notes, thumbnail_url } = req.body;
  const sql = 'INSERT INTO movies (title, genre, plot, release_date, personal_rating, notes, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, genre, plot, release_date, personal_rating, notes, thumbnail_url], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Movie added', id: result.insertId });
  });
});

// Route to update a movie
app.put('/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const { title, genre, plot, release_date, personal_rating, notes, thumbnail_url } = req.body;
  const sql = 'UPDATE movies SET title = ?, genre = ?, plot = ?, release_date = ?, personal_rating = ?, notes = ?, thumbnail_url = ? WHERE id = ?';
  db.query(sql, [title, genre, plot, release_date, personal_rating, notes, thumbnail_url, movieId], (err) => {
    if (err) throw err;
    res.json({ message: 'Movie updated' });
  });
});

// Route to delete a movie
app.delete('/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const sql = 'DELETE FROM movies WHERE id = ?';
  db.query(sql, [movieId], (err) => {
    if (err) throw err;
    res.json({ message: 'Movie deleted' });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
