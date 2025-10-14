import React, { useState } from 'react';
import { EuiMarkdownEditor } from '@elastic/eui';
import { visit } from 'unist-util-visit'; // Импортировать из соответствующих утилит
import euiAudioPluginParser from './parser.tsx';
import euiAudioPluginProcessor from './processor.tsx'; 

// ... (Определения EuiAudioPlayer, euiAudioPluginParser, euiAudioPluginProcessor)
const dropHandlers = [
  {
    supportedFiles: ['.jpg', '.jpeg', '.png'],
    accepts: (itemType) => true,
    getFormattingForItem: (item) => {
      // fake an upload
      return new Promise((resolve) => {
        setTimeout(() => {
          const url = URL.createObjectURL(item);
          resolve({
            text: `![${item.name}](${url})`,
            config: { block: true },
          });
        }, 1000);
      });
    },
  },
];
export const CustomMarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(
    '# Кастомный Аудио Тег\n\nИспользуйте синтаксис ::audio[Заголовок](URL):\n\n::audio[Песня месяца](/files/audio/great_track.mp3)'
  );
  
  const customParsingPlugins = [
    euiAudioPluginParser, 
    // ... остальные стандартные плагины
  ];
  
  const customProcessingPlugins = [
    euiAudioPluginProcessor, 
    // ... остальные стандартные плагины
  ];

  const handleMarkdownChange = (value) => {
    setMarkdown(value);
  };

  return (
    <EuiMarkdownEditor
      value={markdown}
      onChange={handleMarkdownChange}
      parsingPluginList={customParsingPlugins}
      processingPluginList={customProcessingPlugins}
      dropHandlers={dropHandlers}
      height="400px"
    />
  );
};

export default CustomMarkdownEditor;