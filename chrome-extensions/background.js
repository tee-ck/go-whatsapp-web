(() => {
  // src/chrome/background.ts
  chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (!!details.url) {
      const url = new URL(details.url);
      if (url.hostname === "web.whatsapp.com") {
        await chrome.tabs.executeScript({
          frameId: details.frameId,
          runAt: "document_end",
          code: "(" + inject_script + ")();"
        });
      }
    }
  });
  function inject_script() {
    const tag = "whatsapp-parasite-" + new Date().getTime();
    const script = document.createElement("script");
    script.id = tag;
    script.src = chrome.extension.getURL("whatsapp-inject-api.js");
    document.body.appendChild(script);
  }
})();
