module.exports = {
  migrations_directory: "./migrations",
  networks: {
    main: {
      host: "34.212.218.4", // Connect to geth on the specified
      port: 8545,
      from: "0x1064a27d24a4166716fa8169192f0aff71ddadaa", // default address to use for any transaction Truffle makes during migrations
      network_id: 1,
      gas: 4612388 // Gas limit used for deploys
    }
    rinkeby: {
      host: "106.51.44.203", // Connect to geth on the specified
      port: 8545,
      from: "0x1a4f41ae92e652fe9f2a94074d048528e94b1f18", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    },
    local: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0xbf3b79a27a91a8dc12d66eb1785c37b73c597706", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
  }
};
