const mongoose = require('mongoose');

// Define the schema for the Budget collection
const budgetSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the budget
    totalAmount: { type: Number, required: true }, // Total amount allocated for the budget
    startDate: { type: Date, required: true }, // Start date of the budget
    endDate: { type: Date, required: true }, // End date of the budget
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Categories associated with the budget
});

// Create a model for the Budget collection
const Budget = mongoose.model('Budget', budgetSchema);

// Export the Budget model
module.exports = Budget;
