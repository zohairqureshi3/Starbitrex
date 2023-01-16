var config = {};

config.btcConfirmationsToResolve = 1;

module.exports = config;


// Usman Config Start

exports.rinkeby = {
    chainId: 4,
    rpc_url: 'https://rinkeby.infura.io/v3/3b7a6c29f9c048d688a848899888aa96',
    multicall: '0x607195BdDc3FC211C1E20f3645205DcF86EcB150',
    explorerURL: 'https://rinkeby.etherscan.io/tx/',
    usdt: {
        decimals: 6,
        address: '0xCCb74A9f004A2ef2379dF3332606ACf24c47CA11'
    },
    bnb: {
        decimals: 18,
        address: '0x83034A49FD6c8bdE03dBb17b04D4aB209EC6F848'
    },
    weth: {
        decimals: 18,
        address: '0x515ca58e365B7FAc507E49459A4b37926Db06808'
    },
    busd: {
        decimals: 18,
        address: '0x069bFB43c84AdA12273E61AA3d74DB3874769dbF'
    },
    usdc: {
        decimals: 6,
        address: '0xA7c3a091DC9cAeD0C8D8B320e77fd2425557D6CA'
    },
    matic: {
        decimals: 18,
        address: '0x759e6fE47D2D64bcfa3539117dF95C29E9289E5e'
    },
}

exports.mainnet = {
    chainId: 1,
    rpc_url: 'https://mainnet.infura.io/v3/3b7a6c29f9c048d688a848899888aa96',
    multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    explorerURL: 'https://etherscan.io/tx/',
    usdt: {
        decimals: 6,
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    },
    bnb: {
        decimals: 18,
        address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
    },
    weth: {
        decimals: 18,
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    },
    busd: {
        decimals: 18,
        address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53'
    },
    usdc: {
        decimals: 6,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    matic: {
        decimals: 18,
        address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
    },
}

// Usman Config End