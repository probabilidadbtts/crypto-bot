// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MyToken
 * @dev Token ERC-20 estándar con funciones de acuñamiento, quema, pausa y permit.
 */
contract MyToken is ERC20, ERC20Burnable, Ownable, Pausable, ERC20Permit {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) ERC20Permit(name) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Acuña nuevos tokens. Solo el dueño y cuando no esté pausado.
     */
    function mint(address to, uint256 amount) public onlyOwner whenNotPaused {
        _mint(to, amount);
    }

    /**
     * @dev Pausa todas las transferencias. Solo el dueño.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Reactiva las transferencias. Solo el dueño.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Sobrescribe transfer para respetar el estado de pausa.
     */
    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        whenNotPaused
        returns (bool)
    {
        return super.transfer(recipient, amount);
    }

    /**
     * @dev Sobrescribe transferFrom para respetar el estado de pausa.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    )
        public
        virtual
        override
        whenNotPaused
        returns (bool)
    {
        return super.transferFrom(sender, recipient, amount);
    }
}
