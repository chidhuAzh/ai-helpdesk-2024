   // app/components/ScreenShareReceiver.js
   "use client"

   import React, { useRef, useState, useEffect } from 'react';
   import Peer from 'simple-peer';
   import io from 'socket.io-client';

   const socket = io('http://localhost:3001'); // Connect to the signaling server

   const ScreenShare = () => {
     const [peer, setPeer] = useState(null);
     const videoRef = useRef();
     const [remoteStream, setRemoteStream] = useState(null);

     useEffect(() => {
       socket.on('signal', (data) => {
         if (peer) {
           if (peer._pc && peer._pc.signalingState !== 'stable') {
             peer.signal(data);
           }
         } else {
           const newPeer = new Peer({ initiator: false, trickle: false });
           newPeer.on('signal', (data) => {
             socket.emit('signal', data);
           });

           newPeer.on('stream', (stream) => {
             setRemoteStream(stream);
           });

           newPeer.signal(data);
           setPeer(newPeer);
         }
       });

       return () => {
         socket.off('signal');
       };
     }, [peer]);

     const startScreenShare = async () => {
       try {
         const screenStream = await navigator.mediaDevices.getDisplayMedia({
           video: true,
         });

         const newPeer = new Peer({ initiator: true, trickle: false, stream: screenStream });

         newPeer.on('signal', (data) => {
           socket.emit('signal', data); // Send signal data to the other peer
         });

         newPeer.on('stream', (remoteStream) => {
           videoRef.current.srcObject = remoteStream; // Display the remote stream
         });

         setPeer(newPeer);
       } catch (error) {
         console.error('Error starting screen share:', error); // Log the error
         alert('Screen sharing was aborted or failed. Please try again.'); // Notify the user
       }
     };

     return (
       <div>
         <button onClick={startScreenShare}>Start Screen Share</button>
         <video ref={videoRef} autoPlay playsInline />
         {remoteStream && <video srcObject={remoteStream} autoPlay playsInline />}
       </div>
     );
   };

   export default ScreenShare;