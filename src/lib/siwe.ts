const DOMAIN = typeof window !== "undefined" ? window.location.hostname : "localhost";
const ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

/** Build EIP-4361 SIWE message string for backend verification */
export function buildSiweMessage(params: {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  nonce: string;
  issuedAt: string;
}) {
  const { domain, address, statement, uri, nonce, issuedAt } = params;
  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    "",
    statement,
    "",
    `URI: ${uri}`,
    "Version: 1",
    "Chain ID: 1",
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export interface WalletSignatureResult {
  message: string;
  signature: string;
  address: string;
}

/** Connect wallet, build SIWE message, sign; throws on cancel or error */
export async function getWalletSignature(
  statement = "Sign in to FractoLand to link your wallet."
): Promise<WalletSignatureResult> {
  const ethereum = typeof window !== "undefined" ? window.ethereum : undefined;
  if (!ethereum) {
    throw new Error("No wallet found. Install MetaMask or another Web3 wallet.");
  }
  const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts[0];
  if (!address) {
    throw new Error("Could not get wallet address");
  }
  const nonce = `fractoland-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const message = buildSiweMessage({
    domain: DOMAIN,
    address,
    statement,
    uri: ORIGIN,
    nonce,
    issuedAt: new Date().toISOString(),
  });
  const signature = (await ethereum.request({
    method: "personal_sign",
    params: [message, address],
  })) as string;
  return { message, signature, address };
}
