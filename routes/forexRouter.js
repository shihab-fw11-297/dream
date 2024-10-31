const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require('../config');
const analysis = require('../analysis');

router.get('/predict', async (req, res) => {
    try {
        const response = await axios.get(`https://api.finazon.io/latest/finazon/forex/time_series?ticker=EUR/USD&interval=1m&page=0&page_size=300&apikey=18535cbd97e2400d93f96802097d83c9af`);

        const data = response.data.data;
        data.sort((a, b) => a.t - b.t);

        const prediction = analysis.getPrediction(data);

        res.json({
            prediction,
            currentPrice: data[data.length - 1].c,
            timestamp: new Date().toISOString(),
            metadata: {
                dataPoints: data.length,
                timeframe: '1m',
                lastUpdate: new Date(data[data.length - 1].t * 1000).toISOString()
            }
        });

    } catch (error) {
        console.error('Error analyzing forex data:', error);
        res.status(500).json({
            error: 'Failed to analyze forex data',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
