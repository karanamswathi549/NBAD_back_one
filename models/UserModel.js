const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the User collection
const userSchema = new Schema({
    name: { type: String, required: true }, // Name of the user
    email: { type: String, required: true, unique: true }, // Email of the user (Assuming emails should be unique)
    password: { type: String, required: true }, // Password of the user
    dateCreated: { type: Date, default: Date.now, required: true }, // Date when the user was created
    dateUpdated: { type: Date, default: Date.now, required: true }, // Date when the user was last updated
    lastLogin: { type: Date }, // Date of the user's last login
    status: { type: String, default: 'active' }, // Status of the user (default: active)
    budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }] // Budgets associated with the user
});

// Create a model for the User collection
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
