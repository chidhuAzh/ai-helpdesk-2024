// app/components/ScreenShareReceiver.js
"use client"

import React, { useRef, useState, useEffect } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to the signaling server

const ScreenShareReceiver = () => {
  const videoRef = useRef();
  const [peer, setPeer] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // State to track connection status

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true); // Set connected state to true
      console.log('Connected to server');
    };

    const handleDisconnect = () => {
      setIsConnected(false); // Set connected state to false
      console.log('Disconnected from server');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socket.on('signal', (data) => {
      console.log('Received signal:', data); // Log received signal
      if (peer) {
        if (peer._pc.signalingState === 'stable') { // Check if signaling state is stable
          peer.signal(data);
        } else {
          console.warn('Peer connection not in stable state, cannot signal data');
        }
      } else {
        const newPeer = new Peer({ initiator: false, trickle: false });
        newPeer.on('signal', (data) => {
          console.log('Sending signal:', data); // Log sent signal
          socket.emit('signal', data); // Send signal data to the other peer
        });

        newPeer.on('stream', (stream) => {
          console.log('Stream received'); // Log when stream is received
          videoRef.current.srcObject = stream; // Display the remote stream
        });

        newPeer.signal(data);
        setPeer(newPeer);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off('connect', handleConnect); // Remove the event listener
      socket.off('disconnect', handleDisconnect); // Remove the event listener
      socket.off('signal'); // Remove the event listener
      if (peer) {
        peer.destroy(); // Clean up the peer connection
      }
    };
  }, [peer]);

  return (
    <div>
      <h2>Screen Receiver</h2>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p> {/* Display connection status */}
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default ScreenShareReceiver;