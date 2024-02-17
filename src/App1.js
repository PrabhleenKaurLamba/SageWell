import React, { useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import MonsterApiClient from 'monsterapi';

const recorder = new MicRecorder({ bitRate: 128 });

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');
  
  // Initialize Monster API client
  const client = new MonsterApiClient('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjFlODhiM2NmZjliNTI2OWUzY2QwNjU2Njk3NGRiZTNmIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6NDM6MDcuMjg3MjIzIn0.-nT-sdCXr2yzh5EAIdMl3aqWUIqU4TU_lSlA56Ybxeg');

  const startRecording = () => {
    recorder
      .start()
      .then(() => {
        setIsRecording(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const stopRecording = async () => {
    try {
      const [buffer, blob] = await recorder.stop().getMp3();
      setRecordedAudio(blob);
      setIsRecording(false);

      // Transcribe the recorded audio
      const transcript = await client.generate({ model: 'whisper', data: { file: blob } });
      const transcribedText = transcript.text;
      setTranscribedText(transcribedText);
      console.log(`Instruction provided by you: ${transcribedText}`);
    } catch (error) {
      console.error('Error occurred while processing audio:', error);
      alert('An error occurred while processing audio.');
    }
  };

  return (
    <div className="App">
      <h1>Recorder</h1>
      {isRecording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {transcribedText && <p>Instruction provided by you: {transcribedText}</p>}
    </div>
  );
};

export default App;
