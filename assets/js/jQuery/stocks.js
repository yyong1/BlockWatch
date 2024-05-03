// chartModule.js
const ChartModule = (function() {
    // Private variables and functions
    const chartProperties = {
      width: 1500,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      }
    };
  
    const domElement = document.getElementById('tvchart');
    const chart = LightweightCharts.createChart(domElement, chartProperties);
    const candleSeries = chart.addCandlestickSeries();
  
    // Public function to fetch and set candlestick data
    function setCandlestickData() {
      fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000`)
        .then(res => res.json())
        .then(data => {
          const cdata = data.map(d => {
            return {
              time: d[0] / 1000,
              open: parseFloat(d[1]),
              high: parseFloat(d[2]),
              low: parseFloat(d[3]),
              close: parseFloat(d[4])
            };
          });
          candleSeries.setData(cdata);
        })
        .catch(err => console.log(err)); // Using console.log directly
    }
  
    // Return public functions/variables
    return {
      setCandlestickData: setCandlestickData
    };
  })();
  