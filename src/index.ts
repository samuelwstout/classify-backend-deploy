import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
require('dotenv').config();

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  res.send('Classify backend');
});

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi.refreshAccessToken()
  .then(data => {
          res.json({
              accessToken: data.body.access_token,
              expiresIn: data.body.expires_in,
          })
      }).catch(() => {
          res.sendStatus(400)
      })
  })
  
  app.post('/login', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch((error) => {
        res.sendStatus(error)
    })
})


app.listen(port);
