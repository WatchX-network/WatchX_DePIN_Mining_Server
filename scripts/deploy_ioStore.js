// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");
require("dotenv").config(); 

async function main() {
  const IoIDStore = await ethers.getContractFactory("ioIDStore");
  const deployerAccount = process.env.DEPLOYER_ACCOUNT
  const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;

  console.info("deployerAccount",deployerAccount)
  console.info("deployerPrivateKey",deployerPrivateKey)
  if (!deployerAccount || !deployerPrivateKey) {
    throw new Error("need set DEPLOYER_ACCOUNT 和 DEPLOYER_PRIVATE_KEY");
  }
  
  const wallet = new ethers.Wallet(deployerPrivateKey, ethers.provider);
  console.log("Deploying ioIDStore...");
  const ioIDStore = await upgrades.deployProxy(IoIDStore, ["0x0000000000000000000000000000000000000000",100], {
    initializer: "initialize",
  });
  await ioIDStore.waitForDeployment();
  console.log("ioIDStore deployProxy to:", ioIDStore.target);
  console.log("ioIDStore deployProxy to:", ioIDStore.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
