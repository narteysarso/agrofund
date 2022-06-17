import { getContract } from "../services/agrofund";

const subscribers = new Map();
const executedTransactions = Object();

export const addProjectFundedSubscriber = (key, fn) => {
    if (typeof fn !== "function") {
        throw new Error(`Paramater should be a function got ${typeof fn}`);
    }

    subscribers.set(key, fn);


    console.log(subscribers);

    return key;
}


export const removeProjectFundedSubscriber = (key) => {
    subscribers.delete(key);
}

async function ProjectFundedSubscriptions() {
    const contract = await getContract();
    contract.events.ProjectFunded({
        fromBlock: 0
    })
        .on("data", function (event) {

            if(executedTransactions[event.transactionHash]){
                return;
            }

            executedTransactions[event.transactionHash] = true;

            subscribers.forEach((subscriber) => {
                subscriber(null, event);
            })
            
        }).on("error", function (error, receipt) {
            subscribers.forEach((subscriber) => {
                subscriber(error, null);
            })
        });

}

ProjectFundedSubscriptions();