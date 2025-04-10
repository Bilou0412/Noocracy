"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatInput() {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      console.log("Message sent:", input)
      setInput("")
      // Here you would connect to your AI agent
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Input
        className="flex-1"
        placeholder="Type your request here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  )
}
