import React, { useState, useEffect } from 'react';
import MonsterApiClient from 'monsterapi';
import MicRecorder from 'mic-recorder-to-mp3';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions directly
import { app } from './firebase'; // Import the initialized Firebase app

const recorder = new MicRecorder({ bitRate: 128 });

const MyComponent = () => {
  const [transcribedText, setTranscribedText] = useState('');
  const client = new MonsterApiClient('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjFlODhiM2NmZjliNTI2OWUzY2QwNjU2Njk3NGRiZTNmIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6NDM6MDcuMjg3MjIzIn0.-nT-sdCXr2yzh5EAIdMl3aqWUIqU4TU_lSlA56Ybxeg'); // Replace 'your-api-key' with your actual Monster API key

  const startRecording = () => {
    recorder
      .start()
      .then(() => {
        console.log('Recording started');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const stopRecording = async () => {
    try {
      const [buffer, blob] = await recorder.stop().getMp3();
      console.log('Recording stopped');

      // Upload blob to Firebase Storage
      const storage = getStorage(app);
      const audioRef = ref(storage, 'recorded_audio.mp3');
      await uploadBytes(audioRef, blob);
      
      // Get the download URL of the uploaded file
      const audioURL = await getDownloadURL(audioRef);
      
      // Define model and input data for transcription
      const model = 'whisper'; // Replace with the desired model name
      const input = {
        file: audioURL, // Use the URL of the recorded audio file
        diarize: false,
        language: 'en',
        num_speakers: null,
        prompt: '',
        remove_silence: true,
        transcription_format: 'text',
      };

      // Transcribe the recorded audio
      const response = await client.generate(model, input);
      setTranscribedText(response.text);
      console.log(response)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>SageWell</h1>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {transcribedText && <div>Transcribed Text: {transcribedText}</div>}
    </div>
  );
};

export default MyComponent;
