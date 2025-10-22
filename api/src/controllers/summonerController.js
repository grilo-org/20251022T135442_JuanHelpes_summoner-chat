module.exports = {
  getPuuid: async (req, res) => {
    try {
      const { gameName, tagLine } = req.params;
      if (!gameName || !tagLine) {
        return res
          .status(400)
          .json({ error: "Game name and tag line are required" });
      }
      const apiKey = process.env.RIOT_API_KEY;
      const url = `${process.env.URL_GET_PUUID}${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}?api_key=${apiKey}`;

      const response = await fetch(url);

      if (response.status === 200) {
        response.json().then((data) => {
          // Chame getMatch passando req, res e o puuid retornado
          module.exports.getMatch({ params: { puuid: data.puuid } }, res);
          //console.log("Response data: ", data);
        });
      } else {
        return res.status(response.status).json("Error fetching PUUID");
      }
    } catch (error) {
      console.error("Error getting PUUID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getMatch: async (req, res) => {
    try {
      const { puuid } = req.params;
      if (!puuid) {
        return res.status(400).json({ error: "PUUID is required" });
      }
      const apiKey = process.env.RIOT_API_KEY;
      const url = `${process.env.URL_GET_MATCH}${puuid}/ids?start=0&count=1&api_key=${apiKey}`;

      const response = await fetch(url);

      if (response.status === 200) {
        response.json().then(async (data) => {
          const matchId = data[0];
          const matchInfoUrl = `${process.env.URL_GET_INFO_MATCH}${matchId}?api_key=${apiKey}`;

          const matchInfoResponse = await fetch(matchInfoUrl);
          if (matchInfoResponse.status !== 200) {
            return res
              .status(matchInfoResponse.status)
              .json("Error fetching match info");
          } else {
            const matchInfo = await matchInfoResponse.json();
            return res.json({ match: matchInfo, puuid: puuid });
          }
        });
      } else {
        return res.status(response.status).json("Error fetching match");
      }
    } catch (error) {
      console.error("Error getting match:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
