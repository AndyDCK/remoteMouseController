import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [serverMessage, setServerMessage] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
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
      console.error('WebSocket error:', error);
    };

    // Capturer les mouvements de la souris et envoyer au serveur WebSocket
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setCursorPosition({ x: clientX, y: clientY });

      try {
        const message = JSON.stringify({ type: "mousemove", x: clientX, y: clientY });
        ws.send(message); // Envoie les coordonnées au serveur via WebSocket
      } catch (error) {
        console.error("Error sending mouse position:", error);
      }
    };

    // Capturer les mouvements tactiles pour les appareils mobiles
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();  // Empêche le comportement par défaut du navigateur
      const touch = event.touches[0];
      const { clientX, clientY } = touch;
      setCursorPosition({ x: clientX, y: clientY });

      try {
        const message = JSON.stringify({ type: "mousemove", x: clientX, y: clientY });
        ws.send(message); // Envoie les coordonnées au serveur via WebSocket
      } catch (error) {
        console.error("Error sending touch position:", error);
      }
    };

    // Désactiver le défilement de la page sur les gestes tactiles
    const preventDefaultTouch = (event: TouchEvent) => {
      event.preventDefault();
    };

    // Ajouter des écouteurs pour le mouvement de la souris et le toucher
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', preventDefaultTouch, { passive: false });

    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', preventDefaultTouch);
      ws.close();
    };
  }, [serverUrl]);

  return (
    <div>
      <h1>WebSocket Communication</h1>
      <p>Message from server: {serverMessage}</p>
      <h2>Mouse/Touch Position</h2>
      <p>X: {cursorPosition.x}, Y: {cursorPosition.y}</p>
    </div>
  );
};

export default App;
