import { getContract } from "../services/agrofund";

const subscribers = new Map();

export const addProjectFundedSubscriber = (key, fn) => {
    if (typeof fn !== "function") {
        throw new Error(`Paramater should be a function got ${typeof fn}`);
    }

    subscribers.set(key, fn);

    return key;
}


export const removeProjectFundedSubscriber = (key) => {
    subscribers.delete(key);
}

async function ProjectFundedSubscriptions() {
    const contract = await getContract();

    contract.events.ProjectFunded({
        fromBlock: "0X0"
    })
        .on("data", function (event) {
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