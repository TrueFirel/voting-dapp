const VotingApp = artifacts.require("../contracts/VotingApp.sol");

module.exports = function(deployer) {
    const AMOUNT_OF_VOTES_FOR_END = 3;
    const AMOUNT_OF_CANDIDATES = 2;

    deployer.deploy(VotingApp, AMOUNT_OF_VOTES_FOR_END, AMOUNT_OF_CANDIDATES);
};
