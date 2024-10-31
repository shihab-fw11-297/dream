const technicalAnalysis = require('./technicalAnalysis');

const analysis = {
    calculateSignalScore(data) {
        let score = 0;
        const current = data[data.length - 1];
        const previous = data[data.length - 2];

        const ema5 = technicalAnalysis.calculateEMA(data, 5);
        const ema10 = technicalAnalysis.calculateEMA(data, 10);
        const rsi = technicalAnalysis.calculateRSI(data);
        const macd = technicalAnalysis.calculateMACD(data);
        const patterns = technicalAnalysis.analyzeCandlePatterns(data);

        // Trend alignment
        if (ema5[ema5.length - 1] > ema10[ema10.length - 1] && current.c > previous.c) {
            score += 2;
        } else if (ema5[ema5.length - 1] < ema10[ema10.length - 1] && current.c < previous.c) {
            score += 2;
        }

        // Patterns
        if (patterns.engulfing || patterns.threeInside) score += 2;
        if (patterns.pinBar || patterns.doji) score += 1;

        // RSI
        const lastRSI = rsi[rsi.length - 1];
        if ((lastRSI > 40 && lastRSI < 60) && lastRSI > rsi[rsi.length - 2]) {
            score += 1;
        }

        // EMA alignment
        if (Math.abs(ema5[ema5.length - 1] - ema10[ema10.length - 1]) < 0.0002) {
            score -= 1;
        }

        // Conflicting signals
        if (macd.histogram[macd.histogram.length - 1] * macd.histogram[macd.histogram.length - 2] < 0) {
            score -= 2;
        }

        return {
            score,
            indicators: {
                ema5: ema5[ema5.length - 1],
                ema10: ema10[ema10.length - 1],
                rsi: lastRSI,
                // macd,
                patterns
            }
        };
    },

    getPrediction(data) {
        const analysis = this.calculateSignalScore(data);
        const current = data[data.length - 1];
        
        if (analysis.score >= 4) {
            return {
                signal: current.c > analysis.indicators.ema5 ? 'STRONG_BUY' : 'STRONG_SELL',
                score: analysis.score,
                confidence: 'HIGH',
                indicators: analysis.indicators
            };
        } else if (analysis.score >= 2) {
            return {
                signal: 'WEAK_' + (current.c > data[data.length - 2].c ? 'BUY' : 'SELL'),
                score: analysis.score,
                confidence: 'MEDIUM',
                indicators: analysis.indicators
            };
        }
        
        return {
            signal: 'NO_TRADE',
            score: analysis.score,
            confidence: 'LOW',
            indicators: analysis.indicators
        };
    }
};

module.exports = analysis;