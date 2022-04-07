(() => {
  // src/chrome/background.ts
  chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (!!details.url) {
      const url = new URL(details.url);
      if (url.hostname === "web.whatsapp.com") {
        setTimeout(async () => {
          await chrome.scripting.executeScript({
            target: {
              tabId: details.tabId
            },
            func: (args) => {
              const { scriptURL } = args;
              const tag = "whatsapp-parasite-" + new Date().getTime();
              const script = document.createElement("script");
              script.id = tag;
              script.src = scriptURL;
              console.log(script);
              document.body.appendChild(script);
            },
            world: void 0,
            args: [{
              scriptURL: chrome.runtime.getURL("whatsapp-inject-api.js")
            }]
          });
        }, 1500);
      }
    }
  });
})();
