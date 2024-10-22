const { ethers, upgrades } = require('hardhat');
require("dotenv").config(); 

async function main() {
  if (!process.env.IOID_PRICE) {
    console.log(`Please provide wallet implementation`);
    return;
  }
  if (!process.env.WALLET_REGISTRY) {
    console.log(`Please provide wallet registry address`);
    return;
  }
  console.info("process.env.WALLET_IMPLEMENTATION:",process.env.WALLET_IMPLEMENTATION)
  if (!process.env.WALLET_IMPLEMENTATION) {
    console.log(`Please provide wallet implementation`);
    return;
  }

  const [deployer] = await ethers.getSigners();

  const project = await upgrades.deployProxy(
    await ethers.getContractFactory('Project'),
    ['ioID Project', 'IPN'],
    {
      initializer: 'initialize',
    }
  );
  await project.waitForDeployment();
  console.log(`Project deployed to ${project.target}`);

  const projectRegistry = await upgrades.deployProxy(
    await ethers.getContractFactory('ProjectRegistry'),
    [project.target],
    {
      initializer: 'initialize',
    }
  );
  await projectRegistry.waitForDeployment();
  console.log(`ProjectRegistry deployed to ${projectRegistry.target}`);

  console.log(`Set Project minter to ${projectRegistry.target}`);
  let tx = await project.setMinter(projectRegistry.target);
  await tx.wait();

  const ioIDStore = await upgrades.deployProxy(
    await ethers.getContractFactory('ioIDStore'),
    [project.target, ethers.parseEther(process.env.IOID_PRICE)],
    {
      initializer: 'initialize',
    }
  );
  await ioIDStore.waitForDeployment();
  console.log(`ioIDStore deployed to ${ioIDStore.target}`);

  const ioID = await upgrades.deployProxy(
    await ethers.getContractFactory('ioID'),
    [
      deployer.address,
      process.env.WALLET_REGISTRY,
      process.env.WALLET_IMPLEMENTATION,
      'ioID device NFT',
      'IDN',
    ],
    {
      initializer: 'initialize',
    }
  );
  await ioID.waitForDeployment();
  console.log(`ioID deployed to ${ioID.target}`);

  const ioIDRegistry = await upgrades.deployProxy(
    await ethers.getContractFactory('ioIDRegistry'),
    [ioIDStore.target, ioID.target],
    {
      initializer: 'initialize',
    }
  );
  await ioIDRegistry.waitForDeployment();
  console.log(`ioIDRegistry deployed to ${ioIDRegistry.target}`);

  console.log(`Set ioIDStore ioIDRegistry to ${ioIDRegistry.target}`);
  tx = await ioIDStore.setIoIDRegistry(ioIDRegistry.target);
  await tx.wait();

  console.log(`Set ioID minter to ${ioIDRegistry.target}`);
  tx = await ioID.setMinter(ioIDRegistry.target);
  await tx.wait();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
