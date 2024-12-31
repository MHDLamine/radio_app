import React, { useState, useEffect } from "react";

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [language, setLanguage] = useState("fr-FR");

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Votre navigateur ne supporte pas l'API de reconnaissance vocale.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.interimResults = true;

    if (isListening) {
      recognition.start();
    }

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscription(currentTranscript);
    };

    recognition.onend = () => {
      if (isListening) recognition.start(); // Redémarre si l'utilisateur est toujours en mode écoute
    };

    return () => {
      recognition.stop();
      
    };
  }, [isListening, language]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value); // Change la langue
    setTranscription(""); // Réinitialise la transcription
    setIsListening(false); // Arrête l'écoute si elle est en cours
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#F9F9F9",
      minHeight: "100vh",
    },
    selectLanguage: {
      marginBottom: "20px",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #DDD",
    },
    controls: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    button: {
      padding: "10px 15px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s",
      backgroundColor: isListening ? "#FF6C4A" : "#283D92",
      color: "#FFF",
    },
    transcriptionBox: {
      padding: "20px",
      border: "1px solid #DDD",
      borderRadius: "10px",
      backgroundColor: "#FFF",
      maxWidth: "90%",
      margin: "10px auto",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    transcriptionTitle: {
      marginBottom: "10px",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#333",
    },
    transcriptionText: {
      fontSize: "16px",
      color: "#555",
    },
    "@media (max-width: 768px)": {
      controls: {
        flexDirection: "column",
      },
      button: {
        width: "100%",
        marginBottom: "10px",
      },
    },
  };

  return (
    <div style={styles.container}>
      <select
        style={styles.selectLanguage}
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="fr-FR">Français</option>
        <option value="en-US">English</option>
        <option value="es-ES">Español</option>
      </select>

      <div style={styles.controls}>
        <button
          style={styles.button}
          onClick={() => setIsListening((prev) => !prev)}
        >
          {isListening ? "Arrêter" : "Parler"}
        </button>
      </div>

      <div style={styles.transcriptionBox}>
        <h3 style={styles.transcriptionTitle}>📝 Texte capturé :</h3>
        <p style={styles.transcriptionText}>
          {transcription || "Rien n'est encore dit..."}
        </p>
      </div>
    </div>
  );
};

export default App;
