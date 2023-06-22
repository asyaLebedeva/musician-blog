const body = document.body;
const player = document.querySelector(".last-track__playlist");
const playerHeader = player.querySelector(".last-track__header");
const playerControls = player.querySelector(".last-track__control");
const playerPlayList = player.querySelectorAll(".playlist__item");
const playerSongs = player.querySelectorAll(".playlist__song");
const playButton = player.querySelector(".last-track__play");
const playlistButton = player.querySelector(".playlist");

const nextPrev = playerPlayList.length - 1;
let count = 0;
let song = playerSongs[count];
let isPlay = false;

const progresFilled = playerControls.querySelector(".last-track__input");
let isMove = false;

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
  song = playerSongs[count];
  for (const item of playerSongs) {
    if (item != song) {
    item.pause();
    }
  } if (isPlay) song.play();
}

function run() {
  selectSong();
}

function playSong() {
  if (song.paused) {
      song.play();
      playButton.className = "last-track__play";
  } else { 
      song.pause();
      playButton.className = "last-track__pause";
  }
}

// timeline

function progressPosition () {
  const percentagePosition = (100*song.currentTime) / song.duration;
  progresFilled.style.backgroundSize = `${percentagePosition}% 100%`;
  progresFilled.value = percentagePosition;
}

const durationSongTime = playerControls.querySelector(".last-track__duration");
const currentSongTime = playerControls.querySelector(".last-track__current");

function timer() {
  let min = parseInt(song.duration / 60);
  if (min < 10) min = "0" + min;
  let sec = parseInt(song.duration % 60);
  if (sec < 10) sec = "0" + sec;
  return `${min}:${sec}`;
};

function showDuration() {
  setInterval(() => {
  const songTime = song.duration 
  durationSongTime.textContent = timer(songTime);
  }, 100);
}

const buffer = () => {
  const bufferedAmount = song.buffered.length - 1;
  playerControls.style.setProperty("--buffered-width", `${(bufferedAmount / progresFilled.max) * 100}%`);
}

progresFilled.addEventListener("change", () => {
  song.currentTime = progresFilled.value;
})

function realTime() {
  progresFilled.value = Math.floor(song.currentTime);
  currentSongTime.textContent = calculateTime(progresFilled.value);
  playerControls.style.setProperty("--seek-before-width", `${progresFilled.value / progresFilled.max * 100}%`);
}

progresFilled.addEventListener("change", realTime);

let anima = requestAnimationFrame(realTime);
progresFilled.addEventListener("input", () => {
  currentSongTime.textContent = calculateTime(progresFilled.value);
  if(!song.paused) {
    cancelAnimationFrame(anima);
  }
});

progresFilled.addEventListener("change", () => {
  song.currentTime = progresFilled.value;
  if(!song.paused) {
    requestAnimationFrame(realTime);
  }
});

// evts
playButton.addEventListener("click", () => {
  isPlay = true;
  playSong();
});

playerSongs.forEach(song => {
  song.addEventListener("loadedmetadata", showDuration);
  song.ontimeupdate = progressPosition;
  song.addEventListener("progress", buffer);
});

document.addEventListener("pointerup", () => {
  isMove = false;
  song.muted = false;
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

const titleSong = player.querySelectorAll(".playlist__title");

titleSong.forEach((el) => {
  el.addEventListener('click', function () {
    el.classList.add('playlist__active');
  })})

  titleSong.forEach((el) => {
  el.addEventListener('mouseout', function () {
    el.classList.remove('playlist__active');
  })})