import { useAuth } from "@/contexts/AuthContext";
import { getWalletSignature } from "@/lib/siwe";
import { Loader2, Wallet as WalletIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LinkWalletCard() {
  const { user, linkWallet } = useAuth();
  const [linking, setLinking] = useState(false);

  const handleLinkWallet = async () => {
    setLinking(true);
    try {
      const { message, signature } = await getWalletSignature("Sign in to FractoLand to link your wallet.");
      await linkWallet(message, signature);
      toast.success("Wallet linked successfully.");
    } catch (e) {
      if ((e as { code?: number }).code === 4001) {
        toast.error("Signature rejected");
      } else {
        toast.error(e instanceof Error ? e.message : "Failed to link wallet");
      }
    } finally {
      setLinking(false);
    }
  };

  const walletAddress = user?.wallet_address;
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <WalletIcon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Web3 Wallet</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Link your Ethereum/Polygon wallet (e.g. MetaMask) to your account for on-chain actions.
      </p>
      {shortAddress ? (
        <div className="flex items-center justify-between gap-4 p-3 bg-secondary/50 rounded-lg">
          <code className="text-sm font-mono text-foreground">{shortAddress}</code>
          <span className="text-xs text-green-600 font-medium">Linked</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleLinkWallet}
          disabled={linking}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {linking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <WalletIcon className="h-4 w-4" />
              Connect & Link Wallet
            </>
          )}
        </button>
      )}
      {linking && (
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Sign the message in your wallet to link…
        </div>
      )}
    </div>
  );
}
