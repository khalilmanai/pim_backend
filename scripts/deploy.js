const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying InfractionVerification contract...");

  // Get the contract factory
  const InfractionVerification = await hre.ethers.getContractFactory("InfractionVerification");
  
  // Deploy the contract
  const infractionVerification = await InfractionVerification.deploy();
  
  // Wait for deployment to finish
  await infractionVerification.waitForDeployment();

  // Get the contract address
  const contractAddress = await infractionVerification.getAddress();
  
  console.log(`InfractionVerification contract deployed to: ${contractAddress}`);

  // Verify the contract on Etherscan
  if (process.env.NODE_ENV !== "development") {
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }

  // Save the contract address to a file
  const contractData = {
    address: contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  const contractPath = path.join(__dirname, "../contract-address.json");
  fs.writeFileSync(contractPath, JSON.stringify(contractData, null, 2));
  console.log(`Contract address saved to ${contractPath}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 