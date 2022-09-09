/**
 * Copyright © Ihor Oleksiienko (https://github.com/torys877)
 * See LICENSE for license details.
 */
define([
    'uiComponent',
    'jquery',
    'web3'
], function (Component, $, web3) {
    'use strict';

    return Component.extend({
        defaults: {
            merchantAddress: null,
            networkVersion: null,
            givenProvider: null,
            orderAmount: null,
            orderHash: null,
            addTxUrl: null,
            thCheckAndConfirmUrl: null,
            successUrl: null,
            web3client: null,
            requestIntervalSeconds: null,
            accounts: [],
            contract: null
        },
        /** @inheritdoc */
        initialize: function () {
            this._super();

            if (!this.createWeb3()) {
                return;
            }

            this.connectWallet();
            this.loadContract();
        },
        createWeb3: function() {
            this.givenProvider = web3.givenProvider;
            if (
                this.givenProvider &&
                typeof this.givenProvider != 'undefined'
            ) {
                this.web3client = new web3(web3.givenProvider); //metamask provider, or custom network url, ex:'ws://some.local-or-remote.node:8546'
            } else {
                this.showMessage('Metamask is not authorized or not installed.');
                return false;
            }
        },
        /** connect metamask wallet to website **/
        connectWallet: function() {
            if (!this.isWeb3()) {
                return;
            }
            let self = this;
            this.web3client.eth.requestAccounts().then(
                function(accs) {
                    self.accounts = accs;
                    if (accs.length) {
                        $('#connect_wallet').hide();
                        $('#pay').show();
                        self.accounts.forEach(function(element){
                            if (!$("#accounts option[value='" + element + "']").length) {
                                $('#accounts').append($('<option>', {
                                    value: element,
                                    text: element
                                }));
                            }
                        });
                    }
                }
            );
        },
        //create contract object in web3js as js object
        loadContract:  function() {
            this.contract = new this.web3client.eth
                .Contract(
                    JSON.parse($('#contract_abi').text()), //contract ABI
                    $('#contract_address').val() //contract address
                );
            this.showMessage('Contract is loaded');
        },
        /** send metamask ETH transaction to contract **/
        payInContract: function() {
            if (!this.isWeb3()) {
                return;
            }
            let self = this;

            if (this.contract == null) {
                self.showMessage('CONTRACT NOT CREATED');
                return;
            }

            this.contract.methods
                .pay(parseInt($('#order_number').val())) //call contract function 'pay'
                .send(
                    {
                        from: self.getCurrentAccount(),
                        value: web3.utils.toWei($('#amount').val(), "ether") //amount of order ETH
                    }
                )
                .then(function(obj1) {
                    self.showMessage('Transaction for order is sent. Txh = ' + obj1.transactionHash);
                    console.log(obj1);
                    $('#approve').show();
                    $('#claim').show();
                })
                .catch(function(errObj) {
                    self.showMessage('Transaction is declined by client. ' + errObj.code + ': ' + errObj.message);
                })
            ;
        },
        getOrderData: function() {
            if (!this.isWeb3()) {
                return;
            }
            let self = this;

            if (this.contract == null) {
                self.showMessage('CONTRACT NOT CREATED');
                return;
            }

            this.contract.methods
                .orders(parseInt($('#order_number').val())) //call contract function 'customerApprove'
                .call((err, obj1) => {
                    if (err != null) {
                        self.showMessage('Call unsuccessfull. ' + err.code + ': ' + err.message);
                    }

                    console.log(obj1);
                    // self.showMessage('Order is approved. Txh = ' + obj1.transactionHash);
                    console.log(err);
                });
            ;
        },
        approvePayment: function() {
            if (!this.isWeb3()) {
                return;
            }
            let self = this;

            if (this.contract == null) {
                self.showMessage('CONTRACT NOT CREATED');
                return;
            }

            this.contract.methods
                .customerApprove(parseInt($('#order_number').val())) //call contract function 'customerApprove'
                .send(
                    {
                        from: self.getCurrentAccount()
                    }
                )
                .then(function(obj1) {
                    self.showMessage('Order is approved. Txh = ' + obj1.transactionHash);
                    console.log(obj1);
                })
                .catch(function(errObj) {
                    self.showMessage('Transaction is declined. ' + errObj.code + ': ' + errObj.message);
                })
            ;
        },

        claimPayment: function() {
            if (!this.isWeb3()) {
                return;
            }
            let self = this;

            if (this.contract == null) {
                self.showMessage('CONTRACT NOT CREATED');
                return;
            }

            this.contract.methods
                .claimMoney(parseInt($('#order_number').val())) //call contract function 'claimMoney'
                .send(
                    {
                        from: self.getCurrentAccount()
                    }
                )
                .then(function(obj1) {
                    self.showMessage('Money is claimed. Txh = ' + obj1.transactionHash);
                    console.log(obj1);
                })
                .catch(function(errObj) {
                    self.showMessage('Transaction is declined. ' + errObj.code + ': ' + errObj.message);
                })
            ;
        },
        /** check transaction status through web3 metamask connection **/
        checkTransactionStatus: function(transactionHash) {
            let self = this;
            //check registered transaction and capture if it is processed in blockchain
            self.web3client.eth.getTransactionReceipt(transactionHash, function(error, obj) {
                if (error) {
                    self.showMessage(err.code + ' ' + error.message);
                }
                if (!obj) {
                    return;
                }
                if (obj.status == true) {
                    self.showMessage('Transaction successfull');
                }
            });
        },
        /** check is provider exist **/
        isWeb3: function() {
            if (!this.web3client) {
                if (this.createWeb3()) {
                    return true;
                }

                return false;
            }

            return true;
        },
        /** check is wallet connected to website **/
        isWalletConnected: function() {
            if (!this.isWeb3()) {
                return;
            }

            this.connectWallet();

            return this.accounts[0] ? true : false;
        },
        /** get current account **/
        getCurrentAccount: function() {
            if ($('#accounts').find(":selected").val()) {
                return $('#accounts').find(":selected").val();
            }

            return false;
        },

        showMessage: function(message) {
            $('.message').html(message);
            $('.message').show();
        },
    });
});
