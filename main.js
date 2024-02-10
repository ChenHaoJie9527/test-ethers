import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum)

const main = async () => {
  const balanceVal = await provider.getBalance(
    "0x60c7A81Ecb6b2F53780aF71146e63C685b5931e5"
  );
  const balanceVaWei = ethers.formatEther(balanceVal);
  console.log(balanceVaWei);
};

main();
