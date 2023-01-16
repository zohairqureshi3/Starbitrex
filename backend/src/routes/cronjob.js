const express = require('express');
const Cronjob = require('../controllers/cronjob');
const router = express.Router();

router.get('/', Cronjob.getPortfolioData);
router.get('/get-portfolio-data', Cronjob.getPortfolioData);
router.get('/get-market-data', Cronjob.getMarketData);
router.get('/get-eth-balance', Cronjob.getEthBalances);
router.get('/get-bnb-balance', Cronjob.getBNBBalances);
router.get('/get-avax-balance', Cronjob.getAVAXBalances);
router.get('/get-trx-balance', Cronjob.getTRXBalances);
router.get('/get-eth-transaction/:id', Cronjob.getEthTransactionByAddress);
router.get('/get-btc-balance', Cronjob.getBTCBalances);
router.get('/get-bch-balance', Cronjob.getBCHBalances);
router.get('/get-ltc-balance', Cronjob.getLTCBalances);
router.get('/get-doge-balance', Cronjob.getDOGEBalances);

module.exports = router;
