const mongoose = require("mongoose")
const Schema = mongoose.Schema

const blogSchema = new Schema({
    tabu:{
        type: [],
        required:true
    }
},{timestamps: true})

const Blog = mongoose.model("Blog",blogSchema)
module.exports = Blog;