// ── Cookie helpers ──────────────────────────────────────────────

/**
 * Set a cookie by name with an optional expiry in days.
 * @param {string} name
 * @param {string} value
 * @param {number} days  - how many days until the cookie expires
 */
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

/**
 * Read a cookie by name.  Returns null if the cookie does not exist.
 * @param {string} name
 * @returns {string|null}
 */
function getCookie(name) {
  const prefix = name + "=";
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.slice(prefix.length));
    }
  }
  return null;
}

/**
 * Delete a cookie by name (sets its expiry to the past).
 * @param {string} name
 */
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

// ── App logic ────────────────────────────────────────────────────

const welcomeDiv  = document.getElementById("welcome");
const welcomeMsg  = document.getElementById("welcome-msg");
const nameFormDiv = document.getElementById("name-form");
const form        = document.getElementById("form");
const nameInput   = document.getElementById("name-input");
const clearBtn    = document.getElementById("clear-btn");

const COOKIE_NAME = "userName";

function showWelcome(name) {
  welcomeMsg.textContent = `Welcome back, ${name}!`;
  welcomeDiv.style.display  = "block";
  nameFormDiv.style.display = "none";
}

function showForm() {
  welcomeDiv.style.display  = "none";
  nameFormDiv.style.display = "block";
}

// Check cookie on page load
const savedName = getCookie(COOKIE_NAME);

if (savedName) {
  showWelcome(savedName);
} else {
  showForm();
}

// Save the name when the form is submitted
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  setCookie(COOKIE_NAME, name, 7); // expires in 7 days
  showWelcome(name);
});

// Clear the cookie and show the form again
clearBtn.addEventListener("click", function () {
  deleteCookie(COOKIE_NAME);
  nameInput.value = "";
  showForm();
});
