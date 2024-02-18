import React from 'react';
import logo from './../img/logo.png';
import './../css/Home.css';

const HomePage = () => {
    const goToHome = () => {
        window.location.href = "/";
    };

    const goToAssistant = () => {
        window.location.href = "/assistant";
    };

    return (
        <div className="home-page">
            <div className="logo-container">
                <img src={logo} alt="SageWell Logo" className="logo" onClick={goToHome} />
            </div>
            <div className="title-container">
                <h1 className="title">Welcome to SageWell, an AI-powered Medical Assistant for the Elderly</h1>
            </div>
            <div className="subtitle">
                <h2>We believe in accessibility of AI for all age groups!</h2>
            </div>
            <button className="try-button" onClick={goToAssistant}>Try it now!</button>
            <div className="subtitle">
                <h2>You may ask</h2>
            </div>
            <div className="suggested-questions">
                <div className="question-box" onClick={goToAssistant}>
                    <div className='text-box'>
                    <p>What are the symptoms of Diabetes? <a className="ask-now" href="/assistant">Ask now</a></p>
                    </div>
                </div>
                <div className="question-box" onClick={goToAssistant}>
                    <div className='text-box'>
                    <p>What causes diabetes? <a className="ask-now" href="/assistant">Ask now</a></p>
                    </div>
                </div>
                <div className="question-box" onClick={goToAssistant}>
                    <div className='text-box'>
                    <p>How do I treat diabetes? <a className="ask-now" href="/assistant">Ask now</a></p>
                    </div>
                </div>
                <div className="question-box" onClick={goToAssistant}>
                <div className='text-box'>
                    <p>What doctor should I see for diabetes? <a className="ask-now" href="/assistant">Ask now</a></p>
                </div>
                </div>
            </div>
            <footer className="footer">
                TreeHacks @ 2024
            </footer>
        </div>
    );
};

export default HomePage;
