(()=>{chrome.webNavigation.onCompleted.addListener(async e=>{e.url&&new URL(e.url).hostname==="web.whatsapp.com"&&await chrome.tabs.executeScript({frameId:e.frameId,runAt:"document_end",code:"("+n+")();"})});function n(){let e="whatsapp-parasite-"+new Date().getTime(),t=document.createElement("script");t.id=e,t.src=chrome.extension.getURL("whatsapp-inject-api.js"),document.body.appendChild(t)}})();