// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract POM is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
    mapping(uint256 => uint256) private _totalSupply;
    uint256 private _tokenCounter;
    mapping(address => bool) public admins;
    // Used as the URI for all token types by relying on ID substitution, e.g. https://token-cdn-domain/{id}.json
    string private _uri;

    constructor() ERC1155("") {
        admins[msg.sender] = true; // Set the deployer as the initial admin
        _tokenCounter= 0;
        _uri = "";
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can perform this operation");
        _;
    }

    function addAdmin(address newAdmin) public onlyOwner {
        admins[newAdmin] = true;
    }

    function setURI(string memory newuri) public onlyAdmin {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function tokenCounter() 
    public 
    view 
    returns (uint256) 
    {
        return _tokenCounter;
    }
    
    function totalSupply(uint256 id) 
    public 
    view 
    override
    returns (uint256) 
    {
        return _totalSupply[id];
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyAdmin 
    {
        if (!exists(id)) {
            _tokenCounter++;
         }
        _totalSupply[id]++;
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        for (uint j = 0; j < ids.length; j++) {
            if (!exists(ids[j])) {
            _tokenCounter++;
         }
        _totalSupply[ids[j]]++;
        }
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}