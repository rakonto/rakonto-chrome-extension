const icons = {
  pass: {
    '128': 'icons/icon-pass-128.png',
    '48': 'icons/icon-pass-48.png',
    '19': 'icons/icon-pass-19.png',
    '16': 'icons/icon-pass-16.png'
  },
  fail: {
    '128': 'icons/icon-fail-128.png',
    '48': 'icons/icon-fail-48.png',
    '19': 'icons/icon-fail-19.png',
    '16': 'icons/icon-fail-16.png'
  },
  unknown: {
    '128': 'icons/icon128.png',
    '48': 'icons/icon48.png',
    '19': 'icons/icon19.png',
    '16': 'icons/icon16.png'
  }
};

function verify(url)
{
    chrome.storage.local.set({url: url});
    // Call verify then update the icon and popup text
    
    const params = {
      url: url
    };

    let formBody = [];
    for (let property in params) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const request = {
        method: 'POST',
        body: formBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch('https://rakonto.net/api/verify_url', request)
    .then((resp) =>
    {
      if(resp.status != 200)
        throw {};
      return resp.json();
    })
    .then((data) =>
    {
      // change icons
      const state = data.hash_match && data.sender_match ? 'pass' : 'fail';
      chrome.browserAction.setIcon({path:icons[state]});
      chrome.storage.local.set({url: url});
      chrome.storage.local.set({state: state});
    })
    .catch((err) =>
    {
      // reset icons
      chrome.browserAction.setIcon({path:icons['unknown']});
      chrome.storage.local.set({url: url});
      chrome.storage.local.set({state: null});
    });
}

chrome.tabs.onUpdated.addListener((tabId, change, tab) =>
{
  if(change.status == 'complete')
  {
    verify(tab.url);
  }
});

chrome.tabs.onActivated.addListener((info) =>
{
  chrome.tabs.get(info.tabId, (change) =>
  {
    verify(change.url);
  });
});

