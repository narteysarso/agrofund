import { createContext, useState, useCallback, useEffect } from "react";
import { connectWallet as cW, createProject, getAccountBalance, getMembership, getRegistrationFee, register, fundProject as sponsorProject, withdrawFunds, getContractOwner} from "../services/agrofund";
import {addProjectCreatedSubscriber, removeProjectCreatedSubscriber} from "../listeners/projectCreated";
import { makeProject } from "../helpers/project";
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
    const [registrationModal, showRegistrationModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(new Map());
    const [projects, setProjects] = useState([]);
    const [projectModal, showProjectModal] = useState(false);
    const [isRegistered, markRegistered] = useState(false);
    const [fundProject, setFundProject] = useState(null);
    const [accountBalance, setAccountBalance] = useState(0);
    const [membership, setMemebership] = useState(null);
    const [fee, setFee] = useState(0);
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
                const [fee, member, contractOwner] = await Promise.all([getRegistrationFee(), getMembership(account), getContractOwner()]);
                
                if(member.username && member.addressRecievable !== ZERO_ADDRESS){
                    markRegistered(true);
                    setMemebership(member);
                }

                if(account?.toLowerCase() === contractOwner?.toLowerCase() ){
                    setContractOwner(true);
                }

                setFee(fee);
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

        return () => removeProjectCreatedSubscriber(key);
    },[]);

    return(
        <AgroFundContractContext.Provider value={{
            account,
            accountBalance,
            membership,
            isRegistered,
            registrationModal,
            selectedCategories,
            projectModal,
            projects,
            fundProject,
            isContractOwner,
            setFundProject,
            showProjectModal,
            setAccount,
            connectWallet,
            showRegistrationModal,
            registerToContract,
            createProjectOnContract,
            selectCategory,
            fundProjectOnContract,
            withdrawFundsFromContract
        }}>
            {children}
        </AgroFundContractContext.Provider>
    )
}