chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "imagine-context-menu",
    title: "Imagine",
    contexts: ["page", "selection", "image"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.windowId) {
    console.error('No window ID found');
    return;
  }
  console.log("tab.windowId", tab.windowId);
  if (tab.windowId !== -1) {
    await chrome.sidePanel.open({
      windowId: tab.windowId,
    });
  }
});
