import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { w3cwebsocket } from 'websocket';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

const client = new w3cwebsocket('ws://localhost:8000');

const PointControl = ({ setPoints, id }) => {
  const [xVal, setXVal] = useState();
  const [yVal, setYVal] = useState();
  const [plotted, setPlotted] = useState(false);
  const sendPoint = (task) => {
    if (plotted && task === 'PLOT') return;
    if ((isNaN(xVal) || isNaN(yVal)) && task === 'PLOT') {
      return Swal.fire({
        title: 'Error',
        text: 'Please enter a valid number',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    if (task == 'DELETE') {
      // Remove the component
      setPoints((points) => points.filter((point) => point !== id));
    }

    client.send(
      JSON.stringify({
        object: 'POINT',
        action: task,
        data: task === 'PLOT' && `${xVal} ${yVal}`,
        id,
        save: true,
      })
    );
    setPlotted(task === 'PLOT');
  };
  return (
    <div className='my-2 w-[250px]'>
      <div className='flex justify-between'>
        <input
          placeholder='X'
          className='border rounded mr-3 pl-2 w-1/2'
          onChange={(e) => setXVal(e.target.value)}
        />
        <input
          placeholder='Y'
          className='border rounded pl-2 w-1/2'
          onChange={(e) => setYVal(e.target.value)}
        />
      </div>
      <div className='flex gap-4 mt-3 justify-end'>
        <button
          className={`rounded  text-white px-3 ${
            !plotted ? 'bg-blue-300' : 'bg-slate-500 cursor-not-allowed'
          }`}
          onClick={() => sendPoint('PLOT')}
        >
          {!plotted ? 'Plot' : 'Plotted'}
        </button>
        <button
          className='rounded bg-red-500 text-white px-3'
          onClick={() => sendPoint('DELETE')}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
const Settings = () => {
  return (
    <div>
      <div className='rounded border-2 mb-3'>
        <button
          onClick={() => {
            client.send(
              client.send(
                JSON.stringify({
                  action: 'ZOOMIN',
                })
              )
            );
          }}
          className='border m-4 p-2 rounded'
        >
          Zoom In +
        </button>
        <button
          onClick={() => {
            client.send(
              JSON.stringify({
                action: 'ZOOMOUT',
              })
            );
          }}
          className='border m-4 p-2 rounded'
        >
          Zoom Out -
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
    client.onmessage = (message) => {};
  }, []);
  const [points, setPoints] = useState([]);
  const [functions, setFunctions] = useState([]);
  return (
    <div className='p-3'>
      <Settings />
      <div className='flex justify-between'>
        <div>
          <button
            className='rounded text-white bg-orange-300 p-3'
            onClick={() => setPoints((points) => [...points, uuidv4()])}
          >
            Add Point
          </button>
          {points.map((id, i) => (
            <PointControl setPoints={setPoints} id={id} />
          ))}
        </div>
        <div>
          <button className='rounded text-white bg-blue-300 p-3'>
            Add Function
          </button>
        </div>
      </div>
    </div>
  );
}
