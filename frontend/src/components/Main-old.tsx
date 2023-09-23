import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { io } from "socket.io-client";
// todo add debounce function to prevent too many re-renders

export default function MainPart() {
  // const inputRef = useRef();
  const [url, setUrl] = useState<string>("");
  // const urlRef = useRef<string>("");

  useEffect(() => {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      console.log("connected! from react");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (url) {
      socket.emit("download", { url });
    }
    return () => {
      socket.off("download");
    }
  }, [url]);

  useEffect(() => {
    socket.on("video-info", (data) => {
      console.log(data);
    })
    return () => {
      socket.off("video-info");
    }
  })

  // todo onclick clear input e => e.target.value = "";
  return (
    <main className="container">
      <div className="description">
        <h3>Download into Video or MP3 format</h3>
      </div>

      <form>
        <input
          // todo add focus
          type="text"
          className="url"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            console.log(e.target.value);
          }}
        />
      </form>

      {/* <img src="https://img.youtube.com/vi/3z6NlW0Hm3M/sddefault.jpg" height={200} alt=""/> */}
    </main>
  );
}

/*

Steps: 
1. User enters URL, onchange event 
2. Socket sends info to server
3. Socket on server get info
4. Uses API to download mp3/mp4 etc.
5. Send data back to front end
6. Show loading on frontend
7. Show options form to select video quality/audio format
*/
