import { getContract } from "../services/agrofund";

const subscribers = new Map();

export const addProjectCreatedSubscriber = (key, fn) => {
    if (typeof fn !== "function") {
        throw new Error(`Paramater should be a function got ${typeof fn}`);
    }

    subscribers.set(key, fn);

    return key;
}


export const removeProjectCreatedSubscriber = (key) => {
    subscribers.delete(key);
}


async function Subscriptions() {
    const contract = await getContract();

    contract.events.ProjectCreated({
        fromBlock: 0,
        toBlock: 'latest'
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

Subscriptions();

