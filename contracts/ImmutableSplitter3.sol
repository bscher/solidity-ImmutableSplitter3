// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

///
// Evenly split funds between 3 immutably defined people.
///
contract ImmutableSplitter3 {
    address public owner;

    // The three recipients
    address payable public recipient_A;
    address payable public recipient_B;
    address payable public recipient_C;

    // Event triggered every time funds are received and split
    event TransferReceived(address from, uint256 total, uint256 share);

    constructor(
        address payable recA,
        address payable recB,
        address payable recC
    ) {
        owner = msg.sender;

        recipient_A = recA;
        recipient_B = recB;
        recipient_C = recC;
    }

    receive() external payable {
        if (msg.value == 0) {
            return;
        }

        // Calculate each repicients' share
        uint256 share = msg.value / 3;

        assert(share > 0);

        // Send share to each recipient
        recipient_A.transfer(share);
        recipient_B.transfer(share);
        recipient_C.transfer(msg.value - (share * 2)); // Could be rounding error of 1 Wei

        // Emit event
        emit TransferReceived(msg.sender, msg.value, share);
    }
}
