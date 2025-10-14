/**
 * Parsing Plugin (remark)
 * Распознает синтаксис ![alt](url.mp3) и создает узел типа 'euiAudio'.
 */
import { visit } from 'unist-util-visit'; // Импортировать из соответствующих утилит

// Этот утилитарный метод обычно берется из 'micromark-util-decode-string'
const decodeString = (value) => value; 

/**
 * Parsing Plugin (remark) с кастомным лексером
 * Распознает синтаксис ::audio[alt](url)
 */
const euiAudioPluginParser = () => {
  const customTag = (eat, value, silent) => {
    // Регулярное выражение для ::audio[...](...)
    const match = value.match(/^::audio\[([^\]]+)\]\(([^)]+)\)/);

    if (!match) return;

    if (silent) return true;

    const [fullMatch, alt, url] = match;
    const length = fullMatch.length;

    // 1. "Съедаем" совпавший текст
    const now = eat.now();
    
    // 2. Создаем кастомный узел AST
    const node = {
      type: 'audioCustomTag',
      url: decodeString(url),
      alt: decodeString(alt),
      position: {
        start: now,
        end: eat.move(now, fullMatch),
      },
      data: {
        hName: 'euiAudioPlayer',
        hProperties: {
          src: decodeString(url),
          altText: decodeString(alt),
        },
      },
    };
    console.log({url, alt})

    // 3. Добавляем узел в дерево
    return eat(fullMatch)(node);
  };

  // Регистрируем наш кастомный токенизатор в обработчике inline-текста
  const compiler = this.Parser.prototype.inlineTokenizers;
  const methods = this.Parser.prototype.inlineMethods;
  
  // Добавляем токенизатор
  compiler.audioCustomTag = customTag; 
  
  // Помещаем его перед стандартными ссылками (link)
  methods.splice(methods.indexOf('link'), 0, 'audioCustomTag');
};

export default euiAudioPluginParser;
// *Для работы этого плагина требуется 'unist-util-visit', 
// который является стандартным инструментом в экосистеме remark/unified.*