document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentUrl = new URL(tabs[0].url);
    var domain = currentUrl.hostname;

    // Load domain and wildcard lists from files
    loadLists(function (exactDomains, wildcardDomains) {
      // Check if the domain is in the list
      if (exactDomains.includes(domain)) {
        setStatus('Domain is in the list');
        changeIconColor('green');
      } else {
        // Check if the domain matches any wildcard
        var isWildcardMatch = wildcardDomains.some(wildcard => {
          return matchWildcard(domain, wildcard);
        });


        if (isWildcardMatch) {
          setStatus('Domain matches a wildcard');
          changeIconColor('orange');
          //chrome.browserAction.setIcon({path: {'48':'green.png'}});
        } else {
          setStatus('Domain is not in the list');
          changeIconColor('red');
        }
      }
    });
  });
});

function loadLists(callback) {
  // Load domain list from domains.txt
  fetch(chrome.runtime.getURL('domains.txt'))
    .then(response => response.text())
    .then(data => {
      var exactDomains = data.split('\n').filter(Boolean);

      // Load wildcard list from wildcards.txt
      fetch(chrome.runtime.getURL('wildcards.txt'))
        .then(response => response.text())
        .then(data => {

          var wildcardDomains = data.split('\n').filter(Boolean);
          callback(exactDomains, wildcardDomains);
        });
    });
}

function setStatus(message) {
  document.getElementById('status').innerText = message;
}

function changeIconColor(color) {
  chrome.browserAction.setBadgeBackgroundColor({ color: color });
  chrome.browserAction.setBadgeText({ text: "D" });

}

function matchWildcard(domain, wildcard) {
  var regex = new RegExp('^' + wildcard.replace(/\*/g, '.*') + '$');
  return regex.test(domain);
}

