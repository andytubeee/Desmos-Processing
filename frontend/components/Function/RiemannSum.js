import React, { useEffect, useState } from 'react';
import { simplify, parse, derivative, isInteger } from 'mathjs';
import Swal from 'sweetalert2';

export default function RiemannSum({ func }) {
  const [params, setParam] = useState({});
  const [res, setRes] = useState();
  const ComputeRS = (type) => {
    let sum = 0;
    const dx = (params.end - params.start) / params.subdivisons;
    const f = simplify(parse(func));
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
          onClick={() => {
            setParam({ ...params, mode: 'LEFT' });
            setRes(ComputeRS('LEFT'));
          }}
        >
          Left
        </button>
        <button
          type='number'
          className={`btn-cyan`}
          onClick={() => {
            setParam({ ...params, mode: 'RIGHT' });
            setRes(ComputeRS('RIGHT'));
          }}
        >
          Right
        </button>
        <button
          type='number'
          className={`btn-cyan`}
          onClick={() => {
            setParam({ ...params, mode: 'MIDPOINT' });
            setRes(ComputeRS('MIDPOINT'));
          }}
        >
          Midpoint
        </button>
        <button
          type='number'
          className={`btn-cyan`}
          onClick={() => {
            setParam({ ...params, mode: 'TRAPEZOIDAL' });
            setRes(ComputeRS('TRAPEZOIDAL'));
          }}
        >
          Trapezoidal
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
