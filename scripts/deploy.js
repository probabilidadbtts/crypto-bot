const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Desplegando contratos con la cuenta:", deployer.address);
  console.log(
    "Balance de la cuenta:",
    (await ethers.provider.getBalance(deployer.address)).toString()
  );

  const name = "MiToken";
  const symbol = "MTK";
  // 1 millón de tokens con 18 decimales
  const initialSupply = ethers.parseEther("1000000");

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(name, symbol, initialSupply);

  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("MyToken desplegado en:", address);

  const deploymentInfo = {
    name,
    symbol,
    address,
    deployer: deployer.address,
    initialSupply: initialSupply.toString(),
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Información guardada en deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
