const mongoose = require('mongoose');

// Define the schema for the Category collection
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the category
    allocatedAmount: { type: Number, required: true }, // Allocated amount for the category
    spend: { type: Number, required: true }, // Amount spent in the category
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }], // Expenses associated with the category
});

// Create a model for the Category collection
const Category = mongoose.model('Category', categorySchema);

// Export the Category model
module.exports = Category;
