var TableActions = {
    init: function () {
        this.fetchFavorites();
        this.bindFavoriteToggle();
    },

    fetchFavorites: function () {
        userId = Utils.get_from_localstorage('user').id;
        fetch(`http://localhost:8888/BlockWatch/rest/favorite/${userId}`)
            .then(response => response.json())
            .then(data => this.populateTable(data))
            .catch(error => console.error('Error loading favorites:', error));
    },

    populateTable: function (assets) {
        const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        assets.forEach((asset, index) => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="./assets/images/coin-${asset.asset_id}.svg" alt="${asset.name}"/></td>
                <td>${asset.name}</td>
                <td class="text-warning">${asset.current_price}</td>
                <td class="text-warning">${asset.supply}</td>
                <td class="text-warning">${asset.market_cap}</td>
                <td class="text-success">%${(asset.percent_change_24h || '0').slice(0, asset.percent_change_24h?.startsWith('-') ? 6 : 5)}<i class="fa fa-arrow-${asset.percent_change_24h < 0 ? 'down' : 'up'}"></i></td>
                <td class="text-success"><i class="fas fa-heart" style="font-size: large;" data-asset-id="${asset.asset_id}"></i></td>
            `;
        });
    },

    bindFavoriteToggle: function () {
        document.getElementById('dataTable').addEventListener('click', function (event) {
            if (event.target.classList.contains('fa-heart')) {
                const heartIcon = event.target;
                const assetId = heartIcon.dataset.assetId;
                const method = heartIcon.classList.contains('fas') ? 'DELETE' : 'POST';
                const url = `http://localhost:8888/BlockWatch/rest/favorite/${assetId}`;
                
                fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to toggle favorite');
                    heartIcon.classList.toggle('fas');
                    heartIcon.classList.toggle('far');
                })
                .catch(error => console.error('Error toggling favorite:', error));
            }
        });
    }
};
