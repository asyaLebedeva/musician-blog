const promotedPlayer = document.querySelector(".player");
const audio = promotedPlayer.querySelector(".player__audio");
const timeline = promotedPlayer.querySelector(".control__timeline");
const controlBtn = promotedPlayer.querySelector(".control__play-pause");

function playPause() {
    if (audio.paused) {
        audio.play();
        controlBtn.className = "control__play";
    } else { 
        audio.pause();
        controlBtn.className = "control__pause";
    }
}

controlBtn.addEventListener("click", playPause);

audio.addEventListener("ended", function() {
  controlBtn.className = "control__play";
});

function changeTimelinePosition () {
  const percentagePosition = (100*audio.currentTime) / audio.duration;
  timeline.style.backgroundSize = `${percentagePosition}% 100%`;
  timeline.value = percentagePosition;
}

audio.ontimeupdate = changeTimelinePosition;

function changeSeek () {
  const time = (timeline.value * audio.duration) / 100;
  audio.currentTime = time;
}

timeline.addEventListener("change", changeSeek);

const controller = document.querySelector(".control");
const durationCont= controller.querySelector(".control__duration-time");
const currentCont = controller.querySelector(".control__current-time");
let raf = null;

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}

export { calculateTime };

const displayDuration = () => {
    durationCont.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
    timeline.max = Math.floor(audio.duration);
}

const displayBufferedAmount = () => {
    const bufferedAmount = audio.buffered.length - 1;
    promotedPlayer.style.setProperty("--buffered-width", `${(bufferedAmount / timeline.max) * 100}%`);
}

const whilePlaying = () => {
    timeline.value = Math.floor(audio.currentTime);
    currentCont.textContent = calculateTime(timeline.value);
    promotedPlayer.style.setProperty("--seek-before-width", `${timeline.value / timeline.max * 100}%`);
    raf = requestAnimationFrame(whilePlaying);
}

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
} else {
    audio.addEventListener("loadedmetadata", () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    });
}

audio.addEventListener("progress", displayBufferedAmount);

timeline.addEventListener("input", () => {
    currentCont.textContent = calculateTime(timeline.value);
    if(!audio.paused) {
      cancelAnimationFrame(raf);
  }
});

timeline.addEventListener("change", () => {
    audio.currentTime = timeline.value;
    if(!audio.paused) {
      requestAnimationFrame(whilePlaying);
  }
});

$(".slider__carousel").slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 770,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 601,
      settings: {
        slidesToShow: 1
      }
    }
  ]
});  