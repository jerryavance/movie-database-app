# movie-database-app
Welcome to the movie-database-app wiki!
This repository contains the codebase for the implementation of a simple personal movie database in Express.js. The application allows users to search for movies and add them to their personal movie database. The application also allows users to view the details of a movie and delete a movie from their database.

## Getting Started

These instructions will help you set up and run the application locally for development and testing purposes.

### Prerequisites

To run this project, you need to have the following software installed on your machine:

- Node.js
- npm
- Express.js

### Installing

1.  Clone the repository to your local machine:

        git clone https://github.com/jerryavance/movie-database-app.git

2.  Change into the project directory:

    cd movie-database-app

3.  Install the project dependencies:
    npm install

### Configuration

Create a new database preferably using MySQL running on XAMPP. 
In the folder "db" you can find the SQL neccesary to create the database tables.

Open the server.js file and update the following configuration options:

    // MySQL database connection
    const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username', // MySQL username
    password: 'your_password', // MySQL password
    database: 'movie_database',
    });

If necessary, modify other configuration options in the file according to your project requirements.

### Running the Application

To start the application locally, run the following command:

    npm start

The application will be accessible at http://localhost:3000/ in your browser.

### Contributing

I welcome contributions to enhance the movie database app. If you'd like to contribute, please follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix:
   git checkout -b feature/your-feature-name
3. Make your changes and commit them with descriptive commit messages.

4. Push your changes to your forked repository.

5. Submit a pull request, explaining the changes you made and their purpose.
