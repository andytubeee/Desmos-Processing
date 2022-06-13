import React, { useEffect, useState } from 'react';

export default function RiemannSum({ func }) {
  return (
    <div className='flex flex-col gap-3'>
      <h1 className='font-bold'>Riemann Sum Integral</h1>
      <div>
        <input
          type='number'
          placeholder='Starting'
          className='w-1/3 rounded border pl-2 mr-2'
          onChange={(e) => {}}
        />
        <input
          placeholder='Ending'
          type='number'
          className='w-1/3 rounded border pl-2'
          onChange={(e) => {}}
        />{' '}
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
