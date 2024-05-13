var ChartManager = {
    chartProperties: {
        width: 350,
        height: 100,
        timeScale: {
            timeVisible: true,
            secondsVisible: false
        }
    },

    init: function () {
        this.initChart();
    },

    initChart: function () {
        var domElement = document.getElementById('tvchart');
        if (domElement) {
            var chart = LightweightCharts.createChart(domElement, this.chartProperties);
            var candleSeries = chart.addCandlestickSeries();
            this.fetchDataAndSetCandlestickData(candleSeries);
        }
    },

    fetchDataAndSetCandlestickData: function (candleSeries) {
        fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000`)
            .then(res => res.json())
            .then(data => {
                const cdata = data.map(d => ({
                    time: d[0] / 1000,
                    open: parseFloat(d[1]),
                    high: parseFloat(d[2]),
                    low: parseFloat(d[3]),
                    close: parseFloat(d[4])
                }));
                candleSeries.setData(cdata);
            })
            .catch(err => console.error('Error fetching candlestick data:', err));
    }
};
