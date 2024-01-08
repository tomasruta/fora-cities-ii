// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Campaign {
  uint256 public threshold;
  address public sponsor;
  string public name;

  mapping(address => uint256) public contributions;
  uint256 public totalContributions;
  bool openToContributions;

  using EnumerableSet for EnumerableSet.AddressSet;
  EnumerableSet.AddressSet private authorizedContributors;

  // Events
  event ContributionReceived(address contributor, uint256 amount);
  event ContributorAuthorized(address contributor);
  event RefundIssued(address contributor, uint256 amount);
  event FundsWithdrawn(address sponsor, uint256 amount);

  constructor(
    address payable _sponsor,
    uint256 _threshold,
    string memory _name
  ) {
    sponsor = _sponsor;
    threshold = _threshold;
    name = _name;
    totalContributions = 0;
    openToContributions = true;
  }

  function contribute() public payable {
    require(
      openToContributions,
      "The campaign isn't accepting contributions right now"
    );
    contributions[msg.sender] += msg.value;
    totalContributions += msg.value;
    emit ContributionReceived(msg.sender, msg.value);
  }

  function authorizeContributor(address contributor) public {
    require(
      msg.sender == sponsor,
      "Only the campaign sponsor can authorize contributors"
    );
    authorizedContributors.add(contributor);
    emit ContributorAuthorized(contributor);
  }

  function refund(uint256 amount) public {
    require(
      totalContributions < threshold,
      "The campaign has reached its threshold, so refunds are no longer possible"
    );
    uint256 contribution = contributions[msg.sender];
    require(amount <= contribution, "Refund amount is more than contribution");
    contributions[msg.sender] = contribution - amount;
    payable(msg.sender).transfer(amount);

    emit RefundIssued(msg.sender, amount);
  }

  function withdraw(uint256 amount) public {
    require(msg.sender == sponsor, "Only the sponsor can withdraw funds");
    require(
      totalContributions >= threshold,
      "As the organizer, you can only withdraw once the contribution threshold is met"
    );
    require(
      amount <= address(this).balance,
      "More funds requested than available"
    );
    payable(sponsor).transfer(amount);

    emit FundsWithdrawn(sponsor, amount);
  }

  // TODO implement a way sponsor can refund all contributors even after threshold
  // maybe just a manual override setting
}
