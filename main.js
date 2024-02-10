import { ethers } from "ethers";

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

  console.log("providerETH =>", providerETH);

  // 连接Goerli测试网
  const providerGoerli = new ethers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${INFURA_ID}`
  );

  console.log("providerGoerli =>", providerGoerli);
};

main();
