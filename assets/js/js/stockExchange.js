// Declare variables only if they haven't been defined before
if (typeof chartProperties === 'undefined') {
  var chartProperties = {
    width: 350,
    height: 100,
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    }
  };
}

if (typeof domElement === 'undefined') {
  var domElement = document.getElementById('tvchart');
}

if (typeof chart === 'undefined') {
  var chart = LightweightCharts.createChart(domElement, chartProperties);
}

if (typeof candleSeries === 'undefined') {
  var candleSeries = chart.addCandlestickSeries();
}

function fetchDataAndSetCandlestickData() {
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

fetchDataAndSetCandlestickData();

$(document).ready(function() {
  // Function to toggle value in local storage
  function toggleLocalStorage(id, rowData) {
    // Get current favorites from local storage
    let favorites = JSON.parse(localStorage.getItem("favorites")) || {};

    // Check if ID is already in favorites
    if (favorites[id]) {
      // ID is already in favorites, so remove it
      delete favorites[id];
    } else {
      // ID is not in favorites, so add it
      favorites[id] = rowData;
    }

    // Save updated favorites to local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  // Function to load favorites from local storage and update heart icons
  function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    for (const id in favorites) {
      if (favorites.hasOwnProperty(id)) {
        // Toggle heart icon based on the ID
        $("#" + id).find(".fa-heart").toggleClass("far fas");
      }
    }
  }

  // Click event listener for rows
  $("#dataTable tbody tr").click(function() {
    var name = $(this).find("td:eq(2)").text().trim(); // Get the name from column 2
    var id = name.replace(/\s+/g, '-').toLowerCase(); // Generate ID based on name
    
    var rowData = {};

    // Get all data from the clicked row
    $(this).find("td").each(function(index, el) {
      if (index > 0) { // Skip first two columns
        if (index == 1) { // Check if it's the image column
          rowData["col" + index] = $(el).find("img").attr("src").trim(); // Get image URL
        } else {
          rowData["col" + index] = $(el).text().trim();
        }
      }
    });

    // Toggle heart icon
    $(this).find(".fa-heart").toggleClass("far fas");

    // Toggle value in local storage
    toggleLocalStorage(id, rowData);
  });

  // Load favorites when the document is ready
  loadFavorites();
});
$(document).ready(function() {
  $("#dataTable tbody tr").click(function() {
    var name = $(this).find("td:eq(2)").text().trim();
    $("#tvchart_detail").text(name);
    $("#tvchart").hide();
    setTimeout(function() {
      $("#tvchart").show();
    }, 1000);
  });
});

$(document).ready(function() {
    $("#search-filter").on("keyup", function() {
        var searchText = $(this).val().toLowerCase(); // Get the search text
        $("#dataTable tbody tr").each(function() { // Loop through each row of the table
            var nameText = $(this).find("td:nth-child(3)").text().toLowerCase(); // Get the name in the third column
            if (nameText.indexOf(searchText) === -1) { // Check if the name contains the search text
                $(this).hide(); // Hide the row if the name doesn't match the search text
            } else {
                $(this).show(); // Show the row if the name matches the search text
            }
        });
    });
});



$(document).ready(function() {
  function loadFavorites() {
    //console.log("start");
      const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
      //console.log(favorites);
      $("#dataTable tbody tr").each(function() {
          const name = $(this).find("td:eq(2)").text().trim(); // Get the name from column 2
          //console.log(name);
          if (favorites[name.toLowerCase()]) {
              $(this).find(".fa-heart").addClass("fas").removeClass("far");
          }
      });
  }

  loadFavorites();
});
