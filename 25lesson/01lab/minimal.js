fetch("https://api.github.com/users/octocat")
  .then(r => r.json())
  .then(data => {
    const profile = document.querySelector("#profile");
    profile.innerHTML = `
      <p>${data.login}</p>
      <img src="${data.avatar_url}" width="80" />
    `;
  })
  .catch(err => console.error("Failed:", err));
