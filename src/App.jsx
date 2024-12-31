import React, { useEffect, useState } from "react";

function App() {
  const [transcription, setTranscription] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Vérification de la compatibilité avec l'API SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("L'API SpeechRecognition n'est pas prise en charge par ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Continue à écouter
    recognition.interimResults = true; // Résultats partiels
    recognition.lang = "fr-FR"; // Langue française

    // Gérer les événements de transcription
    recognition.onresult = (event) => {
      const transcriptArray = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscription(transcriptArray);
    };

    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale :", event.error);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    // Nettoyer l'écouteur quand le composant se démonte
    return () => recognition.stop();
  }, [isListening]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Radio App</h1>
      <p>
        Cliquez sur le bouton ci-dessous pour commencer à parler. Ce que vous dites
        s'affichera en temps réel !
      </p>
      <button
        onClick={() => setIsListening((prev) => !prev)}
        style={{
          backgroundColor: isListening ? "#ff6c4a" : "#283d92",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isListening ? "Arrêter" : "Parler"}
      </button>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          width: "80%",
          margin: "20px auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Texte capturé :</h3>
        <p>{transcription || "Rien n'est encore dit..."}</p>
      </div>
    </div>
  );
}

export default App;
