const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy("MiToken", "MTK", ethers.parseEther("1000000"));

    return { token, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Debe asignar el suministro total al dueño", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Debe tener el nombre y símbolo correctos", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.name()).to.equal("MiToken");
      expect(await token.symbol()).to.equal("MTK");
    });
  });

  describe("Minting", function () {
    it("Solo el dueño puede acuñar", async function () {
      const { token, addr1 } = await loadFixture(deployTokenFixture);
      await expect(
        token.connect(addr1).mint(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("El dueño puede acuñar nuevos tokens", async function () {
      const { token, owner, addr1 } = await loadFixture(deployTokenFixture);
      await token.mint(addr1.address, ethers.parseEther("500"));
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("500"));
    });
  });

  describe("Pausable", function () {
    it("El dueño puede pausar y reanudar", async function () {
      const { token, owner, addr1 } = await loadFixture(deployTokenFixture);

      await token.pause();
      await expect(
        token.transfer(addr1.address, ethers.parseEther("10"))
      ).to.be.revertedWith("Pausable: paused");

      await token.unpause();
      await token.transfer(addr1.address, ethers.parseEther("10"));
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("10"));
    });
  });

  describe("Burnable", function () {
    it("El dueño puede quemar tokens", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      const initialSupply = await token.totalSupply();

      await token.burn(ethers.parseEther("1000"));
      expect(await token.totalSupply()).to.equal(initialSupply - ethers.parseEther("1000"));
    });
  });
});
