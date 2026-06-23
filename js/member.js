const loggedOutDiv = document.getElementById("auth-logged-out");
const loggedInDiv = document.getElementById("auth-logged-in");
const userDisplay = document.getElementById("user-display");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const soundDiv = document.getElementById("sound");
const meows = ["喵～", "咪屋？", "喵嗚！", "（呼嚕呼嚕...）"];
const usersKey = "petParadiseMembers";
const currentUserKey = "petParadiseCurrentMember";

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
  const randomIndex = Math.floor(Math.random() * meows.length);
  soundDiv.innerText = meows[randomIndex];
  setTimeout(() => {
    soundDiv.innerText = "";
  }, 2000);
});

updateAuthView();
