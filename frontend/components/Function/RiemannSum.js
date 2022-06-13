import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function RiemannSum({ func }) {
    const [param, setParam] = useState({});
    const ComputeRS = () => {
        
    }
  return (
    <div className='flex flex-col gap-3'>
      <h1 className='font-bold'>Riemann Sum Integral</h1>
      <div className='flex gap-3 w-96 h-[40px]'>
        <input
          type='number'
          placeholder='Starting'
          className='w-1/3 rounded border pl-2'
          onChange={(e) => {
            setParam({ ...param, start: +e.target.value });
          }}
        />
        <input
          placeholder='Ending'
          type='number'
          className='w-1/3 rounded border pl-2'
          onChange={(e) => {
            setParam({ ...param, end: +e.target.value });
          }}
        />
        <input
          placeholder='Subdivisions'
          type='number'
          className='w-1/3 rounded border pl-2'
          onChange={(e) => {
            setParam({ ...param, dx: +e.target.value });
          }}
        />
      </div>
      <div class='flex gap-2'>
        <button type='number' className={`btn-cyan`} onClick={() => {}}>
          Left
        </button>
        <button type='number' className={`btn-cyan`} onClick={() => {}}>
          Right
        </button>
        <button type='number' className={`btn-cyan`} onClick={() => {}}>
          Middle
        </button>
        <button type='number' className={`btn-cyan`} onClick={() => {}}>
          Trapezoidal
        </button>
      </div>
    </div>
  );
}
