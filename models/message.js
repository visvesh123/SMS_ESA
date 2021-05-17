import mongoose from 'mongoose'





const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    from: {
        type: Number,
        required: true,
    },
    to: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});


const MessageModel  = mongoose.model("message", MessageSchema);

export { MessageModel}