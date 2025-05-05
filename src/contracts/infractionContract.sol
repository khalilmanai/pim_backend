// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
   InfractionContract
   ------------------
   This contract allows you to record road infractions by storing a record
   that includes:
     - A hash representing the infraction (e.g., a screenshot or metadata hash)
     - A timestamp of when the infraction occurred
     - The vehicle plate number
     - The type of infraction (e.g., speeding, red light violation)
     
   An event is emitted each time an infraction is recorded.
*/

contract InfractionContract {
    struct Infraction {
        string infractionHash;
        uint256 timestamp;
        string vehiclePlate;
        string infractionType;
        
    }

    // Dynamic array to store all infractions
    Infraction[] public infractions;

    // Event to be emitted on each new infraction
    event InfractionRecorded(
        uint256 indexed id,
        string infractionHash,
        uint256 timestamp,
        string vehiclePlate,
        string infractionType
    );

    // Function to record a new infraction
    function recordInfraction(
        string calldata _infractionHash,
        uint256 _timestamp,
        string calldata _vehiclePlate,
        string calldata _infractionType
    ) external {
        infractions.push(Infraction(_infractionHash, _timestamp, _vehiclePlate, _infractionType));
        emit InfractionRecorded(infractions.length - 1, _infractionHash, _timestamp, _vehiclePlate, _infractionType);
    }

    // Function to retrieve an infraction by its ID
    function getInfraction(uint256 _id) external view returns (string memory, uint256, string memory, string memory) {
        require(_id < infractions.length, "Infraction does not exist");
        Infraction memory inf = infractions[_id];
        return (inf.infractionHash, inf.timestamp, inf.vehiclePlate, inf.infractionType);
    }
}
