import { Button, Space } from "antd";
import { AgroFundConsumer} from "../Context/AgrofundContract";

const Register = () => (
    <AgroFundConsumer>
        {
            ({ showRegistrationModal, isRegistered }) => (isRegistered ? null : <Button
                onClick={() => showRegistrationModal(true)}
                type="default"
                shape="round">
                Register
            </Button>)
        }
    </AgroFundConsumer>
);

const CreateProject = () => (
    <AgroFundConsumer>
        {
            ({ showProjectModal, isRegistered }) => (
                isRegistered ? <Button type="default" shape="round" onClick={() => showProjectModal(true)}>Create Project</Button> : null
            )
        }
    </AgroFundConsumer>
)


const Wallet = () => (
    <AgroFundConsumer>
    {
        ({ account , accountBalance, connectWallet}) => (
            account ?  <Button shape="round" type="primary">{accountBalance} cUSD</Button> : <Button 
            type="default" 
            shape="round"
            onClick={() => connectWallet()}
        > 
            Connect Wallet
        </Button>
        )
    }
</AgroFundConsumer>
)

const WithdrawServiceCharges = () => {
    return (<AgroFundConsumer>
        {
            ({isContractOwner}) => (
                isContractOwner ? <Button type="primary">Withdraw Service Charges</Button> : null
            )
        }
    </AgroFundConsumer>)
}




export default function Navbar() {
    return (
        <div style={{ display: 'flex', justifyContent: "space-between" }}>
            <h2>AgroFund</h2>
            <div>
                <>
                    <Register />
                    <CreateProject />
                    <WithdrawServiceCharges />
                    <Space>
                        <Wallet />
                    </Space>
                </> 

            </div>
        </div>
    )
}