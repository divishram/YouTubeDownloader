import http from "http";
import express from "express";
import dotenv from "dotenv";
import { logger } from "./logger";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import bodyParser from "body-parser";
import router from "./routes/router";
import sanitizeHtml from "sanitize-html";
// import validateYouTubeURL from "./utils/validURL";
import { validateYouTubeURL, getVideoInfo } from "./utils/validURL";
import ytdl from "ytdl-core";
// todo add mongo DB for list of downloads
// todo add async to functions
// todo use ts-node (i think maybe it can cause issues cause of diff engine, but just double check)

dotenv.config();
const PORT = process.env.PORT ?? 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "http://localhost:3000"}});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}

app.use(cors(corsOptions));
app.use(express.json());

app.set("view engine", "pug");
app.set("public", path.join(__dirname, "../public"));
app.use(express.static(path.join(__dirname, "../public")));

// app.get("/", (req, res) => {
//   logger.info("Info about server.");
//   res.render("index");
// });

app.use("/", router);

io.on("connection", (socket) => {

  console.log(sanitizeHtml("<img src=x onerror=alert('img') />"));

  console.log("a user connected!");

  socket.on("disconnect", () => console.log("A user disconnected"));

  socket.on("download", async (data) => {
    let sanitizedUrl = sanitizeHtml(data.url);
    // string should be "youtube.com/watch?v=" regex. youtube.com should be false bc homepage not video
    let isValidYouTubeURL = validateYouTubeURL(sanitizedUrl);
    
    if (isValidYouTubeURL) {
      let videoDetails =  await getVideoInfo(sanitizedUrl);
      console.log(videoDetails);

      socket.emit("video-info", videoDetails);
     
    }

  })
});


server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

// todo add typescript start script in package.json

/*
ASYNC EXAMLPE
app.get('/crypto', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api2.binance.com/api/v3/ticker/24hr'
    );

    const tickerPrice = response.data;

    res.json(tickerPrice);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Internal server error');
  }
});

app.listen('4000', () => {
  console.log('Server is running on port 4000');
});
*/
