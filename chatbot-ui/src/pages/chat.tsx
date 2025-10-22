import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import type { Message } from "../types/message";

export default function Chat({ matchData, initialMessage }: { matchData: any; initialMessage?: Message }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const chatRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (initialMessage) {
            setMessages((prev) => [...prev, initialMessage]);
        }
    }, [initialMessage]);

    // Scroll automático para baixo
    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");

        try {
            const res = await axios.post<{ resposta: string }>("http://localhost:3333/chat", {
                contexto: matchData,
                historico: updatedMessages,
            });

            const botMessage: Message = { role: "bot", content: res.data.resposta };
            setMessages([...updatedMessages, botMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "Erro ao se comunicar com a IA." },
            ]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "40px auto",
                display: "flex",
                flexDirection: "column",
                height: "80vh",
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                bgcolor: "background.paper",
            }}
        >
            <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
                Summoner Chat
            </Typography>

            <Box
                ref={chatRef}
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    mb: 2,
                    p: 1,
                    bgcolor: "grey.100",
                    borderRadius: 1,
                }}
            >
                {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} />
                ))}
            </Box>

            <Box sx={{ display: "flex" }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Digite sua pergunta..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    size="small"
                />
                <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
