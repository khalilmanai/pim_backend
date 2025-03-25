const ethers = require('ethers');
const fs = require('fs');
const solc = require('solc');

// Read the contract source code
const contractSource = fs.readFileSync(
  'src/Blockchain/contracts/InfractionContract.sol',
  'utf8',
);

// Compile the contract
const input = {
  language: 'Solidity',
  sources: { 'InfractionContract.sol': { content: contractSource } },
  settings: { outputSelection: { '*': { '*': ['*'] } } },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contractABI =
  output.contracts['InfractionContract.sol'].InfractionContract.abi;
const bytecode =
  output.contracts['InfractionContract.sol'].InfractionContract.evm.bytecode
    .object;

// Connect to Ganache
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = new ethers.Wallet(
  '0x3e519b38f853b2953dcc5f0b55b9e12ae4e22f0ad39f06a8df5a31ce6e7909e1',
  provider,
); // Replace with your private key

// Deploy the contract
async function deploy() {
  const factory = new ethers.ContractFactory(contractABI, bytecode, signer);
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log('Contract deployed to:', await contract.getAddress());
  console.log('ABI:', JSON.stringify(contractABI, null, 2));

  // Save deployment info
  fs.writeFileSync(
    'src/blockchain/contracts/InfractionContract.json',
    JSON.stringify(
      { address: await contract.getAddress(), abi: contractABI },
      null,
      2,
    ),
  );
}

deploy().catch(console.error);
