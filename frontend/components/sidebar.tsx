"use client"

import { useState } from "react"
import { Bot, Settings, Users, Wallet, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EthereumProvider } from "@walletconnect/ethereum-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const menuItems = [
    {
      name: "General Assistant",
      icon: <Bot className="h-5 w-5" />,
    },
    {
      name: "Customer Service",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]


// At the top of your file (outside the component, if needed)
let provider: EthereumProvider | null = null

const connectWallet = async () => {
  setIsConnecting(true)
  try {
    provider = await EthereumProvider.init({
      projectId: "e818096dd73a4d69e0824aac99e1b28a", // Replace with your real project ID
      chains: [1], // Ethereum mainnet
      showQrModal: true,
    })

    await provider.connect()

    const accounts = await provider.request({ method: "eth_accounts" })
    const connectedAddress = accounts[0]

    setWalletAddress(connectedAddress)
    setIsWalletConnected(true)
  } catch (error) {
    console.error("Wallet connection failed:", error)
  } finally {
    setIsConnecting(false)
  }
}

const connectWithMetaMask = async () => {
    setIsConnecting(true)
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask not found. Please install it.")
        return
      }
  
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const connectedAddress = accounts[0]
  
      setWalletAddress(connectedAddress)
      setIsWalletConnected(true)
    } catch (error) {
      console.error("MetaMask connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }
  

    const disconnectWallet = async () => {
    if (provider) {
      await provider.disconnect()
    }
    setIsWalletConnected(false)
    setWalletAddress("")
  }
  

  const formatWalletAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div
      className={cn(
        "bg-gray-900 text-white transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 md:w-16",
        "fixed md:relative z-10 h-full",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-800">
          {isOpen && <h2 className="text-lg font-semibold">AI Agents</h2>}
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-gray-800 hover:text-white",
                !isOpen && "justify-center px-2",
              )}
            >
              {item.icon}
              {isOpen && <span className="ml-3">{item.name}</span>}
            </Button>
          ))}
        </nav>

        <div className="border-t border-gray-800 p-2">
          {isWalletConnected ? (
            <div className={cn("mb-2 rounded-md bg-gray-800 p-2", !isOpen && "flex justify-center")}>
              {isOpen ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-500">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">{formatWalletAddress(walletAddress)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(`https://etherscan.io/address/${walletAddress}`, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="destructive" size="sm" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start bg-transparent text-white border-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-600",
                    !isOpen && "justify-center px-2",
                  )}
                >
                  <Wallet className="h-5 w-5" />
                  {isOpen && <span className="ml-3">Connect Wallet</span>}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Wallet</DialogTitle>
                  <DialogDescription>Connect your wallet to access additional features.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
                    {isConnecting ? "Connecting..." : "Connect with WalletConnect"}
                </Button>
                <Button variant="outline" onClick={connectWithMetaMask} disabled={isConnecting} className="w-full">
                    {isConnecting ? "Connecting..." : "Connect with MetaMask"}
                </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-center text-white hover:bg-gray-800 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "←" : "→"}
          </Button>
        </div>
      </div>
    </div>
  )
}
