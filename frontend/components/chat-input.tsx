"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Type pour les messages
type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

export default function ChatInput() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  // Charger les messages depuis localStorage au démarrage
  const [messages, setMessages] = useState<Message[]>(() => {
    // Vérifier si nous sommes du côté client (browser)
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages');
      return savedMessages ? JSON.parse(savedMessages) : [];
    }
    return [];
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour faire défiler vers le dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Sauvegarder les messages dans localStorage quand ils changent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const userMessage = input;
      setInput("") // Réinitialiser l'input après l'envoi
      
      // Ajouter le message de l'utilisateur à l'historique
      const newUserMessage = {
        id: Date.now(),
        text: userMessage,
        isUser: true
      };
      setMessages((prev: Message[]) => [...prev, newUserMessage]);
      
      // Ajouter un message temporaire pour montrer que le LLM écrit
      const tempBotMessageId = Date.now() + 1;
      const tempBotMessage = {
        id: tempBotMessageId,
        text: "",
        isUser: false
      };
      setMessages((prev: Message[]) => [...prev, tempBotMessage]);
      
      try {
        setLoading(true)
        // Envoyer la requête POST à l'URL n8n
        const response = await fetch('https://bilelnoocraty.app.n8n.cloud/webhook-test/bed99670-b39e-4662-86bc-167f18da646a', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        })
  
        const data = await response.json()
        console.log("Réponse reçue:", data)
        
        // Extraire la réponse du tableau reçu
        let botResponse = "";
        if (Array.isArray(data) && data.length > 0 && data[0].output) {
          botResponse = data[0].output;
        } else if (data && data.reponse) {
          botResponse = data.reponse;
        } else {
          botResponse = "Aucune réponse valide reçue de l'agent";
        }
        
        // Remplacer le message temporaire par la vraie réponse
        setMessages((prev: Message[]) => 
          prev.map((msg: Message) => 
            msg.id === tempBotMessageId
              ? { ...msg, text: botResponse }
              : msg
          )
        );
        
      } catch (error) {
        console.error("Erreur lors de l'envoi:", error)
        
        // Remplacer le message temporaire par un message d'erreur
        setMessages((prev: Message[]) => 
          prev.map((msg: Message) => 
            msg.id === tempBotMessageId
              ? { ...msg, text: "Erreur lors de la communication avec l'agent IA." }
              : msg
          )
        );
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col w-full h-[70vh] gap-4">
      {/* Conteneur de messages avec défilement */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            Aucun message. Commencez la conversation!
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.isUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce delay-200"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Formulaire d'entrée */}
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <Input
          className="flex-1"
          placeholder="Tapez votre requête ici..."
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Envoyer</span>
        </Button>
      </form>
    </div>
  )
}
