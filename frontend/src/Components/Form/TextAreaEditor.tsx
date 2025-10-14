import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import {
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiFormControlLayout,
  EuiFieldText,
  EuiFormLabel,
  EuiMarkdownEditor,
  EuiSpacer,
  EuiCodeBlock,
  EuiButton,
  EuiSwitch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
  EuiIcon,
  getDefaultEuiMarkdownParsingPlugins,
  getDefaultEuiMarkdownProcessingPlugins,
  getDefaultEuiMarkdownUiPlugins,
  EuiMarkdownEditorUiPlugin,
} from '@elastic/eui';
import { EuiMarkdownDropHandler } from '@elastic/eui/src/components/markdown_editor/markdown_types';

import AudioRecorderButton from './AudioRecorder.tsx';


const AVALABLE_MIME = [
  'image/jpg',
  'image/png'
]




const dropHandlers: EuiMarkdownDropHandler[] = [
  {
    supportedFiles: ['.jpg', '.jpeg', '.png', '.mp3'],
    accepts: (itemType: string) => true,
    getFormattingForItem: (item: File) => {
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


type TFileParam = { url: string, alt: string };
type TSetFileRecord<T = any> = (params: TFileParam) => undefined;


const AudioRecordInjector = (setRecord: TSetFileRecord) => {
  const handleRecordingComplete = (audioBlob: Blob) => {
    const url = URL.createObjectURL(audioBlob);
    const title = `Запись_${new Date().toLocaleTimeString()}.webm`;

    // Генерируем Markdown, используя Blob URL
    const markdownSnippet = `\n\n\`\`\`audio\n{\n  "src": "${url}",\n  "title": "${title}"\n}\n\`\`\`\n`;

    // Вставляем сгенерированный Markdown обратно в редактор
    setRecord({ url, alt: title });
  };

  // 💡 Здесь используем компонент записи
  return (
    <AudioRecorderButton onRecordingComplete={handleRecordingComplete} />
  );
};

const AudioRecordEditor = ({ node, onSave, onCancel }) => {
  {
    const [record, setRecord] = useState({ alt: "", url: "" });

    const onEndRecord = ({ url, alt }: TFileParam) => {
      setRecord({
        url,
        alt: record.alt ? record.alt : alt
      });
    }
    return (
      <>
        <EuiPanel>
          <EuiFlexGroup direction='column'>
            <EuiFlexItem>
              <EuiText size="s" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>Создать запись с микрофона</EuiText>
            </EuiFlexItem>
            <EuiFieldText type="text" controlOnly value={record.alt}
              placeholder='Наименование записи'
              onChange={(e) => setRecord({ ...record, alt: e.target.value })} />
            <EuiFlexItem>
              <audio controls style={{ width: '100%', outline: 'none' }} src={record.url}></audio>
            </EuiFlexItem>
            <EuiFlexItem direction='column'>
              <EuiFlexGroup justifyContent='start'>
                {AudioRecordInjector(onEndRecord)}
                <EuiButton
                  isDisabled={!Boolean(record.url)}
                  color='success'
                  iconType={'plus'}
                  onClick={() => onSave(`![${record.alt}.mp3](${record.url})`, { block: true })}>
                  Вставить в текст
                </EuiButton>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </>

    )
  }
}
export default ({ stateSaver }) => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);

  const [attachedLinks, setAttchedLinks] = useState<Set<string>>(new Set());

  const [ast, setAst] = useState(null);
  const [isAstShowing, setIsAstShowing] = useState(true);
  const onParse = useCallback((err, { messages, ast }) => {
    setMessages(err ? [err] : messages);
    setAst(JSON.stringify(ast, null, 2));
  }, []);

  const [isReadOnly, setIsReadOnly] = useState(false);

  const onChange = (e) => {
    setValue(e);
    stateSaver(e);
  };
  const chartDemoPlugin: EuiMarkdownEditorUiPlugin = {
    name: 'chartDemoPlugin',
    button: {
      label: 'Добавить запись с микрофона',
      iconType: 'dot',
    },
    helpText: <span>Запись аудио(микрофон)</span>,
    editor: ({ node, onSave, onCancel }) => <AudioRecordEditor node={node} onCancel={onCancel} onSave={onSave} />
  }


  function AudioMarkdownParser() {
    const Parser = this.Parser;
    const tokenizers = Parser.prototype.inlineTokenizers;
    const methods = Parser.prototype.inlineMethods;
    function tokenizeAudio(eat, value, silent) {
      const match = value.match(/!\[([^\]]+)\.mp3]\(([^)]+)\)/);
      setAttchedLinks(prevState => prevState.add(value));
      console.log({ attachedLinks })
      if (!match) return false;
      if (silent) return true;
      const [fullMatch, alt, url] = match;

      return eat(fullMatch)({
        type: 'audioPlugin',
        audio: { alt, url },
      });
    }
    tokenizeAudio.locator = (value, fromIndex) => {
      return value.indexOf(':', fromIndex);
    };
    tokenizers.audio = tokenizeAudio;
    methods.splice(methods.indexOf('link'), 0, 'audio')
  }


  const AudioRender = React.memo(({ audio }) => {
    if (!audio || !audio.url) return null;
    return (
      <EuiPanel paddingSize="s" grow={false} style={{ maxWidth: 400 }}>
        <EuiText size="s" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <EuiIcon type="musicalNote" size="m" style={{ marginRight: 8 }} />
          <strong>{audio.alt}</strong>
        </EuiText>
        <audio controls src={audio.url} style={{ width: '100%', outline: 'none' }}>
          Ваш браузер не поддерживает аудио.
        </audio>
      </EuiPanel>
    );
  });

  const finalParsingList = useMemo(() => {
    const parsingList = getDefaultEuiMarkdownParsingPlugins();
    parsingList.push(AudioMarkdownParser);
    return parsingList
  }, [])

  const finalProcessingList = useMemo(() => {
    const processingList = getDefaultEuiMarkdownProcessingPlugins();
    processingList[1][1].components.audioPlugin = AudioRender;
    return processingList;
  }, []);

  const finalUiPlugins = useMemo(() => {
    const uiPlugins = getDefaultEuiMarkdownUiPlugins();
    console.log({ uiPlugins })
    uiPlugins.push(chartDemoPlugin);
    return uiPlugins;
  }, [])
  return (
    <>
      <EuiMarkdownEditor
        aria-label="Редактор контента"
        placeholder="Тут вы можете описать свою задачу по полной"
        value={value}
        onChange={onChange}
        height={450}
        parsingPluginList={finalParsingList}
        processingPluginList={finalProcessingList}
        uiPlugins={finalUiPlugins}
        onParse={onParse}
        errors={messages}
        dropHandlers={dropHandlers}
        readOnly={isReadOnly}
        initialViewMode={'viewing'}
      />
      <EuiSpacer size="s" />

      {/* {isAstShowing && <EuiCodeBlock language="json">{ast}</EuiCodeBlock>} */}
    </>
  );
};