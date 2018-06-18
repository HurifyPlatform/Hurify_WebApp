module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "106.51.44.203", // Connect to geth on the specified
      port: 8545,
      from: "0x1a4f41ae92e652fe9f2a94074d048528e94b1f18", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
  }
};
