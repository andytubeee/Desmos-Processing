import React, { useState } from 'react';

export default function FunctionControl({ func, setFunctions }) {
  const [plotted, setPlotted] = useState(false);
  return (
    <div className='my-2'>
      <div className='flex gap-2'>
        <input placeholder='Function' className='rounded border pl-2' />
        <button className='rounded bg-purple-300 text-white p-2'>Plot</button>
        <button className='rounded bg-red-500 text-white p-2'>Delete</button>
      </div>
      {plotted && (
        <div className='flex gap-4'>
          <div className='flex'>
            <input placeholder='Compute' className='rounded border' />{' '}
            <button>Compute f(x)</button>
          </div>
          <div className='flex'>
            <input placeholder='Starting' /> <input placeholder='Ending' />{' '}
            <button>Compute summation</button>
          </div>
        </div>
      )}
    </div>
  );
}
