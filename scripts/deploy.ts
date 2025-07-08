import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy RewardToken with deployer's address as owner
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();
  console.log("RewardToken deployed to:", await rewardToken.getAddress());

  // Deploy EwasteTracker with rewardToken address
  const EwasteTracker = await ethers.getContractFactory("EwasteTracker");
  const tracker = await EwasteTracker.deploy(await rewardToken.getAddress());
  await tracker.waitForDeployment();
  console.log("EwasteTracker deployed to:", await tracker.getAddress());

  // Transfer ownership of RewardToken to EwasteTracker
  const tx = await rewardToken.transferOwnership(await tracker.getAddress());
  await tx.wait();
  console.log("RewardToken ownership transferred to EwasteTracker");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
