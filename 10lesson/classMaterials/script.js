// wait until the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("helloBtn");
  const message = document.getElementById("message");

  button.addEventListener("click", () => {
    message.textContent = "Hello from JavaScript!";
  });
});
