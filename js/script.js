const promotedPlayer = document.querySelector(".player__container");
const playerControls = promotedPlayer.querySelector(".player__control");
const playerPlayList = promotedPlayer.querySelectorAll(".playlist__item");
const playerSongs = promotedPlayer.querySelectorAll(".playlist__song");
const playButton = promotedPlayer.querySelector(".player__play");
const nextPrev = playerPlayList.length - 1;
let count = 0;
let audio = playerSongs[count];
let isPlay = false;
let isMove = false;
const timeline = playerControls.querySelector(".player__timeline");

// play-pause/select-track

function next(index) {
  count = index || count;
    if (count == nextPrev) {
    count = count;
    return;
    }
  count++;
  run();
}

function back(index) {
  count = index || count;
    if (count == 0) {
    count = count;
    return;
    }
  count--;
  run();
  }

function selectSong() {
  audio = playerSongs[count];
  for (const item of playerSongs) {
    if (item != audio) {
    item.pause();
    }
  } if (isPlay) audio.play();
}

function run() {
  selectSong();
}

function playSong() {
  if (audio.paused) {
      audio.play();
      playButton.className = "player__play";
  } else { 
      audio.pause();
      playButton.className = "player__pause";
  }
}

// timeline
import { calculateTime, changeTimelinePosition, changeSeek, displayBufferedAmount, whilePlaying } from "./main.js";

const durationCont = playerControls.querySelector(".player__duration");
const currentCont = playerControls.querySelector(".player__current");

function timer() {
  let min = parseInt(audio.duration / 60);
  if (min < 10) min = "0" + min;
  let sec = parseInt(audio.duration % 60);
  if (sec < 10) sec = "0" + sec;
  return `${min}:${sec}`;
};

function showDuration() {
  setInterval(() => {
  const songTime = audio.duration 
  durationCont.textContent = timer(songTime);
  }, 100);
}

timeline.addEventListener("change", changeSeek);

if (audio.readyState > 0) {
  showDuration();
  displayBufferedAmount();
} else {
  audio.addEventListener("loadedmetadata", () => {
      showDuration();
      displayBufferedAmount();
  });
}

// evts
playButton.addEventListener("click", () => {
  isPlay = true;
  playSong();
});

playerSongs.forEach(audio => {
  audio.ontimeupdate = changeTimelinePosition;
  audio.addEventListener("progress", displayBufferedAmount);
})

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

document.addEventListener("pointerup", () => {
  isMove = false;
  audio.muted = false;
});

playerPlayList.forEach((item, index) => {
  item.addEventListener("click", function() {
  if (index > count) {
    next(index - 1);
    return;
  }
  if (index < count) {
    back(index + 1);
    return;
    }
  });
});

const titleSong = promotedPlayer.querySelectorAll(".playlist__title");

titleSong.forEach((el) => {
  el.addEventListener('click', function () {
    el.classList.add('playlist__active');
  })})

  titleSong.forEach((el) => {
  el.addEventListener('mouseout', function () {
    el.classList.remove('playlist__active');
  })})