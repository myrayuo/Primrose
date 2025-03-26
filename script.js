function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function applyColor() {
    const colorParam = getQueryParam("color");
    if (colorParam) {
        const rgb = colorParam.split(",").map(num => parseInt(num.trim()));
        if (rgb.length === 3 && rgb.every(num => !isNaN(num) && num >= 0 && num <= 255)) {
            document.querySelectorAll(".blue-card").forEach(el => {
                el.style.backgroundColor = `rgb(${rgb.join(",")})`;
            });
        }
    }
}

applyColor();

document.addEventListener('DOMContentLoaded', () => {
  const url = window.location.href.toLowerCase();
  const body = document.body;
  if (url.includes('signerdark')) {
    body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    body.classList.add('full-dark');
    body.classList.remove('full-light');
  } else if (url.includes('signerlight')) {
    body.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    body.classList.add('full-light');
    body.classList.remove('full-dark');
  }
});
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
}
document.addEventListener('DOMContentLoaded', () => {
  const settingsButton = document.getElementById('settings-button'),
        settingsPopup = document.getElementById('settings-popup'),
        darkModeToggle = document.getElementById('dark-mode-toggle'),
        body = document.body;
  if (settingsButton && settingsPopup) {
    settingsButton.addEventListener('click', () => settingsPopup.classList.toggle('active'));
  }
  if (darkModeToggle && body) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.setAttribute('data-theme', 'dark');
      darkModeToggle.checked = true;
    } else if (savedTheme === 'light') {
      body.removeAttribute('data-theme');
      darkModeToggle.checked = false;
    }
    darkModeToggle.addEventListener('change', () => {
      if (darkModeToggle.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  document.addEventListener('copy', (event) => {
    const selection = window.getSelection();
    if (selection && selection.anchorNode && selection.anchorNode.parentElement && selection.anchorNode.parentElement.tagName === 'A') {
      event.preventDefault();
    }
  });
  document.querySelectorAll('a').forEach((link) => link.setAttribute('draggable', 'false'));
    const advancedToggle = document.getElementById('advancedToggle');
    const advancedContent = document.getElementById('advancedContent');
    if (advancedToggle && advancedContent) {
        advancedToggle.addEventListener('click', () => {
            advancedContent.classList.toggle('opened');
            advancedToggle.classList.toggle('opened');
        });
    }
    const form = document.getElementById('signForm');
    const popupContainer = document.getElementById('popupContainer');

    const adjustPopupSize = () => {
        popupContainer.style.width = window.innerWidth < 600 ? "80%" : "400px";
        popupContainer.style.maxWidth = "90%";
        popupContainer.style.top = "50%";
        popupContainer.style.left = "50%";
        popupContainer.style.transform = "translate(-50%, -50%)";
        popupContainer.style.position = "fixed";
        popupContainer.style.backgroundColor = body.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#fff';
        popupContainer.style.border = "1px solid #ccc";
        popupContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
        popupContainer.style.zIndex = "1000";
        popupContainer.style.padding = "10px";
        popupContainer.style.textAlign = "center";
        popupContainer.style.color = body.getAttribute('data-theme') === 'dark' ? '#e0e0e0' : '#1d1d1f';
    };
    window.addEventListener("resize", adjustPopupSize);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        popupContainer.innerHTML = `
            <h3>Signing...</h3>
            <p>Please wait...</p>
        `;
        popupContainer.style.display = "block";
        adjustPopupSize();
        try {
            const response = await fetch('https://private.ipasign.pro/sign', {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error: " + response.statusText);
            }
            const data = await response.json();
            if (data.installLink) {
                popupContainer.innerHTML = `
                    <h3>Success!</h3>
                    <p>Click the link below to install</p>
                    <a href="${data.installLink}" target="_blank">${data.installLink}</a>
                    <br><br>
                    <button onclick="document.getElementById('popupContainer').style.display='none'">Close</button>
                `;
                adjustPopupSize();
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                throw new Error("Unexpected response from the server.");
            }
        } catch (error) {
            popupContainer.innerHTML = `
                <h3>Error</h3>
                <p>${error.message}</p>
                <button onclick="document.getElementById('popupContainer').style.display='none'">Close</button>
            `;
            adjustPopupSize();
        }
    });
});
