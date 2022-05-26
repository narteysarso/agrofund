//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Agrofund {

    uint8 constant public DECIMALS = 18;
    uint8 constant public MEMBERSTATUSACTIVE = 1;
    uint8 constant public MEMBERSTATUSINACTIVE = 0;
   
    uint8 constant public PROJECTSTATUSPENDING = 1;
    uint8 constant public PROJECTSTATUSFUNDING = 2;
    uint8 constant public PROJECTSTATUSONGOING = 3;
    uint8 constant public PROJECTSTATUSPAUSED = 4;
    uint8 constant public PROJECTSTATUSCOMPLETED = 5;

    address public owner;

    // if true all functions in this contract will revert with _self_destruct_message
    bool internal _self_destruct = false; 
    string _self_destruct_msg = "";

    uint public projectsLength = 0;
    uint public registrationFee = 1000000000000000000 wei;
    
    uint public serviceCharge = 15;
    uint private totalfees = 0;

    struct Project {
        address owner;
        string name;
        string images;
        string description;
        string location;
        uint startDate;
        uint endDate;
        uint goal;
        uint funds;
        uint8 status;
    }

    struct Member {
        string username;
        string image;
        string portfolio;
        string description;
        uint8 status;
        address addressRecievable;
    }

    mapping(uint => Project) public projects;
    mapping(address => Member) public members;
    
    event ProjectCreated(
        uint indexed index, 
        address indexed owner, 
        string name,
        string images,
        string description, 
        string location,
        uint startDate, 
        uint endDate,
        uint goal, 
        uint funds,
        uint8 status
    );

    event MemberRegistered(
        address _address,
        string username,
        string image,
        string description,
        string portfolio
    );

    event OwnershipTransferred(address indexed from, address indexed to);

    event ChangedRegistrationFee(address indexed owner, uint previousAmount, uint newAmount);

    event ProjectOwnershipTransfered(uint indexed index, address indexed from, address indexed to);

    event ProjectFunded(uint indexed index, address indexed donor, uint amount);

    event ProjectDefunded(uint indexed index, address indexed owner, uint fundsAfterFee, uint fee);

    event FeesWithdrawn(address indexed by, address indexed to, uint amount);

    modifier onlyOwner {
        require(msg.sender == owner, "Authorization failed.");
        _;
    }

    modifier onlyActiveMember(address _address) {
        require(members[_address].status == MEMBERSTATUSACTIVE, "Not an active member");
        _;
    }
    
    modifier onlyProjectOwner(uint _index) {
        require(projects[_index].owner == msg.sender, "Not project owner");
        _;
    }
    

    modifier notDestructed{
        require(_self_destruct == false, _self_destruct_msg);
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    function createProject(
        string memory _name,
        string memory _description,
        string memory _images,
        string memory _location,
        uint _goal,
        uint _startDate,
        uint _endDate
    ) external notDestructed onlyActiveMember(msg.sender) {
        Project storage p = projects[projectsLength];
        p.name = _name;
        p.images = _images;
        p.description = _description;
        p.location =_location;
        p.goal = _goal * 10 ** DECIMALS;
        p.startDate = _startDate;
        p.endDate = _endDate;
        p.owner = msg.sender;
        p.status = PROJECTSTATUSFUNDING;

        emit ProjectCreated(
            projectsLength,
            msg.sender,
            p.name,
            p.images,
            p.description,
            p.location,
            p.startDate,
            p.endDate,
            p.goal,
            p.funds,
            p.status
        );

        projectsLength++;

    }

    function register(
        string memory _username,
        string memory _portfolio,
        string memory _description,
        string memory _image,
        address _addressRecievable
    ) external payable {
        require(msg.value >= registrationFee, "Registration fee is not enough");

        Member storage newMember = members[msg.sender];
        newMember.username =_username;
        newMember.portfolio = _portfolio;
        newMember.image = _image;
        newMember.description = _description;
        newMember.status = MEMBERSTATUSACTIVE;
        newMember.addressRecievable = _addressRecievable;

        emit MemberRegistered(msg.sender, _username,_image, _description, _portfolio);
    }

    function setRegistrationFee(uint _fee) external notDestructed  onlyOwner  {
        uint oldfee = registrationFee;
        registrationFee = _fee;
        emit ChangedRegistrationFee(msg.sender, oldfee, _fee);
    }

    function transferProjectOwnership(uint _index, address _to) external notDestructed onlyProjectOwner(_index) onlyActiveMember(_to){
        Project storage project = projects[_index];
        project.owner = _to;

        emit ProjectOwnershipTransfered(_index, msg.sender, _to);
    }

    function transferOwnership(address _address) external notDestructed onlyOwner {
        owner = _address;
        emit OwnershipTransferred(msg.sender, _address);
    }
    
    function setSelfDestruct(bool _bool, string memory _message) external notDestructed onlyOwner {
        _self_destruct = _bool;
        _self_destruct_msg = _message;
    }

    function fundProject(uint _index) external payable notDestructed onlyActiveMember(msg.sender) {
        require(projects[_index].status == PROJECTSTATUSFUNDING, "Project does not exist or is not receiving funds");
        require(msg.value > 0 , "Insufficient amount");
        projects[_index].funds += msg.value;

        emit ProjectFunded(_index, msg.sender, msg.value);
    }

    function withdrawFunds(uint _index) external payable notDestructed onlyProjectOwner(_index){
        Project storage project = projects[_index];
        require(project.funds > 0 && project.funds >= project.goal, "Project must be fully funded");
        uint fee = (project.funds / 100) * serviceCharge ;
        uint fundsAfterFee = project.funds - fee;
        project.funds = 0;
        totalfees += fee;
        project.status = PROJECTSTATUSONGOING;
        payable(project.owner).transfer(fundsAfterFee);
    
        emit ProjectDefunded(_index, msg.sender, fundsAfterFee, fee);
    }

    function getFees() external view onlyOwner returns(uint){
        return totalfees;
    }

    function withdrawFees(address payable _to) external payable onlyOwner {
        uint collectedFees = totalfees;

        _to.transfer(totalfees);

        totalfees = 0;

        emit FeesWithdrawn(msg.sender, _to, collectedFees);
    }

    function getBalance() external  view onlyOwner returns(uint) {
        return address(this).balance;
    }

}