var TableManager = {
    init: function () {
        this.loadCryptoData();
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
            })
            .catch(error => console.error('Error loading the crypto data:', error));
    },

    populateTable: function (assets) {
        const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        assets.forEach((asset, index) => {
            console.log(asset);
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
    
            if (method === 'POST') {
                _this.addFavorite(userId, assetId);
            } else {
                _this.removeFavorite(userId, assetId);
            }
            heartIcon.toggleClass('fas far');
        });
    },
    
    addFavorite: function (userId, assetId) {
        fetch(`http://localhost:8888/BlockWatch/rest/favorite/${userId}/${assetId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (!response.ok) throw new Error('Failed to add favorite');
            console.log('Added to favorites');
        }).catch(error => {
            console.error('Error adding favorite:', error);
        });
    },

    removeFavorite: function (userId, assetId) {
        fetch(`http://localhost:8888/BlockWatch/rest/favorite/${userId}/${assetId}`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) throw new Error('Failed to remove favorite');
            console.log('Removed from favorites');
        }).catch(error => {
            console.error('Error removing favorite:', error);
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

};
