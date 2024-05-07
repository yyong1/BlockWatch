var TableActions = {
  init: function() {
      document.addEventListener("DOMContentLoaded", this.setupRowClick.bind(this));
      $(document).ready(this.setupChartDisplay.bind(this));
      this.setupLocalStorage();
      this.populateTableFromStorage();
      this.setupFavoriteToggle();
  },
  setupRowClick: function() {
      var rows = document.querySelectorAll("#dataTable tbody tr");
      rows.forEach(function(row) {
          row.addEventListener("click", function() {
              var rowData = Array.from(row.children).map(function(cell) {
                  return cell.textContent.trim();
              });
              alert("Clicked row #" + rowData[0] + "\nName: " + rowData[2] + "\nSymbol: " + rowData[3]);
          });
      });
  },
  setupChartDisplay: function() {
      $("#dataTable tbody tr").click(function() {
          var name = $(this).find("td:eq(2)").text().trim();
          $("#fav_tvchart_detail").text(name);
          $("#fav_tvchart").hide();
          setTimeout(function() {
              $("#fav_tvchart").show();
          }, 1000);
      });
  },
  setupLocalStorage: function() {
      if (!localStorage.getItem("favorites")) {
          localStorage.setItem("favorites", JSON.stringify({}));
      }
  },
  populateTableFromStorage: function() {
      var data = JSON.parse(localStorage.getItem("favorites")) || {};
      var tbody = document.querySelector("#dataTable tbody");
      tbody.innerHTML = "";
      Object.keys(data).forEach(function(rowKey, index) {
          var rowData = data[rowKey];
          var row = `<tr data-index="${index}">
                        <td>${index + 1}</td>
                        <td><img src="${rowData.col1}"></td>
                        <td>${rowData.col2}</td>
                        <td class="text-warning">${rowData.col3}</td>
                        <td class="text-warning">${rowData.col4}</td>
                        <td class="text-warning">${rowData.col5}</td>
                        <td class="text-success">${rowData.col6}<i class="fa fa-arrow-up"></i></td>
                        <td class="text-success"><i class="fa fa-heart" style="font-size: large;"></i></td>
                    </tr>`;
          tbody.innerHTML += row;
      });
  },
  setupFavoriteToggle: function() {
      var self = this;
      document.querySelector("#dataTable").addEventListener("click", function(event) {
          if (event.target.classList.contains("fa-heart")) {
              var name = event.target.closest("tr").querySelector("td:nth-child(3)").textContent.trim();
              var rowIndex = name.replace(/\s+/g, '-').toLowerCase();
              var data = JSON.parse(localStorage.getItem("favorites")) || {};
              event.target.classList.toggle("far");
              event.target.classList.toggle("fas");
              var rowData = data[rowIndex];
              if (rowData) {
                  delete data[rowIndex];
              } else {
                  rowData = {
                      name: event.target.closest("tr").querySelector("td:nth-child(2)").textContent.trim(),
                      symbol: event.target.closest("tr").querySelector("td:nth-child(3)").textContent.trim(),
                      price: event.target.closest("tr").querySelector("td:nth-child(4)").textContent.trim(),
                      supply: event.target.closest("tr").querySelector("td:nth-child(5)").textContent.trim(),
                      marketCap: event.target.closest("tr").querySelector("td:nth-child(6)").textContent.trim(),
                      percent: event.target.closest("tr").querySelector("td:nth-child(7)").textContent.trim()
                  };
                  data[rowIndex] = rowData;
              }
              localStorage.setItem("favorites", JSON.stringify(data));
              self.populateTableFromStorage();
              console.log("Table repopulated from localStorage.");
          }
      });
  }
};

// Initialize the TableActions object
TableActions.init();
