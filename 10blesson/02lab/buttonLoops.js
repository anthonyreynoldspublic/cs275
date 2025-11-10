function dropButtons(n = 5) {
  for (let i = 0; i < n; i++) {
    const btn = document.createElement('button');
    btn.textContent = 'sleepy';
    btn.style.position = 'absolute';
    btn.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    btn.style.top = Math.random() * (window.innerHeight - 40) + 'px';
    btn.style.padding = '0.5em 1em';
    btn.style.backgroundColor = '#444';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'background-color 0.3s, transform 0.2s';

    let timeoutId = null;

    const activate = () => {
      btn.textContent = 'ACTiVATED';
      btn.style.backgroundColor = '#ff3366';
      btn.style.transform = 'scale(1.1)';
      clearTimeout(timeoutId);
      timeoutId = setTimeout(deactivate, 20000);
    };

    const deactivate = () => {
      btn.textContent = 'sleepy';
      btn.style.backgroundColor = '#444';
      btn.style.transform = 'scale(1)';
    };

    btn.addEventListener('click', () => {
      if (btn.textContent === 'sleepy') {
        activate();
      } else {
        deactivate();
      }
    });

    document.body.appendChild(btn);
  }
}
