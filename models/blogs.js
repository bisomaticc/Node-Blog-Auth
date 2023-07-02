const mongoose = require('mongoose');
const blogsSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    content:{
        type: String,
        required: true
    }
})
const blog = mongoose.model('blog',blogsSchema);
module.exports=blog;