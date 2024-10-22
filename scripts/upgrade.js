// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");
require("dotenv").config(); 

async function main() {
  // 获取合约工厂
  const WatchxFutureNFT = await ethers.getContractFactory("WatchxFutureNFT");

  // 部署可升级合约，传入初始化参数
  const deployerAccount = process.env.DEPLOYER_ACCOUNT
  const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!deployerAccount || !deployerPrivateKey) {
    throw new Error("请设置 DEPLOYER_ACCOUNT 和 DEPLOYER_PRIVATE_KEY 环境变量");
  }
  ;
  // 使用私钥创建一个新的签名者（Signer）
  const wallet = new ethers.Wallet(deployerPrivateKey, ethers.provider);
  // 获取新版本合约工厂
  const WatchxFutureNFTV2 = await ethers.getContractFactory("WatchxFutureNFTV2", wallet);
  // 获取已部署的合约地址
  const existingContractAddress = process.env.DEPLOYER_WATCHX_NFT_V1;

  // 执行合约升级
  console.log("Upgrading WatchxFutureNFT...");
  const upgradedContract = await upgrades.upgradeProxy(existingContractAddress, WatchxFutureNFTV2);
  console.log("WatchxFutureNFT upgraded to:", upgradedContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
