import { w3cwebsocket } from 'websocket';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import Axios from 'axios';
import absoluteUrl from 'next-absolute-url';
import { PointControl } from '../components/PointControl';
import FunctionControl from '../components/FunctionControl';
import { isInteger } from 'mathjs';

const client = new w3cwebsocket('ws://localhost:8000');

const Settings = () => {
  const [xBound, setXBound] = useState([-10, 10]);
  const [yBound, setYBound] = useState([-10, 10]);

  const ValidateBound = () => {
    if (xBound[0] >= xBound[1]) {
      Swal.fire({
        title: 'Error',
        text: 'X-axis lower bound must be less than upper bound',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }
    if (yBound[0] >= yBound[1]) {
      Swal.fire({
        title: 'Error',
        text: 'Y-axis lower bound must be less than upper bound',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }
    if (
      !isInteger(xBound[0]) ||
      !isInteger(xBound[1]) ||
      !isInteger(yBound[0]) ||
      !isInteger(yBound[1])
    ) {
      Swal.fire({
        title: 'Error',
        text: 'X-axis and Y-axis bounds must be integers',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }
    return true;
  };

  const sendAxis = () => {
    // Validate bound parameters
    if (!ValidateBound()) return;
    if (xBound[0] >= xBound[1]) {
      return Swal.fire({
        title: 'Error',
        text: 'X-axis lower bound must be less than upper bound',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    if (yBound[0] >= yBound[1]) {
      return Swal.fire({
        title: 'Error',
        text: 'Y-axis lower bound must be less than upper bound',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    if (
      !isInteger(xBound[0]) ||
      !isInteger(xBound[1]) ||
      !isInteger(yBound[0]) ||
      !isInteger(yBound[1])
    ) {
      return Swal.fire({
        title: 'Error',
        text: 'X-axis and Y-axis bounds must be integers',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    const action = `AXIS ${xBound[0]} ${xBound[1]} ${yBound[0]} ${yBound[1]}`;
    client.send(JSON.stringify({ action }));
  };

  return (
    <div className='p-4 border rounded'>
      <h1 className='text-center text-4xl font-bold'>Settings</h1>
      <div className='flex gap-4'>
        <button
          onClick={() => {
            client.send(
              JSON.stringify({
                action: 'ZOOMIN',
              })
            );
          }}
          className='btn-green'
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
          className='btn-green'
        >
          Zoom Out -
        </button>
      </div>
      <div className='my-2'>
        <h1 className='font-bold'>X Bound:</h1>
        <input
          type='number'
          className='input w-14'
          defaultValue={xBound[0]}
          onChange={(e) => {
            setXBound([+e.target.value, xBound[1]]);
          }}
        />
        <code> {` <= x <= `}</code>
        <input
          type='number'
          className='input w-14'
          defaultValue={xBound[1]}
          onChange={(e) => {
            setXBound([xBound[0], +e.target.value]);
          }}
        />
      </div>
      <div className='my-2'>
        <h1 className='font-bold'>Y Bound:</h1>
        <input
          type='number'
          className='input w-14'
          defaultValue={yBound[0]}
          onChange={(e) => {
            setYBound([+e.target.value, yBound[1]]);
          }}
        />
        <code> {` <= y <= `}</code>
        <input
          type='number'
          className='input w-14'
          defaultValue={yBound[1]}
          onChange={(e) => {
            setYBound([yBound[0], +e.target.value]);
          }}
        />
      </div>
      <button className='btn-blue' onClick={sendAxis}>
        Set Axis
      </button>
    </div>
  );
};
export default function Home({ data, connected }) {
  const [points, setPoints] = useState(data?.points);
  const [functions, setFunctions] = useState(data?.functions);
  const [settingsState, setSettingsState] = useState(false);
  if (!connected)
    return (
      <>
        <div className='min-h-screen flex items-center justify-center'>
          <h1 className='m-3 text-center text-3xl text-red-700'>
            <span className='font-bold'>Server Error:</span> Please check the
            websocket server is running on port <code>8000</code>, and check
            JSON files.
          </h1>
        </div>
      </>
    );
  return (
    <div className='p-3'>
      <button
        className='btn bg-black text-white mb-3'
        onClick={() => {
          setSettingsState((s) => !s);
        }}
      >
        {settingsState ? 'Close' : 'Open'} Settings
      </button>
      {settingsState && <Settings />}
      <div className='flex justify-between items-start'>
        <div className='p-3'>
          <button
            className='rounded text-white bg-orange-300 p-3'
            onClick={() => {
              setPoints((points) => [...points, { id: uuidv4() }]);
            }}
          >
            Add Point
          </button>
          {points.map((point, i) => (
            <PointControl
              key={i}
              setPoints={setPoints}
              points={points}
              id={point.id}
              x={point.x || null}
              y={point.y || null}
              wsc={client}
            />
          ))}
        </div>
        <div className='p-3 w-1/2 flex flex-col justify-end items-end'>
          <button
            className='rounded text-white bg-blue-300 p-3'
            onClick={() =>
              setFunctions((functions) => [...functions, { id: uuidv4() }])
            }
          >
            Add Function
          </button>
          {functions.map((f, i) => (
            <FunctionControl
              key={i}
              setFunctions={setFunctions}
              allFunctions={functions}
              preDefFunc={f?.function || null}
              id={f.id}
              wsc={client}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  // Fetch data from external API
  const { origin } = absoluteUrl(req);

  const data = await Axios.get(`${origin}/api/fetch`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return null;
    });

  return { props: { connected: data !== null, data } };
}
