// ==UserScript==
// @name       Metal-Archives Copy artist - album to clipboard
// @namespace  https://github.com/Row/metal-archives-userscripts
// @version    0.2
// @grant GM_setClipboard
// @grant GM_addStyle
// @description Adds a button next to each album title, when clicked 'artist name - album name' is copied to the clipboard.
// @match      https://www.metal-archives.com/bands/*
// @copyright  2019+, Rowolta
// ==/UserScript==


const css = `
    .copy-artist-notification {
        background-color: #FF0000;
        animation:copy-notification 0.5s 1;
        animation-delay:0.5s;
        animation-fill-mode: forwards;
        color: #FFF;
        background: #6D4C4C;
        padding: 3px;
        position: absolute;
        top: -20px;
        left: -20px;
        white-space: nowrap;
        display: none;
    }
    @keyframes copy-notification {
        0%   {opacity: 1;}
        70%  {opacity: 1;}
        80% {opacity: 1; transform: translateY(0);}
        100% {opacity: 0;transform: translateY(-30px);}
    }
`;

const tmpl = `<div class="copy-artist-notification"></div>
            <a class="iconContainer ui-state-default ui-corner-all" href="#" title="Copy to clipboard">
                <span class="ui-icon ui-icon-copy">Copy</span>
            </a>`;

function renderButtons() {
    const artist = document.querySelector('h1.band_name a').textContent;
    const bandDisco = document.querySelectorAll("#band_disco a.other, #band_disco a.album,  #band_disco a.single,  #band_disco a.demo");
    bandDisco.forEach(link => {
        const cpStr = `${artist} - ${link.textContent}`;
        const elements = generateTemplate(tmpl, cpStr);
        const insertPoint = link.parentNode;
        insertPoint.style.position = 'relative';
        elements.forEach(elem => {
            link.parentNode.prepend(elem);
        });
    });
}

function generateTemplate(html, cpStr) {
    const template = document.createElement('template');
    template.innerHTML = html;
    const [popUp, button] = template.content.children;
    button.addEventListener('click', (event) => {
        event.preventDefault();
        GM_setClipboard(cpStr + "\n");
        popUp.innerText = `Copied ${cpStr} to clipboard`;
        setTimeout(() => {
            popUp.style.display = 'none';
        }, 2000);
        popUp.style.display = 'block';
    });
    return template.content.childNodes;
}

function waitUntilAjaxIsLoaded() {
    let band = document.querySelector('#band_disco table a');
    if (band) {
        GM_addStyle(css);
        renderButtons();
    } else {
        window.setTimeout(waitUntilAjaxIsLoaded, 500);
    }
}

waitUntilAjaxIsLoaded();
