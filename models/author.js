//author has a first, family, dob, and dod
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name : {type: String, required: true, maxLength: 100},
  family_name : {type: String, required: true, maxLength : 100},
  date_of_birth: {type: Date},
  date_of_death: {type: Date},
});


// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});


//virtual for url
AuthorSchema.virtual("url").get(function () {
  
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("lifespan").get( function (){
  date_of_birth = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(this.date_of_birth)

  date_of_death = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(this.date_of_death)

  return `(${date_of_birth} - ${date_of_death})`
})


module.exports = mongoose.model("Author", AuthorSchema)