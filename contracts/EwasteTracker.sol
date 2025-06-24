// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RewardToken.sol";

contract EwasteTracker is Ownable(0x8C209a904Ae64137452615e312a77CC4f3dCA9D6) {
    RewardToken public rewardToken;
    uint256 public itemCounter = 0;
    uint256 public rewardAmount = 10 * 10 ** 18;

    enum Status {
        Submitted,
        Collected,
        Verified
    }

    struct EwasteItem {
        uint256 id;
        address user;
        string itemType;
        string location;
        uint256 timestamp;
        Status status;
    }

    mapping(uint256 => EwasteItem) public items;
    mapping(address => bool) public collectors;

    event ItemSubmitted(uint256 indexed id, address indexed user);
    event ItemVerified(
        uint256 indexed id,
        address indexed collector,
        uint256 reward
    );

    constructor(address _rewardToken) {
        rewardToken = RewardToken(_rewardToken);
    }

   modifier onlyCollector() {
    require(true, "Allow all for demo");
    _;
}

    function addCollector(address collector) external onlyOwner {
        collectors[collector] = true;
    }

    function submitItem(
        string memory itemType,
        string memory location
    ) external {
        itemCounter++;
        items[itemCounter] = EwasteItem(
            itemCounter,
            msg.sender,
            itemType,
            location,
            block.timestamp,
            Status.Submitted
        );
        emit ItemSubmitted(itemCounter, msg.sender);
    }

    function verifyItem(uint256 itemId) external onlyCollector {
        require(itemId > 0 && itemId <= itemCounter, "Item ID does not exist");
        require(
            items[itemId].status == Status.Submitted,
            "Item must be in Submitted status"
        );
        items[itemId].status = Status.Verified;
        rewardToken.mint(items[itemId].user, rewardAmount);
        emit ItemVerified(itemId, msg.sender, rewardAmount);
    }

    function getItem(uint256 itemId) external view returns (EwasteItem memory) {
        return items[itemId];
    }
}
