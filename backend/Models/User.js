import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    profilePic: { type: String }
});

const User = mongoose.model('user', userSchema);
export default User;

