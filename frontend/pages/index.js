import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { w3cwebsocket } from 'websocket';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const client = new w3cwebsocket('ws://localhost:8000');

const PointControl = () => {
  const [xVal, setXVal] = useState();
  const [yVal, setYVal] = useState();
  const [id] = useState(uuidv4());
  const sendPoint = () => {
    client.send(`POINT ${xVal} ${yVal} ${id}`);
  };
  return (
    <div className='m-3'>
      <input
        placeholder='X'
        className='border rounded mr-3'
        onChange={(e) => setXVal(e.target.value)}
      />
      <input
        placeholder='Y'
        className='border rounded'
        onChange={(e) => setYVal(e.target.value)}
      />
      <div className='flex gap-4 mt-3'>
        <button
          className='rounded bg-blue-300 text-white px-3'
          onClick={sendPoint}
        >
          Plot
        </button>
        <button className='rounded bg-red-500 text-white px-3'>
          Delete Point
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message.data);
    };
  }, []);
  const [numPoints, setNumPoints] = useState(0);
  return (
    <>
      <button
        onClick={() => {
          client.send('ZOOMIN');
        }}
        className='border m-4 p-2'
      >
        Zoom In +
      </button>
      <button
        onClick={() => {
          client.send('ZOOMOUT');
        }}
        className='border m-4 p-2'
      >
        Zoom Out -
      </button>
      <button
        className='rounded text-white bg-orange-300 p-3'
        onClick={() => setNumPoints((points) => points + 1)}
      >
        Plot Point
      </button>
      {Array(numPoints)
        .fill(0)
        .map((_, i) => (
          <PointControl />
        ))}
    </>
  );
}
