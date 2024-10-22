# WATCHX_FUTURE NFT Contract Project

## Introduction

This is an NFT contract project built using Hardhat. The project allows users to mint and manage NFTs, adhering to the ERC721 standard.

## Directory Structure


## Prerequisites

Ensure you have the following tools installed:

- [Node.js](https://nodejs.org/) (version 12.x or higher)
- [Yarn](https://yarnpkg.com/) (you can choose to use npm)

## Install Dependencies

Run the following command in the root directory of the project to install dependencies:

```bash
yarn install
```
## Compile Contracts
Run the following command in the root directory to compile the contracts:
```bash
npx hardhat compile
```
## Deploy Contracts
Use the following command to deploy the verifyProxy contracts:
```bash
npx hardhat run /scripts/deploy-create_project.js --network <network-name>
```
