const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoDB = "mongodb://127.0.0.1/my_db";

main().catch((err) => console.log(err));

async function main(){
  await mongoose.connect(mongoDB);
}