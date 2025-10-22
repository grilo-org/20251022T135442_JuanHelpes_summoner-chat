import { Box, Button, TextField, Typography, Paper, Divider } from "@mui/material";
import { useState } from "react";
import api from "../services/api"; // Importando a instância do Axios

export default function MatchInfo({ onMatchData, onBotMessage }: { onMatchData: (data: any) => void; onBotMessage?: (message: string) => void }) {
    const [nickname, setNickname] = useState("");
    const [tagline, setTagline] = useState("");
    const [matchData, setMatchData] = useState<null | any>(null);


    const handleSearch = async () => {
        // Exemplo estático — futuramente isso será substituído por API
        if (!nickname) {
            alert("Por favor, insira um nickname.");
            return;
        }
        const sanitizedNickname = nickname.toLowerCase().replace(/\s+/g, "");
        const sanitizedTagline = tagline.toLowerCase()

        try {
            const response = await api.post(`/summoner/${sanitizedNickname}/${sanitizedTagline}`);
            const data = response.data as { puuid: string; match: { info: any } };
            const puuid = data.puuid;
            const matchInfo = data.match.info;

            console.log("Match Info:", matchInfo);

            const player = matchInfo.participants.find((p: any) => p.puuid === puuid);

            if (!player) {
                alert("Jogador não encontrado na partida.");
                return;
            }

            const allies = matchInfo.participants
                .filter((p: any) => p.teamId === player.teamId && p.puuid !== puuid)
                .map((p: any) => p.championName);

            const enemies = matchInfo.participants
                .filter((p: any) => p.teamId !== player.teamId)
                .map((p: any) => p.championName);

            setMatchData({
                summonerName: nickname,
                role: player.individualPosition,
                champion: player.championName,
                allies,
                enemies,
            });

            onMatchData({
                summonerName: nickname,
                role: player.individualPosition,
                champion: player.championName,
                allies,
                enemies,
            });

            // Chamada para boas-vindas
            try {
                const res = await api.post("/chat/welcome", {
                    contexto: {
                        summonerName: nickname,
                        role: player.individualPosition,
                        champion: player.championName,
                        allies,
                        enemies,
                    },
                });
                if (onBotMessage) {
                    const resposta = (res.data as { resposta: string }).resposta;
                    onBotMessage(resposta); // <- envia resposta pro chat
                }
            } catch (err) {
                console.error("Erro ao gerar mensagem inicial da IA:", err);
            }
        } catch (error) {
            console.error("Erro ao buscar partida:", error);
            alert("Erro ao buscar partida. Verifique se o nickname e tag estão corretos.");
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 550, p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Detalhes da Partida
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                    size="small"
                    label="Nickname"
                    fullWidth
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <TextField
                    size="small"
                    label="Tag"
                    sx={{ width: '30%' }}
                    onChange={(e) => setTagline(e.target.value)}
                />
                <Button variant="contained" fullWidth onClick={handleSearch}>
                    Partida encontrada
                </Button>
            </Box>

            {matchData && (
                <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Jogador: <strong>{matchData.summonerName}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Campeão: <strong>{matchData.champion}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Rota: <strong>{matchData.role}</strong>
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="body2" fontWeight="bold">Aliados:</Typography>
                    <ul>
                        {matchData.allies.map((champ: string, i: number) => (
                            <li key={i}>{champ}</li>
                        ))}
                    </ul>

                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                        Inimigos:
                    </Typography>
                    <ul>
                        {matchData.enemies.map((champ: string, i: number) => (
                            <li key={i}>{champ}</li>
                        ))}
                    </ul>
                </Paper>
            )}
        </Box>
    );
}
