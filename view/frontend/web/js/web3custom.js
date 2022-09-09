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
            processingUrl: null,
            successUrl: null,
            web3client: null,
            accounts: []
        },
        /** @inheritdoc */
        initialize: function () {
            this._super();
            // console.log(234234234);
            this.web3client = new web3(web3.givenProvider);

            // console.log(web3.givenProvider);
            // console.log(web3client);
            // console.log(1111111);
            // // web3client.eth.getAccounts(console.log);
            // web3client.eth.requestAccounts().then(console.log);
        },
        myinit: function() {
            let prov = web3.givenProvider;
            let kk = 0;
        },
        connectWallet: function() {
            this.web3client.eth.requestAccounts().then(console.log);
        },
        isWalletConnected: function() {
            var result = this.accounts.length ? true:false;
            return result;
        },
        getAccounts: function() {
            console.log(123123);
            var self = this;
            this.web3client.eth.requestAccounts().then(function(result){self.accounts = result});
        },
        getCurrentAccount: function() {
            if (this.isWalletConnected()) {
                return this.accounts[0];
            }
        },
        sendTransaction: function(amount) {
            this.web3client.eth.sendTransaction({
                from: this.getCurrentAccount(),
                to: this.merchantAddress,
                value: web3.toWei(amount, "ether"),
            }, function(err, transactionHash) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(transactionHash);
                }
            });
        }
    });
});
