require("./db/dbConnect");
const { Movies } = require("./model/movieModel");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Movies App!");
});

app.get("/movies", async (req, res) => {
  try {
    const allMovies = await Movies.find();
    res.status(200).json(allMovies);
  }catch(error) {
    res.status(500).json({ error: "Failed to fetch movies", details: error.message });
  }
});

app.post("/movies", async (req, res) => {
  const { title, director, genre } = req.body;
  try {
    const movieData = new Movies({ title, director, genre});
    await movieData.save();
    res.status(201).json({ message: "Movie added successfully", movie: movieData });                       
  }catch(error) {
    res.status(500).json({ error: "Failed to add movie", details: error.message });
  }
});

app.put("/movies/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  const updatedMovieData = req.body;
  try {
    const updatedMovie = await Movies.findByIdAndUpdate(movieId, updatedMovieData, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
  }catch(error) {
    res.status(500).json({ error: "Failed to update movie", details: error.message });
  }
});

app.delete("/movies/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const deletedMovie = await Movies.findByIdAndDelete(movieId);
    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully", movie: deletedMovie });
  }catch(error) {
    res.status(500).json({ error: "Failed to delete movie", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
