import Axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { simplify, parse, derivative } from 'mathjs';

export default function FunctionControl({
  preDefFunc = null,
  setFunctions,
  allFunctions,
  id,
  wsc,
}) {
  const [plotted, setPlotted] = useState(preDefFunc !== null);
  const [func, setFunc] = useState(preDefFunc !== null ? preDefFunc : '');
  const [toCompute, setToCompute] = useState({});
  const sendFunction = async (task) => {
    try {
      const f = simplify(parse(func));
      f.evaluate({ x: 0 });
    } catch (err) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err,
      });
    }
    await Axios.post('/api/save', {
      object: 'FUNCTION',
      function: func,
      task,
      id,
    });
    switch (task) {
      case 'PLOT':
        if (plotted) return;
        if (func === '') {
          return Swal.fire({
            title: 'Error',
            text: 'Please enter a valid function',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        setPlotted(task === 'PLOT');

        break;
      case 'DELETE':
        setFunctions([...allFunctions].filter((f) => f.id !== id));

        break;
      case 'REQUEST':
        break;
      default:
        return Swal.fire({
          title: 'Error',
          icon: 'error',
          confirmButtonText: 'OK',
        });
    }
  };

  const sendRequest = async (task) => {
    // switch (task) {
    //   case 'COMPUTE':
    //     await Axios.post('/api/request', {
    //       task,
    //       val: computeVal,
    //       functionId: id,
    //       requestId: uuidv4(),
    //     }).then(() => {
    //       wsc.onmessage = (message) => {
    //         console.log(message);
    //       };
    //     });
    //     break;
    //   case 'SUMMATION':
    //     break;
    // }
    const f = simplify(parse(func));
    switch (task) {
      case 'COMPUTE':
        if (toCompute?.val) {
          try {
            const res = f.evaluate({ x: toCompute.val });
            console.log(res);
            setToCompute({ ...toCompute, res });
          } catch (err) {
            Swal.fire({
              title: 'Error',
              text: err,
              icon: 'error',
            });
          }
        }
        break;
    }
  };

  return (
    <div className='my-2 border rounded-xl p-3 border-blue-500'>
      <div className='flex gap-2'>
        <input
          placeholder='Function'
          className={'rounded border pl-2'}
          onChange={(e) => {
            setFunc(e.target.value);
            if (plotted) setPlotted(false);
          }}
          defaultValue={preDefFunc}
        />
        <button
          className={`rounded text-white p-2 ${
            !plotted ? 'bg-blue-500' : 'bg-gray-500 cursor-not-allowed'
          }`}
          onClick={() => sendFunction('PLOT')}
        >
          {plotted ? 'Plotted' : 'Plot'}
        </button>
        <button
          className='rounded bg-red-500 text-white p-2'
          onClick={() => sendFunction('DELETE')}
        >
          Delete
        </button>
      </div>
      {plotted && (
        <div className='flex flex-col mt-3 gap-4'>
          <div className='flex gap-3'>
            <input
              type='number'
              placeholder='Compute'
              className='rounded border pl-2'
              onChange={(e) =>
                setToCompute({ ...toCompute, val: +e.target.value })
              }
            />{' '}
            <button
              className='rounded bg-orange-300 p-2 text-white'
              onClick={() => sendRequest('COMPUTE')}
            >
              Compute f(x)
            </button>
          </div>

          <div className='flex flex-col gap-3'>
            <input
              type='number'
              placeholder='Derivative'
              className='rounded border pl-2'
            />{' '}
            <div className='flex justify-between'>
              <button
                className='rounded bg-cyan-300 p-2 text-white'
                onClick={() => sendRequest('COMPUTE')}
              >
                Plot Tangent
              </button>
              <button
                className='rounded bg-cyan-300 p-2 text-white'
                onClick={() => sendRequest('COMPUTE')}
              >
                Compute Derivative
              </button>
            </div>
          </div>

          <div className='flex h-[40px] gap-3'>
            <input
              type='number'
              placeholder='Starting'
              className='w-1/3 rounded border pl-2 mr-2'
            />
            <input
              placeholder='Ending'
              type='number'
              className='w-1/3 rounded border pl-2'
            />{' '}
            <button
              type='number'
              className='rounded p-2 bg-green-300 text-white'
              onClick={() => sendRequest('SUMMATION')}
            >
              Summation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
