import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import Web3 from 'web3';
import { makeMember } from "../helpers/member";
import { makeProject } from "../helpers/project";
import agrofundInterface from "../interface/agrofund";

const ERC20_DECIMALS = agrofundInterface.decimals;

async function getProvider() {
    if (!window.celo) {
        throw new Error("Please install the CeloExtensionWallet.")
    }

    await window.celo.enable();

    const web3 = new Web3(window.celo);
    const provider = newKitFromWeb3(web3);

    return provider;
}

export async function connectWallet() {

    const provider = await getProvider();

    const accounts = await provider.web3.eth.getAccounts();

    if (!accounts[0]) {
        throw new Error("Please make sure you have atleast one account in you wallet");
    }

    return accounts[0];
}

export async function getAccountBalance(account) {
    const provider = await getProvider();

    const balance = await provider.getTotalBalance(account);

    const cusd = balance.CELO.shiftedBy(-ERC20_DECIMALS).toFixed(2);

    return cusd;
}

export async function getContract() {
    const provider = await getProvider();

    const contract = await new provider.web3.eth.Contract(agrofundInterface.abi, agrofundInterface.address);

    return contract;
}

export async function getProjects(indexes) {
    const contract = await getContract();


    const results = await new Promise.all(
        indexes.reduce(
            (accum, idx) => {
                const _project = new Promise(async (resolve, reject) => {
                    const p = await contract.methods.projects(idx).call();
                    resolve(makeProject(p))
                })

                return [...accum, _project];
            },
            [])
    );

    return results;
}


export async function createProject(account, projectInfo = {}) {
    const contract = await getContract();
    const { name, description, images, location, goal, startDate, endDate } = projectInfo;
    await contract.methods.createProject(
        name,
        description,
        images,
        location,
        new BigNumber(goal).shiftedBy(ERC20_DECIMALS),
        startDate,
        endDate
    ).send({ from: account });
}

export async function register(account, { username, portfolio, description, image, addressRecievable } = {}) {
    const contract = await getContract();

    const fee = await contract.methods.registrationFee().call();

    await contract.methods.register(username, portfolio, description, image, addressRecievable).send({ value: fee, from: account });
}

export async function getMembership(account) {
    const contract = await getContract();

    if (!account) {
        return null;
    }
    const member = await contract.methods.members(account).call();

    if (member) {
        return makeMember(member);
    }
    return member;
}

export async function getRegistrationFee() {
    const contract = await getContract();

    const fee = await contract.methods.registrationFee().call();

    return new BigNumber(fee).shiftedBy(-ERC20_DECIMALS).toFixed(2);
}

export async function setRegistrationFee(newFee) {
    const contract = await getContract();

    await contract.methods.setRegistrationFee(newFee).send();
}

export async function transferProjectOwnership(account, index, toAddress) {
    const contract = await getContract();

    await contract.methods.transferProjectOwnership(index, toAddress).send({from : account});
}

export async function transferOwnership(account, toAddress) {
    const contract = await getContract();

    await contract.methods.transferOwnership(toAddress).send({from : account});
}

export async function setSelfDestruct(bool, message) {
    const contract = await getContract();

    await contract.methods.setSelfDestruct(bool, message).send();
}

export async function fundProject(account, index, amount) {
    const contract = await getContract();

    await contract.methods.fundProject(index).send({ from: account, value: new BigNumber(amount).shiftedBy(ERC20_DECIMALS)});
}

export async function withdrawFees(account) {
    const contract = await getContract();

    await contract.methods.withdrawFees(account).send({from: account});
}

export async function getContractOwner(){
    const contract = await getContract();

    return await contract.methods.owner().call();
}

export async function getFees() {
    const contract = await getContract();

    const fee = await contract.methods.getFees().call();

    return new BigNumber(fee).shiftedBy(-ERC20_DECIMALS).toFixed(2);
}

export async function withdrawFunds(account, index) {
    const contract = await getContract();

    await contract.methods.withdrawFunds(index).send({from: account});
}

export async function getBalance() {
    const contract = await getContract();

    const balance = await contract.methods.getBalance().call();

    return new BigNumber(balance).shiftedBy(-ERC20_DECIMALS).toFixed(2)
}
