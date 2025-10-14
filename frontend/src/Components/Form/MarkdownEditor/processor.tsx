import { visit } from 'unist-util-visit'; // Импортировать из соответствующих утилит
import EuiAudioPlayer from './Audio.tsx';

const euiAudioPluginProcessor = () => {
  return (tree) => {
    // Ищем наш кастомный HTML-тег
    visit(tree, 'element', (node) => {
      if (node.tagName === 'euiAudioPlayer') {
        // Устанавливаем React-компонент
        node.tagName = EuiAudioPlayer; 
        
        // Передаем свойства, если они еще не установлены
        if (!node.properties.src) {
           node.properties = {
               ...node.properties,
               src: node.data.hProperties.src,
               altText: node.data.hProperties.altText,
           };
        }
      }
    });
  };
};

export default euiAudioPluginProcessor;