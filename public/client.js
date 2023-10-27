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

          initializeSortableList(); // Initialize the sortable list
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
      <div class="star-rating">
        ${getStarRatingHTML(movie.personal_rating)}
      </div>
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
  


// /////////////////////////////////////////////////////////////////////////////////////
// Add an event listener for the search input field
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', performSearch);

// Function to perform the search
function performSearch() {
  const query = searchInput.value.trim(); // Trim any leading/trailing whitespace

  // Make a GET request to search for movies based on the query
  fetch(`/search?query=${query}`) // Replace with your backend search route
    .then((response) => response.json())
    .then((data) => {
      displaySearchResults(data); // Display the search results
    })
    .catch((error) => console.error('Error searching movies:', error));
}

// Function to display search results
function displaySearchResults(searchResults) {
  const moviesContainer = document.querySelector('.movies-container');
  moviesContainer.innerHTML = ''; // Clear the container

  if (searchResults.length === 0) {
    // No movies match the search query, display a message
    moviesContainer.innerHTML = '<p>No matching movies found.</p>';
  } else {
    // Display the movie cards for matching results
    searchResults.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      moviesContainer.appendChild(movieCard);
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////
// Function to initialize the sortable list
function initializeSortableList() {
  const moviesContainer = document.querySelector('.movies-container');

  new Sortable(moviesContainer, {
    animation: 150, // Set the animation duration
    handle: '.movie-card', // Set the handle for dragging (optional)
    onEnd: () => {
      // This function is called when sorting ends
      // You can use this callback to update the movie order in the database
      updateMovieOrder();
    },
  });
}

// Function to update the movie order in the database
function updateMovieOrder() {
  const movieCards = document.querySelectorAll('.movie-card');
  const newOrder = Array.from(movieCards).map((movieCard) => movieCard.dataset.movieId);

  // Send the new order to the server
  fetch('/movies/order', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ order: newOrder }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Movie order updated
    })
    .catch((error) => console.error('Error updating movie order:', error));
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to initialize star rating
function initializeStarRating() {
  const starRating = document.querySelector('.star-rating');
  const stars = starRating.querySelectorAll('.star');
  const personalRatingInput = document.getElementById('personalRating');

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-rating'), 10);
      personalRatingInput.value = rating;
      updateStarRating(rating);
    });
  });
}

// Function to update the star rating display
function updateStarRating(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star) => {
    const starRating = parseInt(star.getAttribute('data-rating'), 10);
    if (starRating <= rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

// Call the initializeStarRating function when the page loads
initializeStarRating();

// Function to generate HTML for star rating display
function getStarRatingHTML(rating) {
  const maxRating = 5;
  let starHTML = '';

  for (let i = 1; i <= maxRating; i++) {
    if (i <= rating) {
      starHTML += '<span class="star selected">&#9733;</span>'; // You can replace &#9733; with your star icon
    } else {
      starHTML += '<span class="star">&#9733;</span>'; // You can replace &#9733; with your star icon
    }
  }

  return starHTML;
}


// Call getMovies when the page loads
window.addEventListener('load', getMovies);
