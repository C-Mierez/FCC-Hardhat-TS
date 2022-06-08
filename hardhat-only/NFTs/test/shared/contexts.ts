import { deployments, ethers, waffle } from "hardhat";

/**
 * This is the definition of the global context.
 * It initializes all the attributes that can be needed globally in the underlying tests.
 *
 */
export function baseContext(description: string, hooks: () => void) {
  describe(description, async function () {
    before("Set up signers", async function () {
      const signers = waffle.provider.getWallets();

      this.namedSigners = {
        deployer: signers[0],
        alice: signers[1],
        bob: signers[2],
        charlie: signers[3],
        dave: signers[4],
      };

      this.unnamedSigners = signers.slice(5);
    });

    beforeEach("Set up contracts", async function () {
      await deployments.fixture("all");

      this.contracts = {
        bank: await ethers.getContract("UselessBank"),
        token: await ethers.getContract("TestToken"),
      };
      // this.loadFixture = waffle.createFixtureLoader(signers);
    });

    hooks();
  });
}
