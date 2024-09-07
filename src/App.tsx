import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [serverMessage, setServerMessage] = useState<string>("");
  const serverUrl = "wss://limitless-shelf-21103-fcd085285160.herokuapp.com/ws";

  useEffect(() => {
    const ws = new WebSocket(serverUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setServerMessage(event.data);
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed', event.code);
    };

    ws.onerror = (error) => {
      console.log('WebSocket error', error);
    };

    // Capturer les mouvements de la souris et envoyer au serveur WebSocket
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const message = JSON.stringify({ type: "mousemove", x: clientX, y: clientY });
      ws.send(message); // Envoie les coordonnées au serveur via WebSocket
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      const { clientX, clientY } = touch;
      const message = JSON.stringify({ type: "mousemove", x: clientX, y: clientY });
      ws.send(message); // Envoie les coordonnées au serveur via WebSocket
    };

    // Ajouter des écouteurs pour le mouvement de la souris et le toucher
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Communication</h1>
      <p>Message from server: {serverMessage}</p>
    </div>
  );
};

export default App;
