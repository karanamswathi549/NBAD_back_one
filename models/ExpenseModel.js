const mongoose = require('mongoose');

// Define the schema for the Expense collection
const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true }, // Description of the expense
    amount: { type: Number, required: true }, // Amount of the expense
    date: { type: Date, default: Date.now }, // Date of the expense
});

// Create a model for the Expense collection
const Expense = mongoose.model('Expense', expenseSchema);

// Export the Expense model
module.exports = Expense;
