import { useState } from "react";
import Chat from "./pages/chat";
import MatchInfo from "./pages/matchInfo";
import { Box } from "@mui/material";

export default function App() {
  const [matchData, setMatchData] = useState<null | any>(null);
  const [initialBotMessage, setInitialBotMessage] = useState<any | null>(null);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f4f5" }}>
      <Box sx={{ flex: 2, borderRight: "1px solid #ddd" }}>
        <Chat matchData={matchData} initialMessage={initialBotMessage} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <MatchInfo onMatchData={setMatchData} onBotMessage={(msg) => setInitialBotMessage({ role: "bot", content: msg })} />
      </Box>
    </Box>
  );
}
