export type ImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!tab.id) {
    console.error("No active tab found");
    return null;
  }
  return tab;
};

const extractImages = async (): Promise<ImageProps[][]> => {
  try {
    const tab = await getActiveTab();
    if (!tab) {
      return [];
    }
    const images = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        const imgs = document.body.querySelectorAll("img");
        return Array.from(imgs).map((img) => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
        }));
      },
    });
    return images.map((image) => {
      return image.result as ImageProps[];
    });
  } catch (error) {
    console.error("Error extracting images", error);
    return [];
  }
};

export { extractImages, getActiveTab };
