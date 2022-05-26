import BigNumber from "bignumber.js";
import { ERC20DECIMALS } from "../constants";

export function makeProject(_projectDetails) {
    
    const {
        index,
        owner,
        name,
        images,
        description,
        location,
        startDate,
        endDate,
        goal,
        funds,
        status
     } = _projectDetails;

    return Object.freeze({
        index,
        owner,
        name,
        images,
        description,
        location,
        startDate,
        endDate,
        goal: new BigNumber(goal).shiftedBy(-ERC20DECIMALS).toFixed(2),
        funds: new BigNumber(funds).shiftedBy(-ERC20DECIMALS).toFixed(2),
        status
    });
}

export function makeFunded(_fundInfo){
    const {amount, donor, index} = _fundInfo;
    return Object.freeze({
        amount: new BigNumber(amount).shiftedBy(-ERC20DECIMALS).toFixed(2), 
        donor, 
        index
    })
}