import { 
    devnet,
    createSolanaRpc,
    generateKeyPair,
    createKeyPairSignerFromBytes,
    createSignerFromKeyPair
} from "@solana/kit";
import { readFile, writeFile } from "node:fs/promises"

const WALLET_FILE = "wallet.json";
const rpc = createSolanaRpc(devnet('https://api.devnet.solana.com'))

async function loadOrCreateWallet () {
    try {
        const data = JSON.parse(await readFile(WALLET_FILE, "utf-8"))
        const secretBytes = new Uint8Array(data.secretKey)
        const wallet = createKeyPairSignerFromBytes(secretBytes)

        console.log("Loaded wallet", wallet.address)

        return wallet
    } catch {
        // Pass `true` so the keys are extractable for persistence
        const keyPair = await generateKeyPair(true)

        // Export the public key (raw format works for public keys)
        const publicKeyBytes = new Uint8Array(await crypto.subtle.exportKey('raw', keyPair.publicKey))

        // Export the private key using pkcs8 format
        const privateKeyBytes = new Uint8Array(await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)).slice(-32)

        // Solana keypair format: 64 bytes (32 private + 32 public)
        const keypairBytes = new Uint8Array(64);
        keypairBytes.set(privateKeyBytes, 0);
        keypairBytes.set(publicKeyBytes, 32);

        await writeFile(WALLET_FILE, JSON.stringify({ secretKey: Array.from(keypairBytes) }))

        const wallet = await createSignerFromKeyPair(keyPair)
        console.log("Created new wallet:", wallet.address);
        console.log(`Saved to ${WALLET_FILE}`);

        return wallet;
    }
}

/**
 * SO far we've used the following methods to create wallets
 * generateKeyPairSigner
 * createKeyPairSignerFromBytes
 * createSignerFromKeyPair
 * 
 */

const wallet = await loadOrCreateWallet();

// Check balance
const { value: balance } = await rpc.getBalance(wallet.address).send();
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(`\nAddress: ${wallet.address}`);
console.log(`Balance: ${balanceInSol} SOL`);

if (balanceInSol === 0) {
  console.log(
    `\nThis wallet has no SOL. Visit https://faucet.solana.com/ and airdrop some to:`
  );
  console.log(wallet.address);
}