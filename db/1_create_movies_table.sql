-- Create the movie database
CREATE DATABASE IF NOT EXISTS movie_database;

-- Use the movie database
USE movie_database;

-- Create the "movies" table
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    plot TEXT,
    release_date DATE,
    personal_rating FLOAT,
    notes TEXT,
    thumbnail_url VARCHAR(255)
);

-- Create a stored procedure to add a movie
DELIMITER //
CREATE PROCEDURE AddMovie(
    IN movie_title VARCHAR(255),
    IN movie_genre VARCHAR(255),
    IN movie_plot TEXT,
    IN movie_release_date DATE,
    IN movie_personal_rating FLOAT,
    IN movie_notes TEXT,
    IN movie_thumbnail_url VARCHAR(255)
)
BEGIN
    INSERT INTO movies (title, genre, plot, release_date, personal_rating, notes, thumbnail_url)
    VALUES (movie_title, movie_genre, movie_plot, movie_release_date, movie_personal_rating, movie_notes, movie_thumbnail_url);
END;
//
DELIMITER ;

-- Create a stored procedure to update a movie
DELIMITER //
CREATE PROCEDURE UpdateMovie(
    IN movie_id INT,
    IN movie_title VARCHAR(255),
    IN movie_genre VARCHAR(255),
    IN movie_plot TEXT,
    IN movie_release_date DATE,
    IN movie_personal_rating FLOAT,
    IN movie_notes TEXT,
    IN movie_thumbnail_url VARCHAR(255)
)
BEGIN
    UPDATE movies
    SET title = movie_title, genre = movie_genre, plot = movie_plot, release_date = movie_release_date,
        personal_rating = movie_personal_rating, notes = movie_notes, thumbnail_url = movie_thumbnail_url
    WHERE id = movie_id;
END;
//
DELIMITER ;

-- Create a stored procedure to delete a movie by ID
DELIMITER //
CREATE PROCEDURE DeleteMovie(movie_id INT)
BEGIN
    DELETE FROM movies WHERE id = movie_id;
END;
//
DELIMITER ;

-- Create a stored procedure to retrieve all movies
DELIMITER //
CREATE PROCEDURE GetAllMovies()
BEGIN
    SELECT * FROM movies;
END;
//
DELIMITER ;
