// Manages interactions with the data table
var TableManager = {
  init: function () {
      this.loadCryptoData(); // Load data when initializing
      this.bindTableInteractions();
      this.bindSearch();
  },

  loadCryptoData: function () {
      fetch('http://localhost:8888/BlockWatch/rest/assets/')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
          })
          .then(data => {
              this.populateTable(data);
              this.loadFavorites(); // Load favorites after data is populated
          })
          .catch(error => console.error('Error loading the crypto data:', error));
  },

  populateTable: function (assets) {
      const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
      tbody.innerHTML = ''; // Clear existing entries

      assets.forEach((asset, index) => {
          const row = tbody.insertRow();
          console.log(asset);
            row.innerHTML = `
              <td>${index + 1}</td>
              <td><img src="./assets/images/coin-${asset.asset_id}.svg" alt="${asset.name}"/></td>
              <td>${asset.name}</td>
              <td class="text-warning">${asset.current_price || 0}</td>
              <td class="text-warning">${asset.supply || 0}</td>
              <td class="text-warning">${asset.market_cap || 0}</td>
              <td class="text-success">% ${(asset.percent_change_24h || '0').slice(0, asset.percent_change_24h?.startsWith('-') ? 6 : 5)} <i class="fa fa-arrow-${(asset.percent_change_24h || '0').slice(0, 1) === '-' ? 'down' : 'up'}"></i></td>
              <td class="text-success"><i class="fa-regular fa-heart" style="font-size: large;"></i></td>
            `;
      });
  },

  bindTableInteractions: function () {
      var _this = this;
      $(document).on('click', '#dataTable tbody tr', function () {
          var name = $(this).find("td:eq(2)").text().trim();
          var id = name.replace(/\s+/g, '-').toLowerCase();
          var rowData = {};

          $(this).find("td").each(function (index, el) {
              if (index > 0) {
                  rowData["col" + index] = $(el).text().trim();
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
  },

  toggleLocalStorage: function (id, rowData) {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || {};
      if (favorites[id]) {
          delete favorites[id];
      } else {
          favorites[id] = rowData;
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};
