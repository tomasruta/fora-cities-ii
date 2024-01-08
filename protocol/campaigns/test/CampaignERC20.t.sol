// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console2 } from "forge-std/Test.sol";
import { CampaignERC20 } from "../src/CampaignERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("TestToken", "TT") {
    _mint(msg.sender, initialSupply);
  }
}

contract CampaignTest is Test {
  CampaignERC20 public campaign;
  ERC20 public token;
  address payable public sponsor;
  address[2] public contributors;
  uint256 public threshold;
  string public name;

  function setUp() public {
    sponsor = payable(vm.addr(1));
    threshold = 1000 * 10 ** 18; // 1000 tokens
    name = "Glorious Transhumanist Utopia";
    token = new TestToken(1000000000 * 10 ** 18);

    campaign = new CampaignERC20(sponsor, threshold, name, token);

    // setup each contributor with 500 test tokens
    vm.startPrank(sponsor);
    for (uint i = 0; i < contributors.length; i++) {
      address contributor = vm.addr(i + 2);
      contributors[i] = contributor;
      token.transfer(contributor, 500 * 10 ** 18); // Transfer 500 tokens from the sponsor to each contributor
    }
  }

  function testContribute() public {
    vm.startPrank(contributors[0]);
    campaign.contribute(500 * 10 ** 18);
    vm.stopPrank();

    vm.startPrank(contributors[1]);
    campaign.contribute(500 * 10 ** 18);
    vm.stopPrank();

    assertEq(token.balanceOf(address(campaign)), 1000 * 10 ** 18);
    assertEq(token.balanceOf(contributors[0]), 0);
    assertEq(token.balanceOf(contributors[1]), 0);
  }

  function testRefund() public {
    vm.startPrank(contributors[0]);
    campaign.contribute(400 * 10 ** 18);
    vm.stopPrank();

    vm.startPrank(contributors[1]);
    campaign.contribute(400 * 10 ** 18);
    vm.stopPrank();

    // Contributor 0 withdraws half their contribution
    vm.startPrank(contributors[0]);
    campaign.refund(200 * 10 ** 18);
    vm.stopPrank();

    // Contributor 1 withdraws their full contribution
    vm.startPrank(contributors[1]);
    campaign.refund(400 * 10 ** 18);
    vm.stopPrank();
  }

  function testDontRefund() public {
    vm.startPrank(contributors[0]);
    campaign.contribute(500 * 10 ** 18);
    vm.stopPrank();

    vm.startPrank(contributors[1]);
    campaign.contribute(300 * 10 ** 18);
    vm.expectRevert("Refund amount is more than contribution");
    campaign.refund(400 * 10 ** 18);

    // Reach the threshold
    campaign.contribute(200 * 10 ** 18);
    vm.stopPrank();

    vm.startPrank(contributors[0]);
    vm.expectRevert(
      "The campaign has reached its threshold, so refunds are no longer possible"
    );
    campaign.refund(500 * 10 ** 18);
  }

  function testWithdraw() public {
    vm.startPrank(contributors[0]);
    campaign.contribute(500 * 10 ** 18);

    vm.startPrank(sponsor);
    vm.expectRevert(
      "As the organizer, you can only withdraw once the contribution threshold is met"
    );
    campaign.withdraw(100 * 10 ** 18);

    vm.startPrank(contributors[1]);
    campaign.contribute(500 * 10 ** 18);

    vm.startPrank(sponsor);
    campaign.withdraw(800 * 10 ** 18);
    campaign.withdraw(200 * 10 ** 18);

    vm.expectRevert("More funds requested than available");
    campaign.withdraw(100 * 10 ** 18);
    vm.stopPrank();
  }
}
