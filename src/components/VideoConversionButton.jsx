import { Button } from "react-bootstrap";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { readFileAsBase64, sliderValueToVideoTime } from "../utils/utils";
import out from "../assets/out.svg";
import dark_download from "../assets/dark_download.svg";
import voice from "../assets/voice.png";

function VideoConversionButton({ videoPlayerState, sliderValues, videoFile, videoFiles, ffmpeg, onConversionStart = () => {}, onConversionEnd = () => {}, onGifCreated = () => {} }) {
  const convertToGif = async () => {
    onConversionStart(true);

    const inputFileName = "input.mp4";
    const outputFileName = "output.gif";

    ffmpeg.FS("writeFile", inputFileName, await fetchFile(videoFile));

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    await ffmpeg.run("-i", inputFileName, "-ss", `${minTime}`, "-to", `${maxTime}`, "-f", "gif", outputFileName);

    const data = ffmpeg.FS("readFile", outputFileName);

    const gifUrl = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));

    const link = document.createElement("a");
    link.href = gifUrl;
    link.setAttribute("download", "");
    link.click();

    onConversionEnd(false);
  };

  const onCutTheVideo = async () => {
    onConversionStart(true);

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));
    await ffmpeg.run("-ss", `${minTime}`, "-i", "input.mp4", "-t", `${maxTime}`, "-c", "copy", "output.mp4");

    const data = ffmpeg.FS("readFile", "output.mp4");
    const dataURL = await readFileAsBase64(new Blob([data.buffer], { type: "video/mp4" }));

    const link = document.createElement("a");
    link.href = dataURL;
    link.setAttribute("download", "");
    link.click();

    onConversionEnd(false);
  };

  const extractAudio = async () => {
    onConversionStart(true);

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));
    await ffmpeg.run("-ss", `${minTime}`, "-i", "input.mp4", "-t", `${maxTime}`, "-q:a", "0", "-map", "a", "output.mp3");

    const data = ffmpeg.FS("readFile", "output.mp3");
    const audioURL = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }));

    const link = document.createElement("a");
    link.href = audioURL;
    link.setAttribute("download", "output.mp3");
    link.click();

    onConversionEnd(false);
  };

  const mergeVideos = async () => {
    onConversionStart(true);

    const outputFileName = "merged.mp4";

    for (let i = 0; i < videoFiles.length; i++) {
      ffmpeg.FS("writeFile", `input${i}.mp4`, await fetchFile(videoFiles[i]));
    }

    const inputs = videoFiles.map((_, index) => `-i input${index}.mp4`).join(" ");
    const filters = videoFiles.map((_, index) => `[${index}:v:0][${index}:a:0]`).join("");
    const filterComplex = `${filters}concat=n=${videoFiles.length}:v=1:a=1[outv][outa]`;

    await ffmpeg.run(...inputs.split(" "), "-filter_complex", filterComplex, "-map", "[outv]", "-map", "[outa]", outputFileName);

    const data = ffmpeg.FS("readFile", outputFileName);
    const videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));

    const link = document.createElement("a");
    link.href = videoUrl;
    link.setAttribute("download", "");
    link.click();

    onConversionEnd(false);
  };

  return (
    <>
      <Button onClick={() => convertToGif()} className="gif__out__btn" style={{ marginBottom: 16 }}>
        <img src={out} alt="GIF 내보내기" />
        <p>GIF 내보내기</p>
      </Button>

      <Button onClick={() => extractAudio()} className="gif__out__btn">
        <img src={voice} alt="음성 내보내기" />
        <p>음성 내보내기</p>
      </Button>

      <Button onClick={() => onCutTheVideo()} className="gif__out__btn">
        <img src={dark_download} alt="비디오 저장하기" />
        <p>비디오 저장하기</p>
      </Button>
      {videoFiles.length > 0 && (
        <Button className="gif__out__btn" onClick={mergeVideos} disabled>
          <img src={voice} alt="병합" style={{ marginRight: 8 }} />
          영상 병합
        </Button>
      )}
    </>
  );
}

export default VideoConversionButton;
