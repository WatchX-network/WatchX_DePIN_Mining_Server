const { ethers } = require('hardhat');
require("dotenv").config(); 

async function main() {
  if (!process.env.PROJECT_REGISTRY) {
    console.log(`Please provide project registrar address`);
    return;
  }
  if (!process.env.IOID_STORE) {
    console.log(`Please provide ioIDStore address`);
    return;
  }
  const [deployer] = await ethers.getSigners();
  console.info("deployer:",deployer)

  const projectRegistry = await ethers.getContractAt('ProjectRegistry', process.env.PROJECT_REGISTRY);
  let tx = await projectRegistry['register(string,uint8)']('testProject', 0);
  const receipt = await tx.wait();
  console.info('receipt:',receipt)
  let projectId;
  for (let i = 0; i < receipt.logs.length; i++) {
    const log = receipt.logs[i];
    if (log.topics[0] == process.env.PROJECT_REGISTRY_TOPIC_0) {
      projectId = BigInt(log.topics[3]);
    }
  }

  const deviceNFT = await ethers.deployContract('DeviceNFT');
  await deviceNFT.waitForDeployment();
  const initializetx = await deviceNFT.initialize('testNFT','TNFT')
  await initializetx.wait()
  const owner = await deviceNFT.owner();
  console.info("projectId;",projectId)
  console.log(`DeviceNFT contract owner: ${owner}`);

  const proxyImplementation = await ethers.deployContract('VerifyingProxy', [
    process.env.IOID_STORE,
    process.env.PROJECT_REGISTRY,
    deviceNFT.target,
  ]);
  await proxyImplementation.waitForDeployment();
  console.log(`VerifyingProxy deployed to ${proxyImplementation.target}`);
  const proxyInitialize = await proxyImplementation.initialize(2,process.env.DEPLOYER_ACCOUNT,"testProject","testNFT","TNFT",100)
  // const proxyInitialize = await proxyImplementation.initialize(projectId,process.env.DEPLOYER_ACCOUNT,deviceNFT.target,100)
  const proxyInitializeReceipt = await proxyInitialize.wait()
  console.info("proxyInitializeReceipt:",proxyInitializeReceipt)
  // tx = await deviceNFT.configureMinter(deployer.address, 100);
  // await tx.wait();
  // console.log(`Device NFT deployed to ${deviceNFT.target}`);

  // const ioIDStore = await ethers.getContractAt('ioIDStore', process.env.IOID_STORE);
  // const price = await ioIDStore.price();
  // tx = await ioIDStore.applyIoIDs(projectId, 100, { value: 100n * price });
  // await tx.wait();
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
