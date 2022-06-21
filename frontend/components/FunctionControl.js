import Axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { simplify, parse, derivative, isInteger } from 'mathjs';
import RiemannSum from './Function/RiemannSum';
import Summation from './Function/Summation';
import Compute from './Function/Compute';
import Derivative from './Function/Derivative';

const isComplex = (func) => {
  const COMPLEXREGEX =
    /[+-]?(((\d+\.\d*|\d*\.\d+|\d+)[+-])?((\d+\.\d*|\d*\.\d+|\d+)i|i(\d+\.\d*|\d*\.\d+|\d+)|i)|(\d+\.\d*|\d*\.\d+|\d+)?e\^(\([+-]?|[+-]?\()((\d+\.\d*|\d*\.\d+|\d+)i|i(\d+\.\d*|\d*\.\d+|\d+)|i)\))/gm;
  return COMPLEXREGEX.test(func);
};

const FunctionSettings = ({ masterProp, func }) => {
  const {
    preDefFunc = null,
    setFunctions,
    allFunctions,
    id,
    setWSCInstructions,
  } = masterProp;

  return (
    <div className='flex flex-col mt-3 gap-4'>
      <Compute func={func} />
      <Derivative func={func} setFunctions={setFunctions} />
      <Summation func={func} />
      <RiemannSum func={func} funcId={id} />
    </div>
  );
};

export default function FunctionControl(props) {
  const {
    preDefFunc = null,
    setFunctions,
    allFunctions,
    id,
    wsc,
    notes,
  } = props;
  const [plotted, setPlotted] = useState(preDefFunc !== null);
  const [func, setFunc] = useState(preDefFunc !== null ? preDefFunc : '');
  const [functionPlayGroundOpenState, setFunctionPlayGroundOpenState] =
    useState(false);
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
        await Axios.post('/api/save', {
          object: 'FUNCTION',
          function: func,
          task,
          id,
        });
        setPlotted(task === 'PLOT');

        break;
      case 'DELETE':
        setFunctions([...allFunctions].filter((f) => f.id !== id));
        await Axios.post('/api/save', {
          object: 'FUNCTION',
          function: func,
          task,
          id,
        });
        break;
      case 'DELETEPLOTONLY':
        await Axios.post('/api/save', {
          object: 'FUNCTION',
          function: func,
          task: 'DELETE',
          id,
        });
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
  return (
    <div className='my-2 border rounded-xl p-3 border-blue-500'>
      {notes !== 'null' && (
        <h1 className='mb-2'>
          <strong>Note:</strong>
          <br />
          {notes.replaceAll('equals', '=')}
        </h1>
      )}
      <div className='flex gap-2'>
        <input
          placeholder='Function'
          className={'rounded border pl-2'}
          onChange={(e) => {
            setFunc(e.target.value);
            if (plotted) {
              setPlotted(false);
              sendFunction('DELETEPLOTONLY');
            }
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
        <button
          className='btn-blue mt-2'
          onClick={() => setFunctionPlayGroundOpenState((s) => !s)}
        >
          Function Playground
        </button>
      )}
      {plotted && functionPlayGroundOpenState && (
        <FunctionSettings masterProp={props} func={func} />
      )}
    </div>
  );
}
