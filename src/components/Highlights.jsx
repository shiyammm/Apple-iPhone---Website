import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import VideoCarousal from '../components/VideoCarousal';
import { rightImg, watchImg } from '../utils';

const Highlights = () => {
  useGSAP(() => {
    gsap.to('#title', {
      opacity: 1,
      y: 10,
    });
    gsap.to('.link', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.25,
    });
  });

  return (
    <section className="w-screen h-full overflow-hidden bg-zinc common-padding">
      <div className="screen-max-width">
        <div className="items-end justify-between mb-12 md:flex">
          <h1 className="section-heading" id="title">
            Get the highlights.
          </h1>
          <div className="flex flex-wrap items-end gap-5">
            <p className="link">
              Watch the film
              <img src={watchImg} alt="watch" className="ml-2" />
            </p>
            <p className="link">
              Watch the event
              <img src={rightImg} alt="right" className="ml-2" />
            </p>
          </div>
        </div>
        <VideoCarousal />
      </div>
    </section>
  );
};

export default Highlights;
