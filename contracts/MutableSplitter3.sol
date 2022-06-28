pragma solidity ^0.8.0;

contract MutableSplitter3 {
    address public owner;

    // The three recipients
    address payable public recipient_A;
    address payable public recipient_B;
    address payable public recipient_C;

    // Event triggered every time funds are received
    event TransferReceived(address from, uint256 total, uint256 share);

    // Event triggered every time recipients changed
    event RecipientsChanged(address prevAddress, address newAddress);

    constructor(
        address payable recA,
        address payable recB,
        address payable recC
    ) {
        owner = msg.sender;
        setNewRecipients(recA, recB, recC);
    }

    function setNewRecipients(
        address payable recA,
        address payable recB,
        address payable recC
    ) public {
        require(
            msg.sender == owner,
            "Setting new recipients can only be done by owner!"
        );

        require(recA != address(0), "New address cannot be 0!");
        require(recB != address(0), "New address cannot be 0!");
        require(recC != address(0), "New address cannot be 0!");

        address payable recA_prev = recipient_A;
        address payable recB_prev = recipient_B;
        address payable recC_prev = recipient_C;

        recipient_A = recA;
        recipient_B = recB;
        recipient_C = recC;

        if (recA_prev != recipient_A) {
            emit RecipientsChanged(recA_prev, recipient_A);
        }
        if (recB_prev != recipient_B) {
            emit RecipientsChanged(recB_prev, recipient_B);
        }
        if (recC_prev != recipient_C) {
            emit RecipientsChanged(recC_prev, recipient_C);
        }
    }

    receive() external payable {
        if (msg.value == 0) {
            return;
        }

        // Calculate each repicients' share
        uint256 share = msg.value / 3;

        // Send share to each recipient
        recipient_A.transfer(share);
        recipient_B.transfer(share);
        recipient_C.transfer(msg.value - (share * 2)); // Could be rounding error of 1 Wei

        // Emit event
        emit TransferReceived(msg.sender, msg.value, share);
    }
}
