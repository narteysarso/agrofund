import dotenv from 'dotenv';
import agrofundAbi from '../contract/agrofund.abi.json';

dotenv.config();

const agrofundInterface = {
    name: "agrofund",
    decimals: 18,
    symbol: "Celo",
    address: "0x164464777b7eF318D36Fb843442728eB7a29951c",
    abi: agrofundAbi
}

export default agrofundInterface;