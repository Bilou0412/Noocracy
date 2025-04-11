import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import ChatInput from "@/components/chat-input"

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">Administrative Assistant</h1>
              <p className="text-gray-600">
                Welcome to your AI-powered administrative assistant. Use the input below to interact with the AI.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <ChatInput />
          </div>
        </main>
      </div>
    </div>
  )
}
