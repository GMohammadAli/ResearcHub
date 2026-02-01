import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export const CustomAudioPlayer = ({
  audioUrl,
  ...restProps
}: {
  audioUrl: string | null;
}) => audioUrl && <AudioPlayer src={audioUrl} {...restProps} />;
