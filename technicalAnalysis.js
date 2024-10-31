const technicalAnalysis = {
    calculateEMA(data, period) {
        const multiplier = 2 / (period + 1);
        let ema = data[0].c;
        
        return data.map((candle, i) => {
            if (i === 0) return ema;
            ema = (candle.c - ema) * multiplier + ema;
            return ema;
        });
    },

    calculateRSI(data, period = 7) {
        let gains = 0;
        let losses = 0;
        const rsiData = [];

        for (let i = 1; i < period; i++) {
            const change = data[i].c - data[i - 1].c;
            if (change >= 0) {
                gains += change;
            } else {
                losses -= change;
            }
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;

        for (let i = period; i < data.length; i++) {
            const change = data[i].c - data[i - 1].c;
            if (change >= 0) {
                avgGain = (avgGain * (period - 1) + change) / period;
                avgLoss = (avgLoss * (period - 1)) / period;
            } else {
                avgGain = (avgGain * (period - 1)) / period;
                avgLoss = (avgLoss * (period - 1) - change) / period;
            }

            const rs = avgGain / avgLoss;
            const rsi = 100 - (100 / (1 + rs));
            rsiData.push(rsi);
        }

        return rsiData;
    },

    calculateMACD(data, fastPeriod = 5, slowPeriod = 13, signalPeriod = 3) {
        const fastEMA = this.calculateEMA(data, fastPeriod);
        const slowEMA = this.calculateEMA(data, slowPeriod);
        const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
        const signalLine = this.calculateEMA(macdLine.map(m => ({ c: m })), signalPeriod);
        
        return {
            macdLine,
            signalLine,
            histogram: macdLine.map((macd, i) => macd - signalLine[i])
        };
    },

    analyzeCandlePatterns(data) {
        const patterns = {
            engulfing: false,
            doji: false,
            pinBar: false,
            threeInside: false
        };

        const current = data[data.length - 1];
        const previous = data[data.length - 2];
        const twoPrevious = data[data.length - 3];

        patterns.engulfing = (
            Math.abs(current.c - current.o) > Math.abs(previous.c - previous.o) &&
            ((current.c > current.o && previous.c < previous.o) || 
             (current.c < current.o && previous.c > previous.o))
        );

        patterns.doji = Math.abs(current.c - current.o) <= Math.abs(current.h - current.l) * 0.1;

        const upperWick = current.h - Math.max(current.o, current.c);
        const lowerWick = Math.min(current.o, current.c) - current.l;
        const body = Math.abs(current.c - current.o);
        patterns.pinBar = (upperWick > body * 2 || lowerWick > body * 2);

        patterns.threeInside = (
            Math.abs(twoPrevious.c - twoPrevious.o) > Math.abs(previous.c - previous.o) &&
            previous.h <= twoPrevious.h &&
            previous.l >= twoPrevious.l &&
            ((current.c > previous.h && twoPrevious.c < twoPrevious.o) ||
             (current.c < previous.l && twoPrevious.c > twoPrevious.o))
        );

        return patterns;
    }
};

module.exports = technicalAnalysis;