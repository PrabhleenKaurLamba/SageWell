import React, { useState, useEffect } from 'react';
import MonsterApiClient from 'monsterapi';
import MicRecorder from 'mic-recorder-to-mp3';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions directly
import { app } from './firebase'; // Import the initialized Firebase app

const recorder = new MicRecorder({ bitRate: 128 });

const MyComponent = () => {
  const [transcribedText, setTranscribedText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [audioURL, setAudioURL] = useState(''); // State to store the URL of the spoken audio
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
      setAudioURL(audioURL); // Store the audio URL in state
      
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
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generateResponse = async () => {
    try {
      // Define model and input data for producing speech
      const model = 'falcon-7b-instruct'; // Replace with the desired model name
      const input = {
      prompt: transcribedText,
      top_k: 15,
      top_p: 0.5,
      temp: 0.99,
      max_length: 256,
      beam_size: 1,
      system_prompt: "The following is a conversation between a highly knowledgeable and intelligent AI assistant, called Falcon, and a human user, called User...",
    };

      // generate a response to the transcribed data
      const response = await client.generate(model, input);
      setGeneratedText(response.text);
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const speakResponse = async () => {
    try {
      // Define model and input data for producing speech
      const model = 'sunoai-bark'; // Replace with the desired model name
      const input = {
        prompt: transcribedText,
        sample_rate: 25000,
        speaker: "en_speaker_6",
        text_temp: 0.5,
        wave_temp: 0.5,
      };

      // Speak the transcribed data
      const response = await client.generate(model, input);
      console.log('Generated content:', response);
      // Play the audio response
      if (response.output && response.output.length > 0) {
        const audioUrl = response.output[0];
        const audioElement = new Audio(audioUrl);
        audioElement.play();
      }
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
      {audioURL && <button onClick={speakResponse}>Speak Response</button>}
    </div>
  );
};

export default MyComponent;
