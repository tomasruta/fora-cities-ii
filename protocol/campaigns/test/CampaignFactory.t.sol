// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/CampaignFactory.sol";
import "../src/Campaign.sol";

contract CampaignFactoryTest is Test {
  CampaignFactory private factory;

  function setUp() public {
    factory = new CampaignFactory();
  }

  function testCreateCampaign() public {
    // Arrange
    uint256 threshold = 1 ether;
    string memory name = "Test Campaign";


    // Act
    // Set up the expectations for the event emission
    // The booleans correspond to the indexed parameters of the event
    // If the event has indexed parameters, set the corresponding boolean to true
    vm.expectEmit(true, true, true, true);
    factory.createCampaign(threshold, name);

    // Assert
    address[] memory deployedCampaigns = factory.getDeployedCampaigns();
    assertEq(deployedCampaigns.length, 1, "Should have created one campaign");


    Campaign createdCampaign = Campaign(deployedCampaigns[0]);
    assertEq(
      createdCampaign.sponsor(),
      address(this),
      "Sponsor should be set correctly"
    );
    assertEq(
      createdCampaign.threshold(),
      threshold,
      "Threshold should be set correctly"
    );
    assertEq(createdCampaign.name(), name, "Name should be set correctly");
  }
}
