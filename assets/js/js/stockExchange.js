var Chart = {
  chartProperties: {
      width: 350,
      height: 100,
      timeScale: {
          timeVisible: true,
          secondsVisible: false,
      }
  },
  domElement: document.getElementById('tvchart'),
  chart: LightweightCharts.createChart(this.domElement, this.chartProperties),
  candleSeries: this.chart.addCandlestickSeries(),
  fetchDataAndSetCandlestickData: function() {
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
              this.candleSeries.setData(cdata);
          })
          .catch(err => console.log(err)); // Using console.log directly
  },
  init: function() {
      this.fetchDataAndSetCandlestickData();
      this.setupFavorites();
      this.setupSearchFilter();
  },
  toggleLocalStorage: function(id, rowData) {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || {};
      if (favorites[id]) {
          delete favorites[id];
      } else {
          favorites[id] = rowData;
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
  },
  loadFavorites: function() {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
      for (const id in favorites) {
          if (favorites.hasOwnProperty(id)) {
              $("#" + id).find(".fa-heart").toggleClass("far fas");
          }
      }
  },
  setupFavorites: function() {
      $("#dataTable tbody tr").click(function() {
          var name = $(this).find("td:eq(2)").text().trim();
          var id = name.replace(/\s+/g, '-').toLowerCase();
          var rowData = {};
          $(this).find("td").each(function(index, el) {
              if (index > 0) {
                  if (index == 1) {
                      rowData["col" + index] = $(el).find("img").attr("src").trim();
                  } else {
                      rowData["col" + index] = $(el).text().trim();
                  }
              }
          });
          $(this).find(".fa-heart").toggleClass("far fas");
          ChartApp.toggleLocalStorage(id, rowData);
      });
      this.loadFavorites();
  },
  setupSearchFilter: function() {
      $("#search-filter").on("keyup", function() {
          var searchText = $(this).val().toLowerCase();
          $("#dataTable tbody tr").each(function() {
              var nameText = $(this).find("td:nth-child(3)").text().toLowerCase();
              if (nameText.indexOf(searchText) === -1) {
                  $(this).hide();
              } else {
                  $(this).show();
              }
          });
      });
  }
};

$(document).ready(function() {
  Chart.init();
});
