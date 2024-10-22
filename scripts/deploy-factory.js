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
  const factory = await ethers.deployContract('UniversalFactory', [proxyImplementation.target]);
  await factory.waitForDeployment();
  console.log(`UniversalFactory deployed to ${factory.target}`);
  //UniversalFactory
  const factoryContract = await ethers.getContractAt("UniversalFactory", process.env.UNIVERSAL_FACTORY);
  const createTx =  await factoryContract.create('1',process.env.DEPLOYER_ACCOUNT,'YOUR_PROJECT','YOUR_NFT','YOUR_NFT',100,{value: ethers.parseEther("1")} )
  const receipt = await createTx.wait()
  console.info('create receipt:',receipt)
// events
if (receipt.events && receipt.events.length > 0) {
  const event = receipt.events.find(event => event.event === 'CreatedProxy');
  if (event) {
    const createdProxyAddress = event.args[0];
    console.log(`Proxy contract created at address: ${createdProxyAddress}`);
  } else {
    console.log("CreatedProxy event not found");
  }
} else {
  console.log("No events found in transaction receipt");
}

console.log(`Transaction hash: ${receipt.transactionHash}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
