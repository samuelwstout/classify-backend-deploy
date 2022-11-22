import bodyParser from "body-parser";
import express from "express";
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

  app.post('/login', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI_LOCAL,
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