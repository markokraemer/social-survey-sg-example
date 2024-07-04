import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, MoreVertical, Search, Edit, Trash2, Smile } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { getMessages, addMessage, updateMessage, deleteMessage, getContacts } from '@/lib/mockDatabase';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    setMessages(getMessages());
    setContacts(getContacts());
    if (getContacts().length > 0) {
      setSelectedContact(getContacts()[0]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulated WebSocket connection for real-time updates
    const interval = setInterval(() => {
      const shouldAddMessage = Math.random() < 0.3; // 30% chance of new message
      if (shouldAddMessage && selectedContact) {
        const newMockMessage = {
          id: messages.length + 1,
          sender: selectedContact.name,
          content: `This is a simulated message from ${selectedContact.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachments: []
        };
        const addedMessage = addMessage(newMockMessage);
        setMessages(prevMessages => [...prevMessages, addedMessage]);
        toast({
          title: "New message",
          description: `You have a new message from ${selectedContact.name}`,
        });
      }

      // Simulate typing indicator
      setIsTyping(Math.random() < 0.5);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedContact, messages, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setIsLoading(true);
      try {
        const message = {
          id: messages.length + 1,
          sender: 'You',
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachments: []
        };
        const addedMessage = addMessage(message);
        setMessages([...messages, addedMessage]);
        setNewMessage('');
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const message = {
            id: messages.length + 1,
            sender: 'You',
            content: `Sent an attachment: ${file.name}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachments: [{ name: file.name, url: URL.createObjectURL(file) }]
          };
          const addedMessage = addMessage(message);
          setMessages([...messages, addedMessage]);
          setUploadProgress(0);
          toast({
            title: "File uploaded",
            description: `${file.name} has been uploaded successfully.`,
          });
        }
      }, 500);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMessage = (id, newContent) => {
    const updatedMessage = updateMessage(id, newContent);
    if (updatedMessage) {
      setMessages(messages.map(msg => msg.id === id ? updatedMessage : msg));
      toast({
        title: "Message edited",
        description: "Your message has been updated.",
      });
    }
  };

  const handleDeleteMessage = (id) => {
    deleteMessage(id);
    setMessages(messages.filter(msg => msg.id !== id));
    toast({
      title: "Message deleted",
      description: "Your message has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Secure Messaging</h1>
      <Card className="h-[calc(100vh-12rem)] flex">
        <div className="w-1/4 border-r">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <AnimatePresence>
                {filteredContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center space-x-4 p-2 hover:bg-accent cursor-pointer ${selectedContact?.id === contact.id ? 'bg-accent' : ''}`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.status}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </div>
        <div className="flex-grow flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Conversation with {selectedContact?.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Block User</DropdownMenuItem>
                  <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow pr-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`flex ${message.sender === 'You' ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[70%]`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{message.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`mx-2 ${message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-secondary'} rounded-lg p-3 break-words`}>
                        <p>{message.content}</p>
                        {message.attachments.map((attachment, index) => (
                          <a key={index} href={attachment.url} className="text-blue-500 hover:underline block mt-2" target="_blank" rel="noopener noreferrer">
                            {attachment.name}
                          </a>
                        ))}
                        <span className="text-xs opacity-50 block mt-2">{message.timestamp}</span>
                        {message.sender === 'You' && (
                          <div className="flex justify-end space-x-2 mt-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditMessage(message.id, prompt('Edit message:', message.content))}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteMessage(message.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollArea>
            {isTyping && selectedContact && (
              <div className="text-sm text-muted-foreground mb-2">
                {selectedContact.name} is typing...
              </div>
            )}
            {uploadProgress > 0 && (
              <Progress value={uploadProgress} className="w-full mb-2" />
            )}
            <div className="flex items-center space-x-2 mt-4">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button variant="outline" size="icon" onClick={() => document.getElementById('file-upload').click()}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}