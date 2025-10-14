// Компонент, который будет вставлен в Markdown.
// Он содержит логику записи и автоматически добавляет Markdown.
const AudioRecordInjector = ({ onInsertMarkdown }) => {
  const handleRecordingComplete = (audioBlob) => {
    const url = URL.createObjectURL(audioBlob);
    const title = `Запись_${new Date().toLocaleTimeString()}.webm`;
    
    // Генерируем Markdown, используя Blob URL
    const markdownSnippet = `\n\n\`\`\`audio\n{\n  "src": "${url}",\n  "title": "${title}"\n}\n\`\`\`\n`;
    
    // Вставляем сгенерированный Markdown обратно в редактор
    onInsertMarkdown(markdownSnippet);
  };

  // 💡 Здесь используем компонент записи
  return (
    <AudioRecorderButton onRecordingComplete={handleRecordingComplete} />
  );
};