import { CrownOutlined, EllipsisOutlined } from "@ant-design/icons";
import { createIcon } from "@download/blockies";
import { Avatar, Badge, Button, Card, Col, Divider, Popconfirm, Progress, Row, Space, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AgroFundConsumer } from "../Context/AgrofundContract";
import { makeFunded } from "../helpers/project";
import { addProjectFundedSubscriber, removeProjectFundedSubscriber } from "../listeners/projectFunded";


function FundProject({ fullyFunded = false, project = {} }) {
    return (
        <AgroFundConsumer>
            {({ fundProject, setFundProject }) => (
                fullyFunded ? <Button type="primary" icon={<CrownOutlined />} /> : !fundProject ? <Button type="primary" onClick={setFundProject.bind(this, project)}>Fund</Button> : null
            )}
        </AgroFundConsumer>
    )
}

function WithdrawFunds({ isOwner, fullyFunded, index}) {
    return (
        <AgroFundConsumer>
            {({withdrawFundsFromContract}) => (
                isOwner && fullyFunded 
                ? <Popconfirm
                    title={`Do you want to withdraw?`}
                    onConfirm={() => {withdrawFundsFromContract(index)}}
                >
                        <Button>Withdraw Funds</Button>
                    </Popconfirm> : null
            )}
        </AgroFundConsumer>
    )
}

function AvatarIcon({account, isOwner = false}){
    const icon = useMemo(() => createIcon({
        seed : account,
        size: 8,
         scale: 16,
    }).toDataURL(), [account]);

    return(
        isOwner ? 
        <Badge.Ribbon text={<CrownOutlined />} dot={isOwner} >
            <Avatar size={"large"} src={icon} alt={account} />
        </Badge.Ribbon>
        :
        <Avatar size={"large"} src={icon} alt={account} />
    )
}

function ProjectCard(projectInfo = {}) {
    const { index, name, description, images, location, startDate, endDate, goal, owner, account } = projectInfo;
    const [funded, setFunded] = useState(0);
    const isOwner = useMemo(() => owner?.toLowerCase() === account?.toLowerCase(), [owner, account])
    const fullyFunded = useMemo(() => funded === goal, [funded, goal]);

    useEffect(() => {
        const key = addProjectFundedSubscriber(`project-${index}`, (error, event) => {

            if(error){
                return;
            }
            const fundEvent = makeFunded(event.returnValues);
            if (fundEvent?.index?.toLowerCase() === index?.toLowerCase()) {
                setFunded(prev => parseFloat(parseFloat(prev) + parseFloat(fundEvent.amount)).toFixed(2));
            }
        });

        return () => removeProjectFundedSubscriber(key);
    }, []);

    return (
        <Card
            cover={ 
                <img
                    alt={`${name}`}
                    src={images}
                />
            }

            actions={[

                <FundProject project={projectInfo} fullyFunded={fullyFunded} />,
                <EllipsisOutlined key="ellipsis" />,
            ]}
        >
            <Card.Meta
                avatar={<AvatarIcon isOwner={isOwner} />}
                title={name}
                description={description}
            />
            <Space direction="vertical">
                <span>Location: {location}</span>
                <span>Goal: {goal} cUSD</span>
                <span>Fund: {funded} cUSD</span>
                {/* <Progress percent={funded} size="small" status="active" /> */}
                <span>Starting: {new Date(parseInt(startDate)).toDateString()}</span>
                <span>Ending: {new Date(parseInt(endDate)).toDateString()}</span>
                
                <WithdrawFunds isOwner={isOwner} fullyFunded={fullyFunded} index={index} />
            </Space>
        </Card>
    )
}

export default function Projects() {
    return (
        <AgroFundConsumer>
            {({ projects, selectedCategories, account }) => (
                <>
                    <Col xs={24}><Typography.Title level={4}>Projects</Typography.Title></Col>
                    <Row gutter={[16, 16]}>
                        {
                            (
                                selectedCategories.size ?

                                    projects?.filter((prj) =>
                                        [...prj.name?.split(' '), ...prj.description?.split(" ")].reduce((accum, term) => {
                                            return accum || selectedCategories.get(term.toString().trim());
                                        }, false)
                                    )
                                    :
                                    projects
                            )?.map(
                                projectInfo => <Col xs={24} sm={8} key={projectInfo.index} ><ProjectCard {...projectInfo} account={account} /></Col>)
                        }
                    </Row>
                </>
            )}

        </AgroFundConsumer>

    )
}