const { ethers } = require("hardhat");

async function main() {
  const [owner, user] = await ethers.getSigners();

  // Carga la dirección desde el despliegue previo
  const deployment = require("../deployment.json");
  const token = await ethers.getContractAt("MyToken", deployment.address);

  console.log("Token:", deployment.symbol);
  console.log("Dueño:", owner.address);
  console.log("Usuario:", user.address);

  const ownerBalance = await token.balanceOf(owner.address);
  console.log("Balance del dueño:", ethers.formatEther(ownerBalance), deployment.symbol);

  // Transferir 100 tokens al usuario
  const amount = ethers.parseEther("100");
  const tx = await token.transfer(user.address, amount);
  await tx.wait();

  console.log("Transferidos 100 MTK al usuario");
  console.log("Nuevo balance usuario:", ethers.formatEther(await token.balanceOf(user.address)), deployment.symbol);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
