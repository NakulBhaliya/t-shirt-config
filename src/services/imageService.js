import { UNSPLASH_ACCESS_KEY } from '../config/api';

export const generateBackgroundImage = async (prompt) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=4`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate background');
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map(result => ({
        url: result.urls.raw + '&w=1080&h=1080&fit=crop',
        thumb: result.urls.thumb,
        id: result.id
      }));
    }
    throw new Error('No images found for your prompt');
  } catch (error) {
    throw error;
  }
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

export const combineImages = async (tshirtImage, backgroundImage) => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to 1080x1080
    canvas.width = 1080;
    canvas.height = 1080;
    
    const [tshirtImg, backgroundImg] = await Promise.all([
      loadImage(tshirtImage),
      loadImage(backgroundImage)
    ]);
    
    // Draw background
    ctx.drawImage(backgroundImg, 0, 0, 1080, 1080);
    
    // Calculate t-shirt dimensions to maintain aspect ratio
    const tshirtAspect = tshirtImg.width / tshirtImg.height;
    
    // Make t-shirt take up about 95% of the canvas width to match scene view
    const tshirtWidth = 1080 * 0.95;
    const tshirtHeight = tshirtWidth / tshirtAspect;
    
    // Center the t-shirt vertically and horizontally
    const tshirtX = (1080 - tshirtWidth) / 2;
    const tshirtY = (1080 - tshirtHeight) / 2;
    
    // Draw t-shirt
    ctx.drawImage(tshirtImg, tshirtX, tshirtY, tshirtWidth, tshirtHeight);
    
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error combining images:', error);
    throw error;
  }
}; 