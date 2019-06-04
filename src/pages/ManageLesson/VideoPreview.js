import React from "react";
import DPlayer from "react-dplayer";

export default function VideoPreview ({classurl}) {
  return (
    <DPlayer video={{ url: classurl }} />
  )
}