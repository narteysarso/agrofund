import { CrownOutlined} from "@ant-design/icons";
import { createIcon } from "@download/blockies";
import { Avatar, Badge, Button, Card, Col, Popconfirm, Row, Space, Typography } from "antd";
import { useMemo } from "react";
import { AgroFundConsumer } from "../Context/AgrofundContract";


function FundProject({ fullyFunded = false, project = {} }) {
    return (
        <AgroFundConsumer>
            {({ fundProject, setFundProject }) => (
                fullyFunded ? <Button type="primary" icon={<CrownOutlined />} /> : !fundProject ? <Button type="primary" onClick={setFundProject.bind(this, project)}>Fund</Button> : null
            )}
        </AgroFundConsumer>
    )
}

function TransferProject({ isOwner, project = {} }) {
    return (
        <AgroFundConsumer>
            {({ setTransferProject }) => (
                isOwner? <Button type="default" onClick={setTransferProject.bind(this, project)} >Transfer</Button> : null
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
    const { index, name, description, images, location, startDate, endDate, goal, owner, account, funds } = projectInfo;
    const isOwner = useMemo(() => owner?.toLowerCase() === account?.toLowerCase(), [owner, account])
    const fullyFunded = useMemo(() => funds >= parseFloat(goal), [funds, goal]);

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
                <TransferProject isOwner={isOwner} project={projectInfo}/>,
            ]}
        >
            <Card.Meta
                avatar={<AvatarIcon isOwner={isOwner} />}
                title={name}
                description={description}
            />
            <Space direction="vertical">
                <span>Location: {location}</span>
                <span>Goal: {goal} Celo</span>
                <span>Fund: {funds} Celo</span>
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
            {({ projects, projectFundings, selectedCategories, account }) => (
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
                                (projectInfo, idx) => {
                                return <Col xs={24} sm={8} key={idx} ><ProjectCard {...projectInfo} funds={ projectFundings[projectInfo?.index]?.amount || 0} account={account} /></Col>
                            })
                        }
                    </Row>
                </>
            )}

        </AgroFundConsumer>

    )
}