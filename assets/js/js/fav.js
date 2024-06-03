var TableActions = {
    init: function () {
        this.fetchFavorites();
        this.bindFavoriteToggle();
    },

    fetchFavorites: function () {
        var userId = Utils.get_from_localstorage('user').id;
        RestClient.get(`/favorite/${userId}`, function (response) {
            TableActions.populateTable(response);
        }, function (error) {
            console.error('Error loading favorites:', error);
        });
    },

    populateTable: function (assets) {
        const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        assets?.forEach((asset, index) => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="./assets/images/coin-${asset.asset_id}.svg" alt="${asset.name}"/></td>
                <td>${asset.name}</td>
                <td class="text-warning">${asset.current_price}</td>
                <td class="text-warning">${asset.supply}</td>
                <td class="text-warning">${asset.market_cap}</td>
                <td class="text-success">%${(asset.percent_change_24h || '0').slice(0, asset.percent_change_24h?.startsWith('-') ? 6 : 5)}<i class="fa fa-arrow-${asset.percent_change_24h < 0 ? 'down' : 'up'}"></i></td>
                <td class="text-success"><i class="${asset.is_favorited ? 'fas' : 'far'} fa-heart" style="font-size: large;" data-asset-id="${asset.asset_id}"></i></td>
            `;
        });
    },

    bindFavoriteToggle: function () {
        var self = this; // Store a reference to the TableActions object
        document.getElementById('dataTable').addEventListener('click', function (event) {
            if (event.target.classList.contains('fa-heart')) {
                const heartIcon = event.target;
                const assetId = heartIcon.dataset.assetId;
                const userId = Utils.get_from_localstorage('user').id;
                const method = heartIcon.classList.contains('fas') ? 'DELETE' : 'POST';
                const url = `/favorite/${userId}/${assetId}`;

                RestClient.request(url, method, {}, function(response) {
                    heartIcon.classList.toggle('fas');
                    heartIcon.classList.toggle('far');
                    self.populateTable();
                }, function(error) {
                    console.error('Error toggling favorite:', error);
                });
            }
        });
    }
};

