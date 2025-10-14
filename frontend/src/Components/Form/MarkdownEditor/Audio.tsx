import React from 'react';
import { EuiPanel, EuiText, EuiIcon } from '@elastic/eui';

/**
 * React-компонент для отображения аудио-плеера в Markdown.
 */

const EuiAudioPlayer = ({ src, altText }) => {
  if (!src) return null;

  const fileName = altText || src.substring(src.lastIndexOf('/') + 1);

  return (
    <EuiPanel paddingSize="s" grow={false} style={{ maxWidth: 400 }}>
      <EuiText size="s" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <EuiIcon type="musicalNote" size="m" style={{ marginRight: 8 }} />
        <strong>{fileName}</strong>
      </EuiText>
      <audio controls src={src} style={{ width: '100%', outline: 'none' }}>
        Ваш браузер не поддерживает аудио.
      </audio>
    </EuiPanel>
  );
};

export default EuiAudioPlayer;