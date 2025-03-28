import React, { useState } from 'react';
import { generateBackgroundImage } from '../services/imageService';

const BackgroundGeneratorPopup = ({ 
  isOpen, 
  onClose, 
  tshirtImage, 
  onGenerateBackground 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundOptions, setBackgroundOptions] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const options = await generateBackgroundImage(prompt);
      setBackgroundOptions(options);
      setSelectedBackground(null);
      setIsSidebarExpanded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBackground = (background) => {
    setSelectedBackground(background);
  };

  const handleDownload = () => {
    if (selectedBackground) {
      onGenerateBackground(selectedBackground.url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg p-4 transition-all duration-300 ${isSidebarExpanded ? 'max-w-4xl' : 'max-w-2xl'} w-full mx-4 relative max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Generate Background</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="relative">
          {/* Main content area */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left side - T-shirt preview and prompt */}
            <div className="flex-1">
              <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                {/* Background layer */}
                {selectedBackground && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${selectedBackground.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                
                {/* T-shirt layer */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={tshirtImage}
                    alt="T-shirt preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the background you want..."
                  className="flex-1 p-2 border rounded-lg text-sm"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-purple-300 text-sm whitespace-nowrap"
                >
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>

              {error && (
                <p className="text-red-500 mt-2 text-sm">{error}</p>
              )}
            </div>

            {/* Right side - Background options */}
            <div className={`transition-all duration-300 ${isSidebarExpanded ? 'w-full md:w-48 opacity-100' : 'w-0 opacity-0'}`}>
              <div className="overflow-hidden">
                <h3 className="font-semibold mb-2 text-sm">Background Options</h3>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                  {backgroundOptions.map((bg) => (
                    <div
                      key={bg.id}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                        selectedBackground?.id === bg.id ? 'border-purple-500' : 'border-transparent'
                      }`}
                      onClick={() => handleSelectBackground(bg)}
                    >
                      <img
                        src={bg.thumb}
                        alt="Background option"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Download button at bottom center */}
          {selectedBackground && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-semibold"
              >
                Download Design
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundGeneratorPopup; 