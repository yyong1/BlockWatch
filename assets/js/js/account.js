
var AccountDetails = {
    init: function() {
        this.setupChangePasswordForm();
        this.addNewUserAsset();
        this.fetchUserAssets();
        this.setupEditAssetModal();
        this.setupDeleteAsset();
        this.bindUIActions();
        this.initValidation();
        this.checkUserReview();
    },

    setupChangePasswordForm: function() {
        $('#change-password-modal-btn').click(function() {
            $('#section-change-pass').toggle();
        });

        $('#change-password-form').submit(function(event) {
            event.preventDefault();
            var currentPassword = $('#current').val();
            var newPassword = $('#password').val();
            var confirmPassword = $('#confirm-password').val();

            if (newPassword !== confirmPassword) {
                $('#error-call').show().text('Passwords do not match');
                $('#success-call').hide();
                return;
            } else {
                console.log('Attempting to change password...');
                $('#success-call').show().text('Password successfully changed!');
                $('#error-call').hide();
            }
        });
    },

    addNewUserAsset: function() {
        $('#open-modal-btn').click(function() {
            $('#crypto-modal').show();
        });

        $('.close-btn').click(function() {
            $('#crypto-modal').hide();
        });

        $('#crypto-symbol').on('input', function() {
            var input = $(this).val();
            var dropdown = $('#crypto-results');
            dropdown.empty().show();

            RestClient.get('/assets/symbol', function(cryptos) {
                cryptos.forEach(function(crypto) {
                    if (crypto.symbol.toLowerCase().includes(input.toLowerCase())) {
                        var li = $('<li>').text(crypto.symbol).data('assetId', crypto.asset_id).appendTo(dropdown);
                        li.click(function() {
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

        $('#crypto-form').submit(function(event) {
            event.preventDefault();
            var userId = Utils.get_from_localstorage('user').id;
            var amount = $('#amount').val();
            var assetId = $('#crypto-symbol').data('assetId');

            console.log('Adding asset:', userId, assetId, amount);
            RestClient.post(`/assets/userAsset/${userId}/${assetId}`, { amount: amount }, function(response) {
                console.log('Asset added:', response);
                $('#crypto-modal').hide();
                AccountDetails.fetchUserAssets();
            }, function(error) {
                console.error('Error adding asset:', error);
            });
        });
    },

    fetchUserAssets: function() {
        const userId = Utils.get_from_localstorage('user').id;
        RestClient.get(`/assets/userAsset/${userId}`, function(data) {
            var totalEarned = 0;
            $('#user-assets-table tbody').empty();
            data.forEach(function(asset, index) {
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
    
            var requestData = { amount: parseFloat(newAmount) };
            console.log('Updating asset:', userAssetId, requestData);
    
            RestClient.patch(`/assets/userAsset/${userAssetId}`, requestData, function(response) {
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
            var userId = Utils.get_from_localstorage('user').id;
            if (confirm('Are you sure you want to delete this asset?')) {
                RestClient.delete(`/assets/userAsset/${userId}/${userAssetId}`, function(response) {
                    console.log('Asset deleted: ', response);
                    AccountDetails.fetchUserAssets();
                }, function(error) {
                    console.error('Failed to delete asset:', error);
                    alert('Failed to delete asset. Please try again.');
                });
            }
        });
    },

    bindUIActions: function() {
        $('#rate-app-modal-btn').click(this.showRateModal.bind(this));
        $('.close-btn').click(this.closeModal.bind(this));
    },

    showRateModal: function() {
        $('#rate-app-modal').show();
    },

    closeModal: function(event) {
        $(event.currentTarget).closest('.modal').hide();
    },

    initValidation: function() {
        $("#rate-app-form").validate({
            rules: {
                rating: {
                    required: true,
                    min: 1,
                    max: 5
                },
                feedback: {
                    required: true
                }
            },
            messages: {
                rating: {
                    required: "Please enter a rating",
                    min: "Rating must be at least 1",
                    max: "Rating cannot be more than 5"
                },
                feedback: {
                    required: "Please enter your feedback"
                }
            },
            submitHandler: this.submitFeedback.bind(this)
        });

        $("#change-password-form").validate({
            rules: {
                current: {
                    required: true,
                    minlength: 6
                },
                password: {
                    required: true,
                    minlength: 6
                },
                "confirm-password": {
                    required: true,
                    equalTo: "#password"
                }
            },
            messages: {
                current: {
                    required: "Please enter your current password",
                    minlength: "Your password must be at least 6 characters long"
                },
                password: {
                    required: "Please enter a new password",
                    minlength: "Your password must be at least 6 characters long"
                },
                "confirm-password": {
                    required: "Please confirm your new password",
                    equalTo: "Passwords do not match"
                }
            }
        });

        $("#crypto-form").validate({
            rules: {
                "crypto-symbol": {
                    required: true
                },
                amount: {
                    required: true,
                    number: true,
                    min: 0.01
                }
            },
            messages: {
                "crypto-symbol": {
                    required: "Please enter a crypto symbol"
                },
                amount: {
                    required: "Please enter the amount",
                    number: "Please enter a valid number",
                    min: "Amount must be greater than 0"
                }
            }
        });

        $("#edit-asset-form").validate({
            rules: {
                "edit-amount": {
                    required: true,
                    number: true,
                    min: 0.01
                }
            },
            messages: {
                "edit-amount": {
                    required: "Please enter the new amount",
                    number: "Please enter a valid number",
                    min: "Amount must be greater than 0"
                }
            }
        });
    },

    checkUserReview: function() {
        var userId = Utils.get_from_localstorage("user").id;
        RestClient.get(`/reviews/${userId}`, function(response) {
            if (response && response.length > 0) {
                var review = response[0];
                $('#rating').val(review.rating);
                $('#feedback').val(review.comment);
                $('#rate-app-form h2').text('Your Review');
                $('#rate-app-form button[type="submit"]').text('Update Review');
                $('#rate-app-form').data('reviewId', review.review_id);
            }
        }, function(error) {
            console.error('Error fetching user review:', error);
        });
    },
    submitFeedback: function(form) {
        var rating = $("#rating").val();
        var feedback = $("#feedback").val();
        var userId = Utils.get_from_localstorage("user").id;
        var reviewId = $('#rate-app-form').data('reviewId');
    
        if (reviewId) {
            console.log('Updating review:', reviewId, rating, feedback);
    
            RestClient.patch(`/reviews/${reviewId}`, {
                rating: rating,
                comment: feedback
            }, function(response) {
                alert("Your review has been updated!");
                $("#rate-app-modal").hide();
                form.reset();
            }, function(error) {
                console.log('Error updating review:', error);
                alert("An error occurred. Please try again.");
            });
        } else {
            RestClient.post("/reviews", {
                user_id: userId,
                rating: rating,
                comment: feedback
            }, function(response) {
                alert("Thank you for your feedback!");
                $("#rate-app-modal").hide();
                form.reset();
            }, function(error) {
                alert("An error occurred. Please try again.");
            });
        }
        return false;
    }
    
};