import mongoose, { Schema } from "mongoose";

const conceptSchema = new Schema({
    category: {type: String, enum: ['Productos', 'Servicios', 'Productos y Servicios'], required: true},
    name: {type: String, maxlength: 50, unique: true, required: true},
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
});

const Concept = mongoose.model('concept', conceptSchema);
export default Concept;
