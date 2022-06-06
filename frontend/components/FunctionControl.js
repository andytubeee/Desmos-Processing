import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function FunctionControl({
  preDefFunc = null,
  setFunctions,
  allFunctions,
}) {
  const [plotted, setPlotted] = useState(preDefFunc !== null);
  const [func, setFunc] = useState(preDefFunc);

  const sendFunction = async (task) => {
    if (plotted && task === 'PLOT') return;
    if (task === 'PLOT' && func?.length === 0) {
      return Swal.fire({
        title: 'Error',
        text: 'Please enter a valid function',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className='my-2'>
      <div className='flex gap-2'>
        <input
          placeholder='Function'
          className='rounded border pl-2'
          onChange={(e) => {
            setFunc(e.target.value);
            if (plotted) setPlotted(false);
          }}
          defaultValue={preDefFunc}
        />
        <button
          className={`rounded ${
            !plotted ? 'bg-purple-300' : 'bg-slate-600 cursor-not-allowed'
          }text-white p-2`}
          onClick={() => sendFunction('PLOT')}
        >
          Plot
        </button>
        <button
          className='rounded bg-red-500 text-white p-2'
          onClick={() => sendFunction('DELETE')}
        >
          Delete
        </button>
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
