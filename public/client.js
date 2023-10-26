//GET Movies (Read)
// Function to retrieve and display movies
function getMovies() {
    fetch('/movies') // Replace with your backend route for retrieving movies
      .then((response) => response.json())
      .then((data) => {
        const moviesContainer = document.querySelector('.movies-container');
        moviesContainer.innerHTML = ''; // Clear the container

        if (data.length === 0) {
          // No movies available, display a message
          moviesContainer.innerHTML = '<p>No movies available.</p>';
        } else {
          // Display the movie cards
          data.forEach((movie) => {
            const movieCard = createMovieCard(movie);
            moviesContainer.appendChild(movieCard);
          });
        }
      })
      .catch((error) => console.error('Error fetching movies:', error));
}
  
  // Helper function to create a movie card
  function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.innerHTML = `
      <img src="${movie.thumbnail_url}" alt="${movie.title} Thumbnail">
      <h2>${movie.title}</h2>
      <p>Genre: ${movie.genre}</p>
      <p>Plot: ${movie.plot}</p>
      <p>Release Date: ${movie.release_date}</p>
      <p>Personal Rating: ${movie.personal_rating}</p>
      <p>Notes: ${movie.notes}</p>
      <button onclick="editMovie(${movie.id})">Edit</button>
      <button onclick="deleteMovie(${movie.id})">Delete</button>
    `;
  
    return movieCard;
  }


//POST Movies (Create)
// Function to add a new movie
function addMovie() {
    console.log('addMovie function called'); // Add this line
    // Retrieve data from the form fields
    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;
    const plot = document.getElementById('plot').value;
    const release_date = document.getElementById('releaseDate').value;
    const personal_rating = parseFloat(document.getElementById('personalRating').value);
    const notes = document.getElementById('notes').value;
    const thumbnail_url = document.getElementById('thumbnailUrl').value;

    // Check if the required fields are empty
    if (!title || !genre || !plot || !release_date || !personal_rating) {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Create a movieData object with the retrieved data
    const movieData = {
      title,
      genre,
      plot,
      release_date,
      personal_rating,
      notes,
      thumbnail_url,
    };
  
    // Make a POST request to add the new movie
    fetch('/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message); // Movie added
        getMovies(); // Refresh the movie list after adding
      })
      .catch((error) => console.error('Error adding a movie:', error));
  }
  

//PUT Movies (Update)
// Function to edit a movie
function editMovie(movieId) {
  // Fetch the movie details for editing
  fetch(`/movies/${movieId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Movie not found');
      }
      return response.json();
    })
    .then((movieData) => {
      openModal(true, movieData); // Open the modal for editing with the retrieved data
    })
    .catch((error) => {
      if (error.message === 'Movie not found') {
        alert('Movie not found. It may have been deleted.');
      } else {
        console.error('Error fetching movie details for editing:', error);
      }
    });
}

// Function to save changes to a movie
function saveChanges() {
  const movieId = document.getElementById('movieForm').getAttribute('data-movie-id');
  const title = document.getElementById('title').value;
  const genre = document.getElementById('genre').value;
  const plot = document.getElementById('plot').value;
  const release_date = document.getElementById('releaseDate').value;
  const personal_rating = parseFloat(document.getElementById('personalRating').value);
  const notes = document.getElementById('notes').value;
  const thumbnail_url = document.getElementById('thumbnailUrl').value;

  // Check if the required fields are empty
  if (!title || !genre || !plot || !release_date || !personal_rating) {
    alert('Please fill in all required fields.');
    return;
  }

  const movieData = {
    title,
    genre,
    plot,
    release_date,
    personal_rating,
    notes,
    thumbnail_url,
  };

  // Make a PUT request to update the movie
  fetch(`/movies/${movieId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movieData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Movie updated
      closeModal(); // Close the modal after updating
      getMovies(); // Refresh the movie list after updating
    })
    .catch((error) => console.error('Error updating a movie:', error));
}


//DELETE Movies (Delete)
// Function to delete a movie
function deleteMovie(movieId) {
    fetch(`/movies/${movieId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message); // Movie deleted
        getMovies(); // Refresh the movie list after deleting
      })
      .catch((error) => console.error('Error deleting a movie:', error));
  }

// Show the modal
function openModal(isEdit, movieData) {
    const modal = document.getElementById('movieModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitForm = document.getElementById('submitForm');
    const cancelEdit = document.getElementById('cancelEdit');
  
    if (isEdit) {
      // modalTitle.textContent = 'Edit Movie';
      // submitForm.textContent = 'Save Changes';
      // cancelEdit.style.display = 'block';

      modalTitle.textContent = 'Edit Movie';
      submitForm.style.display = 'none'; // Hide the "Add Movie" button
      saveChangesButton.style.display = 'block'; // Show the "Save Changes" button
      cancelEdit.style.display = 'block';
  
      // Populate the form with existing movie data for editing
      document.getElementById('title').value = movieData.title;
      document.getElementById('genre').value = movieData.genre;
      document.getElementById('plot').value = movieData.plot;
      document.getElementById('releaseDate').value = movieData.release_date;
      document.getElementById('personalRating').value = movieData.personal_rating;
      document.getElementById('notes').value = movieData.notes;
      document.getElementById('thumbnailUrl').value = movieData.thumbnail_url;
  
      // Attach a data-movie-id attribute to the form for identification
      document.getElementById('movieForm').setAttribute('data-movie-id', movieData.id);
    } else {
      // modalTitle.textContent = 'Add Movie';
      // submitForm.textContent = 'Add Movie';
      // cancelEdit.style.display = 'none';
      modalTitle.textContent = 'Add Movie';
      submitForm.style.display = 'block'; // Show the "Add Movie" button
      saveChangesButton.style.display = 'none'; // Hide the "Save Changes" button
      cancelEdit.style.display = 'none';

      document.getElementById('movieForm').removeAttribute('data-movie-id');
      document.getElementById('movieForm').reset();
    }
  
    modal.style.display = 'block';
  }
  
  // Close the modal
  function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
  }
  
  // Event listener to open the modal for adding a new movie
  const addMovieButton = document.getElementById('add-movie');
  //addMovieButton.addEventListener('click', addMovie);
  addMovieButton.addEventListener('click', () => openModal(false, null));

  // Event listener for the "Save Changes" button
  const saveChangesButton = document.getElementById('saveChangesButton');
  saveChangesButton.addEventListener('click', saveChanges);

  const submitMovieButton = document.getElementById('submitForm');
  submitMovieButton.addEventListener('click', addMovie);
  
  // Event listener to close the modal
  document.getElementById('closeModal').addEventListener('click', closeModal);
  
  // Event listener to cancel editing
  document.getElementById('cancelEdit').addEventListener('click', () => openModal(false, null));
  





// Call getMovies when the page loads
window.addEventListener('load', getMovies);
