import React, { useState, useRef, useEffect } from 'react';
import { EuiButton } from '@elastic/eui';

const AudioRecorderButton = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const audioChunksRef = useRef([]);

  const intervalRef = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000)

    } else {
      clearInterval(intervalRef.current);
      setRecordingTime(0);
    }

    return () => clearInterval(intervalRef.current)
  }, [isRecording])

  const startRecording = async () => {
    // 1. Получаем доступ к микрофону
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];
    setRecordingTime(0);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      // 3. Создаем Blob и вызываем колбэк
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      onRecordingComplete(audioBlob);
      // Остановка потока
      stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const buttonText = isRecording 
    ? formatTime(recordingTime) 
    : 'Запись';
  return (
    <EuiButton 
      onClick={isRecording ? stopRecording : startRecording}
      iconType={isRecording ? 'stop' : 'dot'}
      color={isRecording ? 'danger' : 'primary'}
      isDisabled={!navigator.mediaDevices.getUserMedia}
      style={{textAlign: 'center'}}
    >
      {buttonText}
      {isRecording && (
        <span style={{ 
          marginLeft: '8px', 
          display: 'inline-block', 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: 'white', // Или 'currentColor' для EUI
          animation: 'blink 1s infinite',
        }} />)}
    </EuiButton>
  );
};

export default AudioRecorderButton;