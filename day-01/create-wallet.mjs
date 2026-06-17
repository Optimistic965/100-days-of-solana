/** 
    import { generateKeyPairSigner } from "@solana/kit";
    
    const wallet = await generateKeyPairSigner();
    
    console.log("Your new wallet address:", wallet.address);
    console.log(
    "\nThis address is your public key. It's safe to share."
    );
    console.log(
    "The private key stays in memory. In a real app, you'd save it securely."
    );
    
    // address 1 created --> 6j9GyMtbD7zv8nCkC3cgN9Ra6UAubvkHQYwXao12hoeP (baln => 10SOL)
    // address 2 created --> GmLZV9UifsM6wVUYBcLPoNhrArXKCbqKAdwyhqjhWxny
 * 
 */

import {
  generateKeyPairSigner,
  createSolanaRpc,
  devnet,
  address
} from "@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const walletAddress = await address('GmLZV9UifsM6wVUYBcLPoNhrArXKCbqKAdwyhqjhWxny');

console.log("Wallet address:", walletAddress);
console.log("\n--- Go to https://faucet.solana.com/ and airdrop SOL to this address ---");
console.log("--- Then run this script again with the same address to check the balance ---\n");

// To check a specific address you've already funded, replace the line below:
// const { value: balance } = await rpc.getBalance(address("YOUR_ADDRESS_HERE")).send();
const { value: balance } = await rpc.getBalance(walletAddress).send();
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(`Balance: ${balanceInSol} SOL`);