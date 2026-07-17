const loggedOutDiv = document.getElementById("auth-logged-out");
const loggedInDiv = document.getElementById("auth-logged-in");
const userDisplay = document.getElementById("user-display");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const soundDiv = document.getElementById("sound");
const usersKey = "petParadiseMembers";
const currentUserKey = "petParadiseCurrentMember";
let audioContext;
let meowStopTimer;
const recordedMeow = new Audio("audio/cat-meow.ogg?v=20260718-1");
recordedMeow.preload = "auto";

function playMeowSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  audioContext = audioContext || new AudioContext();

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const now = audioContext.currentTime;
  const duration = 1.05;
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const voice = audioContext.createOscillator();
  const overtone = audioContext.createOscillator();
  const overtoneGain = audioContext.createGain();
  const vibrato = audioContext.createOscillator();
  const vibratoGain = audioContext.createGain();

  voice.type = "triangle";
  voice.frequency.setValueAtTime(360, now);
  voice.frequency.exponentialRampToValueAtTime(690, now + .2);
  voice.frequency.exponentialRampToValueAtTime(560, now + .48);
  voice.frequency.exponentialRampToValueAtTime(290, now + duration);

  overtone.type = "sine";
  overtone.frequency.setValueAtTime(720, now);
  overtone.frequency.exponentialRampToValueAtTime(1380, now + .2);
  overtone.frequency.exponentialRampToValueAtTime(1120, now + .48);
  overtone.frequency.exponentialRampToValueAtTime(580, now + duration);

  vibrato.type = "sine";
  vibrato.frequency.setValueAtTime(7, now);
  vibratoGain.gain.setValueAtTime(7, now);
  vibratoGain.gain.linearRampToValueAtTime(18, now + duration);
  vibrato.connect(vibratoGain);
  vibratoGain.connect(voice.frequency);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, now);
  filter.frequency.exponentialRampToValueAtTime(1300, now + duration);
  filter.Q.value = 2.5;

  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.2, now + .06);
  gain.gain.setValueAtTime(.2, now + .32);
  gain.gain.exponentialRampToValueAtTime(.09, now + .72);
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);

  overtoneGain.gain.setValueAtTime(.035, now);
  overtoneGain.gain.exponentialRampToValueAtTime(.0001, now + duration);

  voice.connect(filter);
  overtone.connect(overtoneGain);
  overtoneGain.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  voice.start(now);
  overtone.start(now);
  vibrato.start(now);
  voice.stop(now + duration);
  overtone.stop(now + duration);
  vibrato.stop(now + duration);
}

function playRecordedMeow() {
  window.clearTimeout(meowStopTimer);
  recordedMeow.pause();
  recordedMeow.currentTime = 0;
  recordedMeow.volume = .8;

  const playPromise = recordedMeow.play();

  if (playPromise) {
    playPromise.catch(playMeowSound);
  }

  meowStopTimer = window.setTimeout(() => {
    recordedMeow.pause();
    recordedMeow.currentTime = 0;
  }, 2200);
}

function getUsers() {
  return JSON.parse(localStorage.getItem(usersKey) || "{}");
}

function saveUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function getCurrentUser() {
  return localStorage.getItem(currentUserKey);
}

function setCurrentUser(email) {
  localStorage.setItem(currentUserKey, email);
}

function clearCurrentUser() {
  localStorage.removeItem(currentUserKey);
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function updateAuthView() {
  const currentUser = getCurrentUser();

  if (currentUser) {
    loggedOutDiv.classList.add("hidden");
    loggedInDiv.classList.remove("hidden");
    userDisplay.innerText = `尊貴的會員：${currentUser}`;
    return;
  }

  loggedOutDiv.classList.remove("hidden");
  loggedInDiv.classList.add("hidden");
}

function validateForm(email, password) {
  if (!email || !password) {
    alert("請輸入電子郵件與密碼。");
    return false;
  }

  if (!emailInput.checkValidity()) {
    alert("請輸入正確的電子郵件格式。");
    return false;
  }

  if (password.length < 6) {
    alert("密碼至少需要 6 個字元。");
    return false;
  }

  return true;
}

document.getElementById("signup-button").addEventListener("click", () => {
  const email = normalizeEmail(emailInput.value);
  const password = passwordInput.value;

  if (!validateForm(email, password)) {
    return;
  }

  const users = getUsers();

  if (users[email]) {
    alert("這個電子郵件已經註冊過，請直接登入。");
    return;
  }

  users[email] = { password };
  saveUsers(users);
  setCurrentUser(email);
  updateAuthView();
  alert("註冊成功並已自動登入！");
});

document.getElementById("login-button").addEventListener("click", () => {
  const email = normalizeEmail(emailInput.value);
  const password = passwordInput.value;

  if (!validateForm(email, password)) {
    return;
  }

  const users = getUsers();

  if (!users[email] || users[email].password !== password) {
    alert("登入失敗：電子郵件或密碼不正確。");
    return;
  }

  setCurrentUser(email);
  updateAuthView();
  alert("登入成功！");
});

document.getElementById("logout-button").addEventListener("click", () => {
  clearCurrentUser();
  updateAuthView();
  alert("已成功登出！");
});

document.getElementById("meow-button").addEventListener("click", () => {
  playRecordedMeow();
  soundDiv.innerText = "喵嗚～";
  setTimeout(() => {
    soundDiv.innerText = "";
  }, 2000);
});

updateAuthView();
