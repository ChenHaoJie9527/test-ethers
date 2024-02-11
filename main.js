import { ethers } from "ethers";
import { WTFAPI } from "./abi";

const provider = new ethers.BrowserProvider(window.ethereum);

const main = async () => {
  const balanceVal = await provider.getBalance(
    "0x60c7A81Ecb6b2F53780aF71146e63C685b5931e5"
  );
  const balanceVaWei = ethers.formatEther(balanceVal);
  console.log(balanceVaWei);
  linkInfuraNode();
};

// 链接 Infura 节点
const linkInfuraNode = async () => {
  const INFURA_ID = "55c4d2d02019481f93e965bee6710e95";

  // 连接以太坊主网
  const providerETH = new ethers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${INFURA_ID}`
  );

  // console.log("providerETH =>", providerETH);

  // 连接Goerli测试网
  const providerGoerli = new ethers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${INFURA_ID}`
  );

  // console.log("providerGoerli =>", providerGoerli);

  // 1. 查询vitalik在主网和Goerli测试网的ETH余额
  console.log("1. 查询vitalik在主网和Goerli测试网的ETH余额");

  const balanceEth = await providerETH.getBalance("vitalik.eth");
  console.log("balanceEth =>", ethers.formatEther(balanceEth));

  const balanceGoerli = await providerGoerli.getBalance(`vitalik.eth`);
  console.log("balanceGoerli =>", ethers.formatEther(balanceGoerli));

  // 2. 查询provider连接到了哪条链
  console.log("2. 查询provider连接到了哪条链");
  const network = await providerGoerli.getNetwork();
  console.log("network =>", network.name);

  // 3. 查询区块高度
  console.log("\n3. 查询区块高度");
  const blockNumber = await providerETH.getBlockNumber();
  console.log(blockNumber);

  // 4. 查询 vitalik 钱包历史交易次数
  console.log("\n4. 查询 vitalik 钱包历史交易次数");
  const txCount = await providerETH.getTransactionCount("vitalik.eth");
  console.log(txCount);

  // 5. 查询当前建议的gas设置
  console.log("\n5. 查询当前建议的gas设置");
  const feeData = await providerETH.getFeeData();
  console.log(feeData);

  // 6. 查询区块信息
  console.log("\n6. 查询区块信息");
  const block = await providerETH.getBlock(0);
  console.log(block);

  // 7. 给定合约地址查询合约bytecode，例子用的WETH地址
  console.log("\n7. 给定合约地址查询合约bytecode，例子用的WETH地址");
  const code = await providerETH.getCode(
    "0xc778417e063141139fce010982780140aa0cd5ab"
  );
  console.log(code);

  console.log("\n8. 创建只读contract");
  //创建只读Contract实例
  await createReadContract(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    WTFAPI,
    providerETH
  );

  // 第2种输入abi的方式：输入程序需要用到的函数，逗号分隔，ethers会自动帮你转换成相应的abi
  // 人类可读abi，以ERC20合约为例
  const abiERC20 = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
  ];
  const addressDAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI Contract
  await createReadContractV2(addressDAI, abiERC20, providerETH);

  await createRandomWallet();
  await createFromMnemonicWallet()
};

/**
 * 创建只读Contract合约实例需要三个参数
 * @param _address 合约地址
 * @param _abi 合约abi 分别有两种，一种是abi格式，一种是Ethers 实现的人类只读格式
 * @param provider 合约提供器
 */
async function createReadContract(_address, _abi, _provider) {
  const contractWETH = new ethers.Contract(_address, _abi, _provider);
  console.log("contractWETH =>", contractWETH);
  await getContractWETHInfo(contractWETH, _address);
}

async function createReadContractV2(_address, _abi, _provider) {
  // 创建稳定币DAI的合约实例
  const contractDAI = new ethers.Contract(_address, _abi, _provider);
  console.log("contractDAI  =>", contractDAI);
  await getContractDAIInfo(contractDAI, _address);
}

async function getContractWETHInfo(contractWETH, addressWETH) {
  // 1. 读取WETH合约的链上信息（WETH abi）
  const nameWETH = await contractWETH.name();
  const symbolWETH = await contractWETH.symbol();
  const totalSupplyWETH = await contractWETH.totalSupply();
  console.log("\n1. 读取WETH合约信息");
  console.log(`合约地址: ${addressWETH}`);
  console.log(`名称: ${nameWETH}`);
  console.log(`代号: ${symbolWETH}`);
  console.log(`总供给: ${ethers.formatEther(totalSupplyWETH)}`);
  const balanceWETH = await contractWETH.balanceOf("vitalik.eth");
  console.log(`Vitalik持仓: ${ethers.formatEther(balanceWETH)}\n`);
}

async function getContractDAIInfo(contractDAI, addressDAI) {
  // 2. 读取DAI合约的链上信息（IERC20接口合约）
  const nameDAI = await contractDAI.name();
  const symbolDAI = await contractDAI.symbol();
  const totalSupplDAI = await contractDAI.totalSupply();
  console.log("\n2. 读取DAI合约信息");
  console.log(`合约地址: ${addressDAI}`);
  console.log(`名称: ${nameDAI}`);
  console.log(`代号: ${symbolDAI}`);
  console.log(`总供给: ${ethers.formatEther(totalSupplDAI)}`);
  const balanceDAI = await contractDAI.balanceOf("vitalik.eth");
  console.log(`Vitalik持仓: ${ethers.formatEther(balanceDAI)}\n`);
}

// 创建随机钱包
async function createRandomWallet() {
  const randomWallet = ethers.Wallet.createRandom();
  console.log("randomWallet: ", randomWallet);
}

// 从助记词创建钱包对象
async function createFromMnemonicWallet() {
  const mnemonic = ethers.Wallet.createRandom().mnemonic;
  console.log('mnemonic =>', mnemonic);
}

main();
