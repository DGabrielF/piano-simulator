const pianoKeys = document.querySelectorAll(".piano-keyboard .key");
const volumeSlider = document.querySelector(".volume-slider input");
const hideKeys = document.querySelector(".keys-check input");

// const mappedKeys = [];
// let audio = new Audio("src/tunes/a.wav");

// const playTune = (key) => {
//   audio.src = `src/tunes/${key}.wav`;
//   audio.play();
//   const clickedKey = document.querySelector(`[data-key="${key}"]`);
//   clickedKey.classList.add("active");
//   setTimeout(()=>{clickedKey.classList.remove("active")},200);
// }

// pianoKeys.forEach((key) => {
//   key.addEventListener("click", () => playTune(key.dataset.key));
//   mappedKeys.push(key.dataset.key);
// });

// document.addEventListener("keydown", e => {
//   if (mappedKeys.includes(e.key))
//   {playTune(e.key)}
// });

const audioContext = new AudioContext();
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

const notes = {};

const playTune = (key) => {
  if (!notes[key]) {
    const oscillator = audioContext.createOscillator();
    oscillator.connect(gainNode);
    oscillator.type = "sine";
    oscillator.frequency.value = getKeyFrequency(key);

    notes[key] = oscillator;
    notes[key].start();
    gainNode.gain.value = Object.keys(notes).length > 1 ? 0.3 : 1;
  }
};

const stopTune = (key) => {
  if (notes[key]) {
    notes[key].stop();
    notes[key].disconnect();
    delete notes[key];
    gainNode.gain.value = Object.keys(notes).length > 1 ? 0.3 : 1;
  }
};

const getKeyFrequency = (key) => {
  const keyMap = {
    a: 261.63, // C
    w: 277.18, // C#
    s: 293.66, // D
    e: 311.13, // D#
    d: 329.63, // E
    f: 349.23, // F
    t: 369.99, // F#
    g: 392.00, // G
    y: 415.30, // G#
    h: 440.00, // A
    u: 466.16, // A#
    j: 493.88, // B
    k: 523.25, // C
    o: 554.37, // C#
    l: 587.33, // D
    p: 622.25, // D#
    ç: 659.25  // E
  };
  return keyMap[key];
};

const startNote = (key) => {
  const dataKey = document.querySelector(`[data-key="${key}"]`);
  if (dataKey) {
    playTune(key);
    dataKey.classList.add("active");
  }
};

const stopNote = (key) => {
  const dataKey = document.querySelector(`[data-key="${key}"]`);
  if (dataKey) {
    stopTune(key);
    dataKey.classList.remove("active");
  }
};

pianoKeys.forEach((key) => {
  const note = key.dataset.key;
  key.addEventListener("mousedown", () => startNote(note));
  key.addEventListener("mouseup", () => stopNote(note));
  key.addEventListener("mouseleave", () => stopNote(note));
  
  key.addEventListener("touchstart", (event) => {
    event.preventDefault();
    startNote(note);
  });
  key.addEventListener("touchend", (event) => {
    event.preventDefault();
    stopNote(note);
  });

  document.addEventListener("keydown", (e) => {
    const pressedKey = e.key.toLowerCase();
    if (pressedKey === note) {
      startNote(note);
    }
  });

  document.addEventListener("keyup", (e) => {
    const pressedKey = e.key.toLowerCase();
    if (pressedKey === note) {
      stopNote(note);
    }
  });
});


volumeSlider.addEventListener("input", (e) => audio.volume = e.target.value);

hideKeys.addEventListener("click", () => {pianoKeys.forEach(key => key.classList.toggle("hide"))});

function adjustLayout() {
  const container = document.querySelector('.container');
  if (window.innerWidth <= 640) {
    container.classList.add("rotate")
  } else {
    container.classList.remove("rotate")
  }
}
window.addEventListener('resize', adjustLayout);
adjustLayout();