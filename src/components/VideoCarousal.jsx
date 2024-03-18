import React, { useEffect, useRef, useState } from 'react';
import { hightlightsSlides } from '../constants';
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';

const VideoCarousal = () => {
  const [video, setVideo] = useState({
    isPlaying: false,
    isVideoEnd: false,
    videoStart: false,
    isLastVideo: false,
    videoId: 0,
  });
  const [loadedData, setLoadedData] = useState([]);

  const { isPlaying, isVideoEnd, videoStart, isLastVideo, videoId } = video;

  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  useGSAP(() => {
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: true,
          videoStart: true,
        }));
      },
    });

    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut',
    });
  }, [isVideoEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        videoStart && videoRef.current[videoId].play();
      }
    }
  }, [videoStart, videoId, isPlaying, loadedData]);

  const handleLoadedMetaData = (i, e) =>
    setLoadedData((prevVideo) => [...prevVideo, e]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let animate = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(
            animate.progress() * 100,
          ); /* to make it 100% */

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? '10vw'
                  : window.innerWidth < 1200
                  ? '10vw'
                  : '4vw',
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            });
          }
        },

        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            });
            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
            });
          }
        },
      });

      if (videoId === 0) {
        animate.restart();
      }

      const animateUpdate = () => {
        animate.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration,
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animateUpdate);
      } else {
        gsap.ticker.remove(animateUpdate);
      }
    }
  }, [videoId, videoStart]);

  const handleProcessBtn = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isVideoEnd: true,
          videoId: i + 1,
        }));
        break;

      case 'video-last':
        setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
        break;

      case 'video-reset':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
        break;

      case 'play':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      case 'pause':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={i} id="slider" className="pr-10 sm:pr-20">
            <div className="video-carousel_container">
              <div className="w-full h-full overflow-hidden bg-black flex-center rounded-3xl">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onEnded={() =>
                    i !== 3
                      ? handleProcessBtn('video-end', i)
                      : handleProcessBtn('video-last')
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="text-xl font-medium md:text-2xl">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-10 flex-center">
        <div className="py-5 bg-gray-300 rounded-full flex-center px-7 backdrop-blur">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="relative w-3 h-3 mx-2 bg-gray-200 rounded-full cursor-pointer"
            >
              <span
                className="absolute w-full h-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={
              isLastVideo
                ? () => handleProcessBtn('video-reset')
                : !isPlaying
                ? () => handleProcessBtn('play')
                : () => handleProcessBtn('pause')
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousal;
