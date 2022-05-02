const fileSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, "Upload file must have a name"],
    }
},
)

const File = app.model("File", fileSchema);

module.exports = File;