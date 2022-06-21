import { w3cwebsocket } from 'websocket';
import React, { useEffect, useState } from 'react';
import { simplify, parse, derivative, isInteger } from 'mathjs';
import Swal from 'sweetalert2';
const client = new w3cwebsocket('ws://localhost:8000');

export default function RiemannSum({ func, funcId, setWSCInstructions }) {
  const [params, setParam] = useState({});
  const [res, setRes] = useState();
  const ComputeRS = (type) => {
    let sum = 0;
    const dx = (params.end - params.start) / params.subdivisons;
    const f = simplify(parse(func));
    if (Object.keys(params).length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Missing parameters',
      });
    }
    switch (type) {
      case 'LEFT':
        for (let i = 0; i < params.subdivisons; i++) {
          const res = f.evaluate({ x: params.start + i * dx });
          sum += res * dx;
        }
        break;
      case 'RIGHT':
        for (let i = 1; i <= params.subdivisons; i++) {
          const res = f.evaluate({ x: params.start + i * dx });
          sum += res * dx;
        }
        break;
      case 'MIDPOINT':
        for (let i = 0; i < params.subdivisons; i++) {
          const x = params.start + i * dx + (params.start + (i + 1) * dx);
          const res = f.evaluate({ x: x / 2 });
          sum += res * dx;
        }
        break;
      case 'TRAPEZOIDAL':
        for (let i = 0; i <= params.subdivisons; i++) {
          if (i == 0 || i == params.subdivisons) {
            sum += f.evaluate({ x: params.start + i * dx });
          } else {
            sum += f.evaluate({ x: params.start + i * dx }) * 2;
          }
        }
        sum *= dx / 2;
        break;
    }
    return sum;
  };
  const HandleButtonClick = (type) => {
    if (Object.keys(params).length === 0) {
      return Swal.fire({
        title: 'Missing parameters',
        icon: 'error',
      });
    }
    setParam({ ...params, mode: type });
    setRes(ComputeRS(type));
    client.send(
      JSON.stringify({
        action: `RIEMANN ${funcId} ${type} ${params.start} ${params.end} ${params.subdivisons}`,
      })
    );
  };

  const ClearRS = () => {
    setRes(null);
    client.send(
      JSON.stringify({
        action: `DELETERIEMANN ${funcId}`,
      })
    );
  };

  return (
    <div className='flex flex-col gap-3'>
      <h1 className='font-bold'>Riemann Sum Integral</h1>
      <div className='flex gap-3 w-96 h-[40px]'>
        <input
          type='number'
          placeholder='Starting'
          className='w-1/3 rounded border pl-2'
          onChange={(e) => {
            setParam({ ...params, start: +e.target.value });
          }}
        />
        <input
          placeholder='Ending'
          type='number'
          className='w-1/3 rounded border pl-2'
          onChange={(e) => {
            setParam({ ...params, end: +e.target.value });
          }}
        />
        <input
          placeholder='Subdivisions'
          type='number'
          className='w-1/3 rounded border pl-2'
          onChange={(e) => {
            setParam({ ...params, subdivisons: +e.target.value });
          }}
        />
      </div>
      <div className='flex gap-2'>
        <button
          type='number'
          className={`btn-cyan`}
          onClick={() => HandleButtonClick('LEFT')}
        >
          Left
        </button>
        <button
          type='number'
          className={`btn-cyan`}
          onClick={() => HandleButtonClick('RIGHT')}
        >
          Right
        </button>
        <button
          type='number'
          className={`btn-cyan`}
          onClick={() => HandleButtonClick('MIDPOINT')}
        >
          Midpoint
        </button>
        <button
          type='number'
          className={`btn-cyan`}
          onClick={() => HandleButtonClick('TRAPEZOIDAL')}
        >
          Trapezoidal
        </button>
        <button className='btn-danger' onClick={ClearRS}>
          Clear
        </button>
      </div>
      {res && (
        <h1>
          {params.mode}: {res}
        </h1>
      )}
    </div>
  );
}
