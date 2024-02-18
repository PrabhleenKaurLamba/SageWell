import React, { useState } from 'react';
import logo from './../img/logo.png';
import './../css/Assistant.css';
import MonsterApiClient from 'monsterapi';
import MicRecorder from 'mic-recorder-to-mp3';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions directly
import { app } from '../firebase'; // Import the initialized Firebase app
import {FaPlay, FaPause} from 'react-icons/fa';

const recorder = new MicRecorder({ bitRate: 128 });

const Assistant = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [transcribedText, setTranscribedText] = useState('');
    const [apiResponse, setApiResponse] = useState('');
    const [audioURL, setAudioURL] = useState(''); // State to store the URL of the spoken audio
    const client = new MonsterApiClient('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjFlODhiM2NmZjliNTI2OWUzY2QwNjU2Njk3NGRiZTNmIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTdUMDg6NDM6MDcuMjg3MjIzIn0.-nT-sdCXr2yzh5EAIdMl3aqWUIqU4TU_lSlA56Ybxeg'); // Replace 'your-api-key' with your actual Monster API key
    const speak = () => {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === 'Microsoft David Desktop - English (United States)');
        const speech = new SpeechSynthesisUtterance(apiResponse);
        speech.voice = selectedVoice;
        if (isPlaying) {
            window.speechSynthesis.cancel();
          } else {

            window.speechSynthesis.speak(speech);
          }
          setIsPlaying(prevState => !prevState);
    }

    const goToHome = () => {
        window.location.href = "/home";
    };

    const [isRecording, setIsRecording] = useState(false);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    const startRecording = () => {
        // Logic to start recording
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
        // Logic to stop recording
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
    
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const sendRecording = async () => {
        try {
        // Logic to send the recorded audio through the API
        console.log('Sending recorded audio through API');
        console.log(audioURL)
        // Define model and input data for transcription
        const model = 'whisper';
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

        // Send the transcribed text to the Monster API
        const requestBody = {
        input_variables: {
            prompt: response.text // Using the transcribed text as the prompt
        },
        stream: false,
        n: 1,
        temperature: 0,
        max_tokens: 256
        };
        const authKey = '03460f5f-abd1-4b15-80a6-295159a1aff9';

        const monsterApiResponse = await fetch('/generate', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authKey}` // Include the auth key in the Authorization header
            },
            body: JSON.stringify(requestBody)
        });
        
        const monsterApiData = await monsterApiResponse.json();

        // Remove "[" at the beginning of the string
        let desiredText = monsterApiData.trim();
        if (desiredText.startsWith('["')) {
            desiredText = desiredText.substring(2);
        }
        
        // Remove all occurrences of "\n" characters
        desiredText = desiredText.replace(/\n/g, '');
        
        // Remove extra question marks at the beginning, if any
        const removeQuestionMark = desiredText.indexOf('?');
        if (removeQuestionMark !== -1) {
            desiredText = desiredText.substring(removeQuestionMark + 1, desiredText.length);
        }
        
        // Get the index of the last period to trim the string
        const lastPeriodIndex = desiredText.lastIndexOf('.');
        let finalText;
        if (lastPeriodIndex !== -1) {
            finalText = desiredText.substring(0, lastPeriodIndex + 1);
        } else {
            finalText = desiredText;
        }
        
        setApiResponse(finalText);
        console.log(finalText);
    } catch (error) {
        console.error('Error:', error);
        }
    };

    return (
        <div className="home-page">
            <div className="logo-container">
                <img src={logo} alt="SageWell Logo" className="logo" onClick={goToHome} />
            </div>
            <div className="title-container2">
                <h1 className="title2">SageWell AI assistant</h1>
            </div>
            {transcribedText && 
            <div className="audio-input">
                <p><strong>Your Question:</strong><br /><br />{transcribedText}</p>
            </div>
            }
            <br/>
            {apiResponse && 
            <div className="text-output">
                <p><strong>Text Answer:</strong><br /><br />{apiResponse}</p>
            </div>
            }
            {apiResponse && 
            <div className="text-output">
                <p><strong>Audio Answer:</strong><br /><br /></p>
                <br/>
                    <button className='text-to-speech-button' onClick={speak}>
                                {isPlaying ? <FaPause/> : <FaPlay/>}
                    </button>
            </div>
            }

            <div className="input-container">
                <p >Record your question...</p>
                <button className={`record-button ${isRecording ? 'recording' : ''}`} onClick={toggleRecording}>
                    <i className="fas fa-microphone"></i>
                </button>
                <button className="send-button" onClick={sendRecording}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
            <footer className="footer">
                TreeHacks @ 2024
            </footer>
        </div>
    );
};

export default Assistant;
