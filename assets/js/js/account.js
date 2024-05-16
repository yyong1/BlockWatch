$(document).ready(function(){
    AccountDetails.init();
});

var AccountDetails = {
    init: function () {
        this.setupChangePasswordForm();
        this.addNewUserAsset();
        this.fetchUserAssets();
        this.setupEditAssetModal();
        this.setupDeleteAsset();
    },

    setupChangePasswordForm: function () {
        $('#change-password-modal-btn').click(function () {
            $('#section-change-pass').toggle();
        });

        $('#change-password-form').submit(function (event) {
            event.preventDefault();
            var currentPassword = $('#current').val();
            var newPassword = $('#password').val();
            var confirmPassword = $('#confirm-password').val();

            if (newPassword !== confirmPassword) {
                $('#error-call').show().text('Passwords do not match');
                $('#success-call').hide();
                return;  // Make sure to stop further processing
            } else {
                console.log('Attempting to change password...');
                // Simulate password change logic, normally you'd send this to the server
                $('#success-call').show().text('Password successfully changed!');
                $('#error-call').hide();
            }
        });
    },

    addNewUserAsset: function () {
        $('#open-modal-btn').click(function () {
            $('#crypto-modal').show();
        });

        $('.close-btn').click(function () {
            $('#crypto-modal').hide();
        });

        $('#crypto-symbol').on('input', function () {
            var input = $(this).val();
            var dropdown = $('#crypto-results');
            dropdown.empty().show();

            RestClient.get('/assets/symbol', function (cryptos) {
                cryptos.forEach(function (crypto) {
                    if (crypto.symbol.toLowerCase().includes(input.toLowerCase())) {
                        var li = $('<li>').text(crypto.symbol).data('assetId', crypto.asset_id).appendTo(dropdown);
                        li.click(function () {
                            $('#crypto-symbol').val($(this).text()).data('assetId', $(this).data('assetId'));
                            dropdown.hide();
                        });
                    }
                });

                if (dropdown.children().length === 0) {
                    dropdown.append($('<li>').text('No results found'));
                }
            });
        });

        $('#crypto-form').submit(function (event) {
            event.preventDefault();
            var userId = Utils.get_from_localstorage('user').id;
            var amount = $('#amount').val();
            var assetId = $('#crypto-symbol').data('assetId');

            console.log('Adding asset:', userId, assetId, amount);
            RestClient.post(`/assets/userAsset/${userId}/${assetId}`, { amount: amount }, function (response) {
                console.log('Asset added:', response);
                $('#crypto-modal').hide();
                AccountDetails.fetchUserAssets();
            }, function(error) {
                console.error('Error adding asset:', error);
                alert('Error adding asset. Please check the console for more details.');
            });
        });
    },

    fetchUserAssets: function () {
        const userId = Utils.get_from_localstorage('user').id;
        RestClient.get(`/assets/userAsset/${userId}`, function (data) {
            var totalEarned = 0;
            $('#user-assets-table tbody').empty();
            data.forEach(function (asset, index) {
                var totalValue = (parseFloat(asset.purchaseamount) * parseFloat(asset.purchasepriceusd)).toFixed(2);
                totalEarned += parseFloat(totalValue);
                $('#user-assets-table tbody').append(
                    `<tr>
                        <td>${index + 1}</td>
                        <td>${asset.symbol}</td>
                        <td>${asset.purchaseamount}</td>
                        <td>$${asset.purchasepriceusd}</td>
                        <td>$${totalValue}</td>
                        <td><button class="edit-btn" data-id="${asset.userasset_id}">Edit</button></td>
                        <td><button class="delete-btn" data-id="${asset.userasset_id}">Delete</button></td>
                    </tr>`
                );
            });
            $('#total-earned').text(`Total Earned: $${totalEarned.toFixed(2)}`);
        }, function(error) {
            console.error('Error fetching assets:', error);
            alert('Error fetching assets. Please check the console for more details.');
        });
    },

    setupEditAssetModal: function() {
        $(document).on('click', '.edit-btn', function() {
            var userAssetId = $(this).data('id');
            var $row = $(this).closest('tr');
            var symbol = $row.find('td:eq(1)').text();
            var amount = $row.find('td:eq(2)').text();

            $('#edit-crypto-symbol').val(symbol);
            $('#edit-amount').val(amount);
            $('#edit-asset-modal').data('assetId', userAssetId).show();
        });

        $('.close-btn').click(function() {
            $('#edit-asset-modal').hide();
        });

        $('#edit-asset-form').submit(function(event) {
            event.preventDefault();
            var userAssetId = $('#edit-asset-modal').data('assetId');
            var newAmount = $('#edit-amount').val();

            if (!newAmount || isNaN(parseFloat(newAmount)) || parseFloat(newAmount) < 0) {
                alert('Please enter a valid amount.');
                return;
            }

            console.log('Updating asset:', userAssetId, newAmount);
            RestClient.patch(`/assets/userAsset/${userAssetId}`, { amount: newAmount }, function(response) {
                console.log('Asset updated successfully:', response);
                $('#edit-asset-modal').hide();
                AccountDetails.fetchUserAssets();
            }, function(error) {
                console.error('Failed to update asset:', error);
                alert('Failed to update asset. Please try again.');
            });
        });
    },

    setupDeleteAsset: function() {
        $(document).on('click', '.delete-btn', function() {
            var userAssetId = $(this).data('id');
            if (confirm('Are you sure you want to delete this asset?')) {
                RestClient.delete(`/assets/userAsset/${userAssetId}`, function(response) {
                    console.log('Asset deleted:', response);
                    AccountDetails.fetchUserAssets();
                }, function(error) {
                    console.error('Failed to delete asset:', error);
                    alert('Failed to delete asset. Please try again.');
                });
            }
        });
    }
};
