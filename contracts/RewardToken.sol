// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor(address trackerAddress) ERC20("Recycle Token", "RECY") Ownable(trackerAddress) {
        _mint(trackerAddress, 1_000_000 * 10 ** decimals()); // Initial supply to EwasteTracker
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
