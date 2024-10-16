const Genre = require("../models/genre");
const Book = require("../models/book");
const Author = require("../models/author");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({name : "asc"}).exec()
  res.render(
    "genre_list", {title : "Genre List", genre_list : allGenres}
  )
});


// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksinGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, "title summary").exec(), //get all book records associated with genre ID
  ]);


  if (genre === null){
    const err = new Error("Book genre not found!")
    err.status = 404;
    return next(err);
  }


  res.render("genre_detail", {
    title : "Genre detail",
    genre: genre,
    genre_books: booksinGenre,
  });
});


exports.genre_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, and add to book.
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("book_form", {
    title: "Create Book",
    authors: allAuthors,
    genres: allGenres,
  });
});


// Array of middleware functions to be executed in order(create genre through form)
exports.genre_create_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min:3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name })

    if(!errors.isEmpty()){
      //pass errors to view, if any.
      res.render("genre_form", {title: "Create Genre", genre: genre, errors: errors.array()});
      return;
    }else{
      const genreExists = await Genre.findOne({ name: req.body.name })
      .collation({ locale: "en", strength: 2 })
      .exec();

      if(genreExists){
        //if genre already exists,redirect to url, else create a new one, add to db ,then redirect.
        res.redirect(genreExists.url);
      }else{
        await genre.save();
        res.redirect(genre.url);
      }
    }    
  }),  
];



exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT iMPLEMENTED: Genre delete GET")
});


exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});


exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Promise.all([Genre.findById(req.params.id).exec()]);

  if(genre === null){
    err = new Error("Genre not found!");
    err.status = 404;
    return next(err);
  }

  res.render("genre_form",{
    genre : genre,
  })
});


exports.genre_update_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min:3 })
    .escape(),

  asyncHandler(async (req, res, next) =>{
    const errors = validationResult(req);

    const genre = new Genre({
      name : req.body.name,
      _id: req.params.id,
    })

    if(!errors.isEmpty()){
      const genre = await Promise.all([Genre.findById(req.params.id).exec()])
      
      res.render("genre_form", {
        genre: genre,
        errors : errors.array(),
      })
      return;
    }else{
      const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre);
      res.redirect(updatedGenre.url);
    }

  })
]