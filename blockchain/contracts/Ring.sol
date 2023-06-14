// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Ring is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private _ringUri = "";

    mapping(uint256 => address) public ringApprovals;

    constructor(string memory uri_) ERC721("Ring", "RING") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _ringUri = uri_;
    }

    function setURI(string memory uri) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _ringUri = uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);
        return _ringUri;
    }

    function approveRing(
        address to,
        uint256 tokenId
    ) public onlyRole(MINTER_ROLE) {
        ringApprovals[tokenId] = to;
    }

    function mintRing(uint256 tokenId) public {
        address to = ringApprovals[tokenId];
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        bytes32 deviceId
    ) public onlyRole(MINTER_ROLE) {
        _safeMint(to, uint256(deviceId));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        require(from == address(0), "Ring: Only minting allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
