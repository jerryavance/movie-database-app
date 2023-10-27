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
  user: 'movie-db', // MySQL username
  password: 'environment', // MySQL password
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


// Route to search movies by title
app.get('/search', (req, res) => {
    const query = req.query.query; // Get the search query from the URL
    const sql = 'SELECT * FROM movies WHERE title LIKE ?'; // Adjust your SQL query for searching by title
    const searchQuery = `%${query}%`; // Add '%' before and after the query to perform a partial match
  
    db.query(sql, [searchQuery], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });

  

// Add a new route to handle movie order updates
app.put('/movies/order', (req, res) => {
    const newOrder = req.body.order; // The new movie order received from the client
  
    // Update the database with the new movie order
    updateMovieOrderInDatabase(newOrder);
  
    res.json({ message: 'Movie order updated' });
  });

// // Function to update the movie order in the database
// function updateMovieOrderInDatabase(newOrder) {
//     // Loop through the new order array and update the order of each movie in the database
//     newOrder.forEach((movieId, index) => {
//       const sql = 'UPDATE movies SET `order` = ? WHERE id = ?';
//       db.query(sql, [index, movieId], (err) => {
//         if (err) throw err;
//       });
//     });
//   }

  
function updateMovieOrderInDatabase(newOrder) {
    // Loop through the new order array and update the order of each movie in the database
    newOrder.forEach((movieId, index) => {
      const sql = 'UPDATE movies SET order_column = ? WHERE id = ?';
      db.query(sql, [index, movieId], (err) => {
        if (err) throw err;
      });
    });
  }
  
  



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
