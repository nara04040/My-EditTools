import { useEffect, useRef, useState } from "react";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import styles from "./VideoEditor.module.css";
import { Button, Modal, Spinner, Toast, ToastContainer } from "react-bootstrap";
import RangeSlider from "../components/RangeSlider";
import video_placeholder from "/video_placeholder.png";
import VideoPlayer from "./VideoPlayer";
import { sliderValueToVideoTime } from "../utils/utils";
import VideoConversionButton from "./VideoConversionButton";
import "bootstrap/dist/css/bootstrap.min.css";

const ffmpeg = createFFmpeg({ log: true });

function VideoEditor() {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [videoFile, setVideoFile] = useState();
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPlayerState, setVideoPlayerState] = useState();
  const [videoPlayer, setVideoPlayer] = useState();
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [processing, setProcessing] = useState(false);
  const [show, setShow] = useState(false);
  const uploadFile = useRef("");

  useEffect(() => {
    ffmpeg.load().then(() => {
      setFFmpegLoaded(true);
    });
  }, []);

  useEffect(() => {
    const min = sliderValues[0];
    if (min !== undefined && videoPlayerState && videoPlayer) {
      videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
    }
  }, [sliderValues]);

  useEffect(() => {
    if (videoPlayer && videoPlayerState) {
      const [min, max] = sliderValues;
      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
      const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

      if (videoPlayerState.currentTime < minTime) {
        videoPlayer.seek(minTime);
      }
      if (videoPlayerState.currentTime > maxTime) {
        videoPlayer.seek(minTime);
      }
    }
  }, [videoPlayerState]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPlayerState(undefined);
      setVideoPlayerState(undefined);
    }
    setSliderValues([0, 100]);
  }, [videoFile]);

  const handleFilesChange = (e) => {
    setVideoFiles([...e.target.files]);
  };

  if (!ffmpegLoaded) return <div>load</div>;

  return (
    <article>
      <div className={styles.title_container}>
        <h1 className={styles.title}>Video Edit</h1>
        {videoFile && (
          <>
            <div>
              <input onChange={(e) => setVideoFile(e.target.files[0])} type="file" accept="video/*" style={{ display: "none" }} ref={uploadFile} />
              <Button
                className={styles.re__upload__btn}
                onClick={() => uploadFile.current.click()}
                style={{ width: "fit-content", backgroundColor: "#fff", border: "1px solid #bdbdbd", borderRadius: "4px", padding: "8px", color: "#4f4f4f", fontWeight: 700, fontSize: "13px" }}
              >
                비디오 재선택
              </Button>

              <div>
                <input onChange={(e) => handleFilesChange(e)} type="file" accept="video/mp4" multiple />
              </div>
            </div>
          </>
        )}
      </div>

      <section>
        {videoFile ? (
          <VideoPlayer src={videoFile} onPlayerChange={(player) => setVideoPlayer(player)} onChange={(state) => setVideoPlayerState(state)} />
        ) : (
          <>
            <img src={video_placeholder} alt="비디오를 업로드해주세요." style={{ marginBottom: 32 }} />
            <div className={styles.video_editor}>
              <input onChange={(e) => setVideoFile(e.target.files[0])} type="file" accept="video/*" style={{ display: "none" }} ref={uploadFile} />
              <Button className={styles.upload_btn} onClick={() => uploadFile.current.click()} style={{ padding: "16px 8px", width: "400px" }}>
                비디오 업로드하기
              </Button>
            </div>
          </>
        )}
      </section>

      {videoFile && (
        <>
          <section
            style={{
              width: "100%",
              marginTop: 30,
              marginBottom: 100,
            }}
          >
            <RangeSlider
              min={0}
              max={100}
              onChange={({ min, max }) => {
                setSliderValues([min, max]);
              }}
              disabled={!videoPlayerState?.duration}
              duration={videoPlayerState?.duration || 0}
            />
          </section>
          <section className={styles.conversion_btn_wrapper}>
            <VideoConversionButton
              onConversionStart={() => {
                setProcessing(true);
              }}
              onConversionEnd={() => {
                setProcessing(false);
                setShow(true);
              }}
              ffmpeg={ffmpeg}
              videoPlayerState={videoPlayerState}
              sliderValues={sliderValues}
              videoFile={videoFile}
              videoFiles={videoFiles}
            />
          </section>
        </>
      )}

      <ToastContainer className="p-3" position={"top-center"} style={{ zIndex: 1 }}>
        <Toast onClose={() => setShow(false)} show={show} delay={2000} bg="dark" autohide>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Video Editor</strong>
          </Toast.Header>
          <Toast.Body>내보내기가 완료되었습니다.</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={processing} onHide={() => setProcessing(false)} backdrop={false} keyboard={false} centered size="sm">
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>

          <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: "#c8c8c8" }}>내보내기가 진행중입니다.</p>
        </div>
      </Modal>
    </article>
  );
}

export default VideoEditor;
