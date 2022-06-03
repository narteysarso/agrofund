import { Button, Space } from "antd";
import { AgroFundConsumer } from "../Context/AgrofundContract";

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
            ({ account, accountBalance, connectWallet }) => (
                account ? <Button shape="round" type="primary">{accountBalance} Celo</Button> : <Button
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
            ({ isContractOwner, setWithdrawCharges }) => (
                isContractOwner ? <Button type="danger" onClick={setWithdrawCharges.bind(this, true) }>Withdraw Service Charges</Button> : null
            )
        }
    </AgroFundConsumer>)
}

const TransferContractCharges = () => {
    return (<AgroFundConsumer>
        {
            ({ isContractOwner, setTransferOwnership }) => (
                isContractOwner ? <Button type="danger" onClick={setTransferOwnership.bind(this, true)}>Transfer Contract</Button> : null
            )
        }
    </AgroFundConsumer>)
}

const ContractBalance = () => {
    return (<AgroFundConsumer>
        {
            ({ isContractOwner, charges }) => (
                isContractOwner ? <Button type="ghost" disabled shape="round">{charges} Celo Balance</Button> : null
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
                    <Space>
                        <Register />
                        <CreateProject />
                        <WithdrawServiceCharges />
                        <TransferContractCharges />
                    </Space>
                    <Space>
                        <ContractBalance />
                        <Wallet />
                    </Space>
                </>

            </div>
        </div>
    )
}