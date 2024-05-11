import mongoose, {Schema} from "mongoose";

const PostSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    location: String,
    description: String,
    userPicturePath: String,
    picturePath: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
}, {timestamps: true});

const Post = mongoose.model("Post", PostSchema);
export default Post;