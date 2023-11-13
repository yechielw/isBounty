chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    var url = new URL(tab.url);
    console.log("Current Path: " + url.hostname);
  });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    var url = new URL(tab.url);
    var domain =  url.hostname;

    // Load domain and wildcard lists from files
    loadLists(function (exactDomains, wildcardDomains) {
      // Check if the domain is in the list
      if (exactDomains.includes(domain)) {
        //setStatus('Domain is in the list');
        changeIconColor('green','B');
        chrome.browserAction.setIcon({ path: 'green.png' });

      } else {
        // Check if the domain matches any wildcard
        var isWildcardMatch = wildcardDomains.some(wildcard => {
          return matchWildcard(domain, wildcard);
        });


        if (isWildcardMatch) {
          //setStatus('Domain matches a wildcard');
          changeIconColor('orange','W');
          chrome.browserAction.setIcon({ path: 'green.png' });
          //chrome.browserAction.setIcon({path: {'48':'green.png'}});
        } else {
          //setStatus('Domain is not in the list');
          changeIconColor('red','N');
          chrome.browserAction.setIcon({ path: 'icon.png' });
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

function changeIconColor(color,text) {
  chrome.browserAction.setBadgeBackgroundColor({ color: color });
  chrome.browserAction.setBadgeText({ text: text });

}

function matchWildcard(domain, wildcard) {
  var regex = new RegExp('^' + wildcard.replace(/\*/g, '.*') + '$');
  return regex.test(domain);
}

