/*
npm install sqlite3 sqlite

SwatiBD42-CW/
└── BD4.2_CW/
    ├── initDB.js
    └── other-files.js

stay at root directory (default shell location /home/runner/SwatiBD42-CW ) and run below

//Run initDB.js to create and populate the database:
node BD4.2_CW/initDB.js
Start the Express server:
node BD4.2_CW/index.js -> dont use start button, use shell( ctrl + c to stop server )
*/

const express = require("express"); // Express framework for creating the web server
const sqlite3 = require("sqlite3").verbose(); // SQLite3 library for database operations
const { open } = require("sqlite"); // SQLite library for async database operations
/*
open from sqlite: A utility to open SQLite databases with async support.
*/

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000;
let db; // Variable to hold the database connection

// Connect to SQLite database
/*
This IIFE (Immediately Invoked Function Expression) asynchronously opens a connection to the SQLite database and assigns it to the db variable.
*/
(async () => {
  // Open a connection to the SQLite database
  db = await open({
    filename: "./BD4.2_CW/database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("Connected to the SQLite database.");
})();
// Root endpoint for testing the server
app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.2 - CW - SQL Queries & try-catch" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: Get all movies

Wrap the database call in a try/catch block to handle errors.

If no movies are found return 404 error

If some error happens while reading database return 500 error

Otherwise send 200 status & the data

API Call

http://localhost:3000/movies

Expected Output

{
   movies: [... All the movies in DB]
}
*/

// function to get all movies
async function getAllMovies() {
  try {
    let query = "SELECT * FROM movies";
    if (!db) throw new Error("Database not connected");
    let response = await db.all(query, []);
    if (response.length === 0) throw new Error("No movies found");
    console.log(response);
    return { movies: response };
  } catch (error) {
    console.log("Error in fetching movie ", error.message);
    throw error;
  }
}

// API endpoint to get all movies
app.get("/movies", async (req, res) => {
  try {
    let response = await getAllMovies();
    res.status(200).json(response);
  } catch (error) {
    if (error.message === "No movies found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 2: Fetch movies by genre

Wrap the database call in a try/catch block to handle errors.

If no movies by genre are found return 404 error

If some error happens while reading database return 500 error

Otherwise send 200 status & the data

API Call

http://localhost:3000/movies/genre/Biography

Expected Output

{
  movies: [
    {
      id: 1,
      title: 'Dangal',
      director: 'Nitesh Tiwari',
      genre: 'Biography',
      release_year: 2016,
      rating: 4.8,
      actor: 'Aamir Khan',
      box_office_collection: 220,
    },
    {
      id: 6,
      title: 'Sanju',
      director: 'Rajkumar Hirani',
      genre: 'Biography',
      release_year: 2018,
      rating: 4.4,
      actor: 'Ranbir Kapoor',
      box_office_collection: 120,
    },
  ],
}
*/

// function to get movies by genre
async function getMoviesByGenre(genre) {
  let query = "SELECT * FROM movies Where genre = ?";
  try {
    if (!db) throw new Error("Database not connected");
    let result = await db.all(query, [genre]); // Execute the query with the genre parameter
    if (!result || result.length == 0) {
      throw new Error("No movies found with given genre");
    }
    return { movies: result };
  } catch (error) {
    console.log("Error in fetching movie of given genre => ", error.message);
    throw error;
  }
}

// API endpoint to get movies by genre
app.get("/movies/genre/:genre", async (req, res) => {
  try {
    let response = await getMoviesByGenre(req.params.genre);
    res.status(200).json(response);
  } catch (error) {
    if (error.message === "No movies found with given genre") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 3: Fetch movie by ID

Wrap the database call in a try/catch block to handle errors.

If no movie by ID is found return 404 error

If some error happens while reading database return 500 error

Otherwise send 200 status & the data

API Call

http://localhost:3000/movies/details/2

Expected Output

{
  movie: {
    id: 2,
    title: 'Baahubali 2: The Conclusion',
    director: 'S.S. Rajamouli',
    genre: 'Action',
    release_year: 2017,
    rating: 4.7,
    actor: 'Prabhas',
    box_office_collection: 181,
  },
}
*/

// function to get movie by id
async function getMovieById(id) {
  let query = "SELECT * FROM movies Where id = ?";
  try {
    if (!db) throw new Error("Database not connected");
    let result = await db.all(query, [id]); // Execute the query with the id parameter
    if (!result || result.length == 0) {
      throw new Error("No movies found with given ID");
    }
    return { movie: result };
  } catch (error) {
    console.log("Error in fetching movie of given id => ", error.message);
    throw error;
  }
}

// API endpoint to get movie by id
app.get("/movies/details/:id", async (req, res) => {
  try {
    let response = await getMovieById(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    if (error.message === "No movies found with given ID") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 4: Fetch movies by release year

Wrap the database call in a try/catch block to handle errors.

If no movies by release year are found return 404 error

If some error happens while reading database return 500 error

Otherwise send 200 status & the data

API Call

http://localhost:3000/movies/release-year/2015

Expected Output

{
  movies: [
    {
      id: 4,
      title: 'Bajrangi Bhaijaan',
      director: 'Kabir Khan',
      genre: 'Drama',
      release_year: 2015,
      rating: 4.5,
      actor: 'Salman Khan',
      box_office_collection: 130,
    },
  ],
}
*/

// function to get movies by release year
async function getMoviesByReleaseYear(year) {
  let query = "SELECT * FROM movies Where release_year = ?";
  try {
    if (!db) throw new Error("Database not connected");
    let result = await db.all(query, [year]); // Execute the query with the year parameter
    if (!result || result.length == 0) {
      throw new Error("No movies found with given release year");
    }
    return { movies: result };
  } catch (error) {
    console.log(
      "Error in fetching movie of given release year => ",
      error.message,
    );
    throw error;
  }
}

// API endpoint to get movies by release year
app.get("/movies/release-year/:year", async (req, res) => {
  try {
    let response = await getMoviesByReleaseYear(req.params.year);
    res.status(200).json(response);
  } catch (error) {
    if (error.message === "No movies found with given release year") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
