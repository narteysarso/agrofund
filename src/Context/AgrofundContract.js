import { createContext, useState, useCallback, useEffect } from "react";
import { connectWallet as cW, createProject, getAccountBalance, getMembership, getRegistrationFee, register, fundProject as sponsorProject, withdrawFunds, getContractOwner, transferProjectOwnership, transferOwnership as transferContract, withdrawFees} from "../services/agrofund";
import {addProjectCreatedSubscriber, removeProjectCreatedSubscriber} from "../listeners/projectCreated";
import {addProjectFundedSubscriber, removeProjectFundedSubscriber} from "../listeners/projectFunded";
import { makeProject, makeFunded } from "../helpers/project";
import { ZERO_ADDRESS } from "../constants";
export const AgroFundContractContext = createContext();


export function AgroFundConsumer({children}){
    return(
        <AgroFundContractContext.Consumer>
            {children}
        </AgroFundContractContext.Consumer>
    )
}

export function AgroFundProvider({children}){
    const [account, setAccount] = useState(null);
    const [isContractOwner, setContractOwner] = useState(false);
    const [withdrawCharges, setWithdrawCharges] = useState(false);
    const [registrationModal, showRegistrationModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(new Map());
    const [projects, setProjects] = useState([]);
    const [projectFundings, setProjectFundings] = useState({});
    const [projectModal, showProjectModal] = useState(false);
    const [transferProject, setTransferProject] = useState(null);
    const [transferOwnership, setTransferOwnership] = useState(null);
    const [isRegistered, markRegistered] = useState(false);
    const [fundProject, setFundProject] = useState(null);
    const [accountBalance, setAccountBalance] = useState(0);
    const [contractBalance, setContractBalance] = useState(0);
    const [membership, setMemebership] = useState(null);
    const [charges, setCharges] = useState(0);
    const [error, setError] = useState(null);

    const connectWallet = useCallback(
        async () => {
            const account = await cW();
            const balance = await getAccountBalance(account);
            setAccount(account);
            setAccountBalance(balance);
        },[]
    )

    const registerToContract = async (userInfo = {}) => {
        await register(account, userInfo);
        const membership = await getMembership(account);
        setMemebership(membership);
    }

    const createProjectOnContract = async (projectInfo={}) =>{
        await createProject(account, projectInfo);
    }

    const fundProjectOnContract = async (index, amount) => {
        await sponsorProject(account, index, amount);
    }

    const withdrawFundsFromContract = async (index) => {
        await withdrawFunds(account, index)
    }

    const transferProjectOwnershipOnContract = async (index, toAddress) => {
        await transferProjectOwnership(account, index, toAddress);
    }
    
    const transferOwnershipOfContract = async (toAddress) => {
        await transferContract (account, toAddress);
    }

    const withdrawContractCharges = async (toAddress) => {
        await withdrawFees(toAddress);
    }

    const selectCategory = (key) => {
        setSelectedCategories( prev => {

            const nm = new Map(prev);
            if(nm.get(key) === true){
                nm.delete(key);
            }else{
                
                nm.set(key, true);
               
            }

            return nm;
        })
    }

    useEffect(()=>{
        (async() => {
            try {
                await connectWallet();
                const [charges, member, contractOwner] = await Promise.all([getRegistrationFee(), getMembership(account), getContractOwner()]);
                
                if(member.username && member.addressRecievable !== ZERO_ADDRESS){
                    markRegistered(true);
                    setMemebership(member);
                }

                if(account?.toLowerCase() === contractOwner?.toLowerCase() ){
                    setContractOwner(true);
                }

                setCharges(charges);
                // setContractBalance(balance)
            } catch (error) {
                setError(error.message);
            }
        })()
        
    },[account, connectWallet]);


    useEffect( ()=>{

        const key = addProjectCreatedSubscriber('projects-listener', (error, event) => {
            if(error){
                setError(error.message);
                return;
            }

            if(!event.event){
                return;
            }

            const project = makeProject(event.returnValues);
            
            setProjects( (prev) => [project, ...prev]);

        });

        const fundkey = addProjectFundedSubscriber (`projectfunded`, (error, event) => {
            if(error){
                return;
            }

            if(!event.event){
                return;
            }

            const fundEvent = makeFunded(event.returnValues);

            setProjectFundings( (prev) => {
                const newFundings = prev;
                const funding = newFundings[fundEvent.index];

                if(funding){
                    const amount = (parseFloat(funding.amount) + parseFloat(fundEvent.amount)).toFixed(2);
                    newFundings[fundEvent.index] = {...funding, amount};
                }else{
                    newFundings[fundEvent.index] = fundEvent;
                }

                return newFundings;
            })
        });

        return () => {
            removeProjectCreatedSubscriber(key)
            removeProjectFundedSubscriber(fundkey);
        };
    },[]);

    return(
        <AgroFundContractContext.Provider value={{
            account,
            accountBalance,
            contractBalance,
            membership,
            isRegistered,
            registrationModal,
            selectedCategories,
            projectModal,
            projects,
            projectFundings,
            fundProject,
            isContractOwner,
            transferProject,
            transferOwnership,
            charges,
            withdrawCharges,
            setWithdrawCharges,
            setFundProject,
            showProjectModal,
            setContractBalance,
            setAccount,
            connectWallet,
            showRegistrationModal,
            registerToContract,
            createProjectOnContract,
            selectCategory,
            fundProjectOnContract,
            withdrawFundsFromContract,
            setTransferProject,
            transferProjectOwnershipOnContract,
            setTransferOwnership,
            withdrawContractCharges,
            transferOwnershipOfContract
        }}>
            {children}
        </AgroFundContractContext.Provider>
    )
}