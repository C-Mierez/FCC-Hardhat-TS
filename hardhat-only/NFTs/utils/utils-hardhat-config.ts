interface networksType {
  defaultNetworkConfigId: number;
  [chainId: number]: networkConfig;
}

interface networkConfig {
  networkName: string;
  contracts: {
    tokens: { [tokenName: string]: string };
    priceFeeds?: {};
  };
  config: {
    isLocalChain: boolean;
    shouldVerify: boolean;
    [prop: string]: any;
  };
}

export const networks: networksType = {
  defaultNetworkConfigId: 31337,
  31337: {
    networkName: "hardhat",
    contracts: {
      tokens: {
        fau: "0xFab46E002BbF0b4509813474841E0716E6730136",
      },
    },
    config: {
      isLocalChain: true,
      shouldVerify: true,
    },
  },
  4: {
    networkName: "rinkeby",
    contracts: {
      tokens: {
        fau: "0xFab46E002BbF0b4509813474841E0716E6730136",
        dai: "0xFab46E002BbF0b4509813474841E0716E6730136",
        weth: "0xc778417e063141139fce010982780140aa0cd5ab",
        wbtc: "0x577D296678535e4903D59A4C929B718e1D575e0A",
        link: "0x01be23585060835e02b77ef475b0cc51aa1e0709",
      },
      priceFeeds: {
        dai_usd: "0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D",
        weth_usd: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
        wbtc_usd: "0x2431452A0010a43878bF198e170F6319Af6d27F4",
        link_usd: "0xd8bD0a1cB028a31AA859A21A3758685a95dE4623",
      },
    },
    config: {
      isLocalChain: false,
      shouldVerify: true,
    },
  },
  80001: {
    networkName: "mumbai",
    contracts: {
      tokens: {},
    },
    config: {
      isLocalChain: false,
      shouldVerify: true,
    },
  },
  137: {
    networkName: "polygon",
    contracts: {
      tokens: {},
    },
    config: {
      isLocalChain: false,
      shouldVerify: true,
    },
  },
};

export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

export const mocks = {
  decimals: "18",
  initial_price: "200000000000000000000",
};
