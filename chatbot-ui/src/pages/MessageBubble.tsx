import { Box, Paper, Typography } from "@mui/material";
import type { Message } from "../types/message";

interface Props {
    message: Message;
}

export default function MessageBubble({ message }: Props) {
    const isUser = message.role === "user";

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                mb: 2,
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    maxWidth: "70%",
                    minWidth: 20,
                    p: 1,
                    bgcolor: isUser ? "primary.main" : "grey.300",
                    color: isUser ? "primary.contrastText" : "text.primary",
                    borderRadius: 2,
                    borderBottomRightRadius: isUser ? 0 : 8,
                    borderBottomLeftRadius: isUser ? 8 : 0,
                }}
            >
                <Typography variant="body1">{message.content}</Typography>
            </Paper>
        </Box>
    );
}
