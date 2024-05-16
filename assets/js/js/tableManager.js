var TableManager = {
    init: function () {
        this.loadCryptoData();
        this.bindTableInteractions();
        this.bindSearch();
    },

    loadCryptoData: function () {
        RestClient.get('/assets', function (data) {
            TableManager.populateTable(data);
        });
    },

    populateTable: function (assets) {
        const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        assets.forEach((asset, index) => {
            const favoritedClass = asset.is_favorited ? 'fas' : 'far';
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="./assets/images/coin-${asset.asset_id}.svg" alt="${asset.name}"/></td>
                <td>${asset.name}</td>
                <td class="text-warning">${asset.current_price || 0}</td>
                <td class="text-warning">${asset.supply || 0}</td>
                <td class="text-warning">${asset.market_cap || 0}</td>
                <td class="text-success">% ${(asset.percent_change_24h || '0').slice(0, asset.percent_change_24h?.startsWith('-') ? 6 : 5)} <i class="fa fa-arrow-${(asset.percent_change_24h || '0').slice(0, 1) === '-' ? 'down' : 'up'}"></i></td>
                <td class="text-success"><i class="${favoritedClass} fa-heart" style="font-size: large;" data-asset-id="${asset.asset_id}"></i></td>
            `;
        });
    },

    bindTableInteractions: function () {
        var _this = this;
        $(document).on('click', '#dataTable tbody tr .fa-heart', function (event) {
            event.stopPropagation();
            var heartIcon = $(this);
            var assetId = heartIcon.data('asset-id');
            var userId = Utils.get_from_localstorage('user').id;
            var method = heartIcon.hasClass('fas') ? 'DELETE' : 'POST';
    
            RestClient.request(`/favorite/${userId}/${assetId}`, method, {}, function(response) {
                console.log(method === 'POST' ? 'Added to favorites' : 'Removed from favorites');
                heartIcon.toggleClass('fas far');
            }, function(error) {
                console.error('Error toggling favorite:', error);
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
    }
};
