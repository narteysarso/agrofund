import { List } from "antd";
import { useEffect, useState } from "react";
import { makeFunded } from "../helpers/project";
import { addProjectCreatedSubscriber, removeProjectCreatedSubscriber } from "../listeners/projectCreated";
import { addProjectFundedSubscriber, removeProjectFundedSubscriber } from "../listeners/projectFunded";

export default function ActivityLog() {
    const [activities, setActivities] = useState([]);

    useEffect(()=> {
        
        addProjectCreatedSubscriber('project-event-log', (error, event)=> {
            if(error){
                return;
            }

            if(!event.event){
                return;
            }

            const result = event.returnValues;
            const log = `#${event.blockNumber}: ${result.name} Project Created`;
            setActivities(prev => [log, ...prev]);
        });

        addProjectFundedSubscriber('project-fund-log', (error, event)=> {
            if(error){
                return;
            }
            const result = makeFunded(event.returnValues);

            const log = `#${event.blockNumber}: Project Funded ${result.amount} cUSD`;

            setActivities(prev => [log, ...prev]);
        } )

        return () => {
            removeProjectCreatedSubscriber('project-event-log')
            removeProjectFundedSubscriber(`project-event-fund-log`)
        } 
    },[])
    return (
        <List
            size="small"
            header={<h3>Live Updates</h3>}
            bordered
            dataSource={activities?.sort((a, b) => a.localeCompare(b))}
            renderItem={
                item => <List.Item>{item}</List.Item>
            }
        />
    )
}