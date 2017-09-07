let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;