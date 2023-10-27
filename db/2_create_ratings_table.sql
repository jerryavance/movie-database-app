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

-- Create the "ratings" table
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    source VARCHAR(255),
    rating FLOAT,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Create a stored procedure to add a rating
DELIMITER //
CREATE PROCEDURE AddRating(
    IN movie_id INT,
    IN source VARCHAR(255),
    IN rating FLOAT
)
BEGIN
    INSERT INTO ratings (movie_id, source, rating)
    VALUES (movie_id, source, rating);
END;
//
DELIMITER ;

-- Create a stored procedure to update a rating
DELIMITER //
CREATE PROCEDURE UpdateRating(
    IN rating_id INT,
    IN rating FLOAT
)
BEGIN
    UPDATE ratings
    SET rating = rating
    WHERE id = rating_id;
END;
//
DELIMITER ;

-- Create a stored procedure to delete a rating by ID
DELIMITER //
CREATE PROCEDURE DeleteRating(rating_id INT)
BEGIN
    DELETE FROM ratings WHERE id = rating_id;
END;
//
DELIMITER ;

-- Create a stored procedure to retrieve all ratings for a movie
DELIMITER //
CREATE PROCEDURE GetRatingsForMovie(movie_id INT)
BEGIN
    SELECT * FROM ratings WHERE movie_id = movie_id;
END;
//
DELIMITER ;
