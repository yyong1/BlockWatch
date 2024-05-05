document.addEventListener("DOMContentLoaded", function() {
  // Get all table rows
  var rows = document.querySelectorAll("#dataTable tbody tr");

  // Add click event listener to each row
  rows.forEach(function(row, index) {
    row.addEventListener("click", function() {
      // Get data from the clicked row
      var rowData = Array.from(row.children).map(function(cell) {
        return cell.textContent.trim();
      });

      // Create and show the alert
      alert("Clicked row #" + rowData[0] + "\nName: " + rowData[2] + "\nSymbol: " + rowData[3]);
    });
  });
});
$(document).ready(function() {
  $("#dataTable tbody tr").click(function() {
    var name = $(this).find("td:eq(2)").text().trim();
    $("#fav_tvchart_detail").text(name);
    $("#fav_tvchart").hide();
    setTimeout(function() {
      $("#fav_tvchart").show();
    }, 1000);
  });
});

function populateTableFromStorage() {

    let data = JSON.parse(localStorage.getItem("favorites")) || [];


    let tbody = document.querySelector("#dataTable tbody");

    tbody.innerHTML = "";

    Object.keys(data).forEach(function(rowKey, index) {
      let rowData = data[rowKey];
      let row = `<tr data-index="${index}">
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
    
};

populateTableFromStorage();

document.querySelector("#dataTable").addEventListener("click", function(event) {
    if (event.target.classList.contains("fa-heart")) {
        var name = $(this).find("td:eq(2)").text().trim();
        var rowIndex = name.replace(/\s+/g, '-').toLowerCase();
        
        let data = JSON.parse(localStorage.getItem("favorites")) || [];

        event.target.classList.toggle("far");
        event.target.classList.toggle("fas");

        let rowData = data[rowIndex];
        if (rowData) {
            delete data[rowIndex];
        } else {
            rowData = {
                name: event.target.closest("tr").querySelector("td:nth-child(2)").textContent,
                symbol: event.target.closest("tr").querySelector("td:nth-child(3)").textContent,
                price: event.target.closest("tr").querySelector("td:nth-child(4)").textContent,
                supply: event.target.closest("tr").querySelector("td:nth-child(5)").textContent,
                marketCap: event.target.closest("tr").querySelector("td:nth-child(6)").textContent,
                percent: event.target.closest("tr").querySelector("td:nth-child(7)").textContent
            };
            data[rowIndex] = rowData;
        };

        localStorage.setItem("favorites", JSON.stringify(data));

        populateTableFromStorage();
        console.log("Table repopulated from localStorage.");
    };
});