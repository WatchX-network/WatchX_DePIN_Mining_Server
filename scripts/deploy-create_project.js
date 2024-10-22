const { ethers } = require('hardhat');
require("dotenv").config(); 

async function main() {
  if (!process.env.IOID_STORE) {
    console.log(`Please provide ioIDStore address`);
    return;
  }
  if (!process.env.PROJECT_REGISTRY) {
    console.log(`Please provide project registry address`);
    return;
  }
  const [deployer] = await ethers.getSigners();

  const deviceNFTImplementation = await ethers.deployContract('DeviceNFT');
  await deviceNFTImplementation.waitForDeployment();
  console.log(`DeviceNFT deployed to ${deviceNFTImplementation.target}`);
  const proxyImplementation = await ethers.deployContract('VerifyingProxy', [
    process.env.IOID_STORE,
    process.env.PROJECT_REGISTRY,
    deviceNFTImplementation.target,
  ]);
  await proxyImplementation.waitForDeployment();
  console.log(`VerifyingProxy deployed to ${proxyImplementation.target}`);
  const ioIDStore = await ethers.getContractAt('ioIDStore', process.env.IOID_STORE);
  const price = await ioIDStore.price();
  console.log(`ioIDStore price ${price}`);
  //init 0 ioid
  const proxyInitialize = await proxyImplementation.initialize(
    0,
    process.env.VERIFIER_ACCOUNT,
    "YOUR_PROJECT","YOUR_NFT","YOURNFT",
    0,
    {value: ethers.parseEther("1")})
  const receipt = await proxyInitialize.wait()
  console.info("receipt:",receipt)

}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
