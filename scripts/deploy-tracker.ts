import hre from "hardhat";

async function main() {
  // Step 1: Deploy dummy tracker first (will use its address in token constructor)
  const EwasteTracker = await hre.ethers.getContractFactory("EwasteTracker");
  const dummyTokenAddress = "0x0000000000000000000000000000000000000000";
  const tracker = await EwasteTracker.deploy(dummyTokenAddress);
  await tracker.waitForDeployment();
  const trackerAddress = await tracker.getAddress();
  console.log("EwasteTracker deployed to:", trackerAddress);

  // Step 2: Deploy RewardToken with tracker's address
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const token = await RewardToken.deploy(trackerAddress);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("RewardToken deployed to:", tokenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
