// content.js
var script = document.createElement('script');
script.src = chrome.runtime.getURL('popup.js');
document.head.appendChild(script);

