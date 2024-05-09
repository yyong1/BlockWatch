var Chart = {
    chartProperties: {
        width: 350,
        height: 100,
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        }
    },

    init: function () {
        this.initChart();
        this.bindTableInteractions();
        this.bindSearch();
        this.loadFavorites();
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
            .catch(err => console.error(err));
    },

    bindTableInteractions: function () {
        var _this = this;
        $(document).on('click', '#dataTable tbody tr', function () {
            var name = $(this).find("td:eq(2)").text().trim();
            var id = name.replace(/\s+/g, '-').toLowerCase();

            var rowData = {};
            $(this).find("td").each(function (index, el) {
                if (index > 0) {
                    if (index === 1) {
                        rowData["col" + index] = $(el).find("img").attr("src").trim();
                    } else {
                        rowData["col" + index] = $(el).text().trim();
                    }
                }
            });

            $(this).find(".fa-heart").toggleClass("far fas");
            _this.toggleLocalStorage(id, rowData);
            $("#tvchart_detail").text(name);
            $("#tvchart").fadeOut(100, function () {
                $(this).fadeIn(100);
            });
        });
    },

    toggleLocalStorage: function (id, rowData) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || {};
        if (favorites[id]) {
            delete favorites[id];
        } else {
            favorites[id] = rowData;
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
    },

    bindSearch: function () {
        $("#search-filter").on("keyup", function () {
            var searchText = $(this).val().toLowerCase();
            $("#dataTable tbody tr").filter(function () {
                $(this).toggle($(this).find("td:nth-child(3)").text().toLowerCase().indexOf(searchText) > -1);
            });
        });
    },

    loadFavorites: function () {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
        $("#dataTable tbody tr").each(function () {
            const name = $(this).find("td:eq(2)").text().trim().toLowerCase();
            if (favorites[name]) {
                $(this).find(".fa-heart").addClass("fas").removeClass("far");
            }
        });
    }
};