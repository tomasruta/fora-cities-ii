// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Campaign.sol";

contract CampaignFactory {
  // Event to log the creation of a new Campaign contract
  event CampaignCreated(
    address campaignAddress,
    address sponsor,
    uint256 threshold,
    string name
  );

  // Array to store addresses of all created campaigns
  address[] public deployedCampaigns;

  // Function to create a new Campaign
  function createCampaign(
    uint256 _threshold,
    string memory _name
  ) public {
    Campaign newCampaign = new Campaign(payable(msg.sender), _threshold, _name);
    address newCampaignAddress = address(newCampaign);
    deployedCampaigns.push(newCampaignAddress);
    emit CampaignCreated(newCampaignAddress, msg.sender, _threshold, _name);
  }

  // Function to get all deployed campaigns
  function getDeployedCampaigns() public view returns (address[] memory) {
    return deployedCampaigns;
  }
}
