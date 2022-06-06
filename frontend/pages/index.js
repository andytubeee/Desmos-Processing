import { w3cwebsocket } from 'websocket';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import Axios from 'axios';
import absoluteUrl from 'next-absolute-url';
import { PointControl } from '../components/PointControl';
import FunctionControl from '../components/FunctionControl';

const client = new w3cwebsocket('ws://localhost:8000');

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
export default function Home({ data, connected }) {
  const [points, setPoints] = useState(data?.points);
  const [functions, setFunctions] = useState([]);

  if (!connected)
    return (
      <>
        <div>
          <h1 className='m-3 text-center text-xl text-red-700'>
            Websocket not connected
          </h1>
        </div>
      </>
    );
  return (
    <div className='p-3'>
      <Settings />
      <div className='flex justify-between'>
        <div>
          <button
            className='rounded text-white bg-orange-300 p-3'
            onClick={() => setPoints((points) => [...points, { id: uuidv4() }])}
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
            />
          ))}
        </div>
        <div>
          <button
            className='rounded text-white bg-blue-300 p-3'
            onClick={() =>
              setFunctions((functions) => [...functions, { id: uuidv4() }])
            }
          >
            Add Function
          </button>
          {functions.map((function_, i) => (
            <FunctionControl setFunctions={setFunctions} />
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
      console.log(err.error);
      return null;
    });

  return { props: { connected: data !== null, data } };
}
