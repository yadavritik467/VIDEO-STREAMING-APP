import { useEffect, useRef } from "react";
import Hls from "hls.js";

function HLSPlayer({ src }) {
  const videoRef = useRef();

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error("HLS error", data);
      });
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    }
  }, [src]);

  return <video ref={videoRef} controls width="600" />;
}

export default HLSPlayer;
