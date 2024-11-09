const mongoose = require('mongoose');

// Define MongoDB Schema
const predictionSchema = new mongoose.Schema({
    prediction: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    metadata: {
        dataPoints: Number,
        timeframe: String,
        lastUpdate: Date
    }
}, { timestamps: true });

// Create MongoDB Model
const Prediction = mongoose.model('Prediction', predictionSchema);


module.exports = Prediction;