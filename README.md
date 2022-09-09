# Crypto Contract Magento 2 Test Module

## Description

Module for test smart contract with web3js for magento, made for magento meetup #7.
* [ProMagento](https://promagento.org/)

It adds 2 routes:
1) /test/customer/checkout
2) /test/merchant/admin

to imitate customer action on checkout and with payment/claim money generally and merchant admin action from merchant side.

Example for contract is located in `/contracts`, `/deal.sol` - contract, `/data` - deployed contract address (for test it is better to deploy it by yourself using your wallet)

Deploy contract using remix IDE:

* [Remix](https://remix.ethereum.org/)


## Installation

To install module - download and upload in folder `app/code/Crypto/Test` or

add repositories to `composer.json`:

```angular2html
    "repositories": {
        "crypto-contract-test": {
            "type": "git",
            "url": "git@github.com:torys877/crypto-contract-test.git"
        }
    }
```

Or add repositories in console:

`composer config repositories.crypto-base git git@github.com:torys877/crypto-contract-test.git`

Install module:

`composer require cryptom2/crypto-contract-test`

And run

```angular2html
php bin/magento setup:upgrade
```

## Author

### Ihor Oleksiienko

* [Github](https://github.com/torys877)
* [Linkedin](https://www.linkedin.com/in/igor-alekseyenko-77613726/)
* [Facebook](https://www.facebook.com/torysua/)
