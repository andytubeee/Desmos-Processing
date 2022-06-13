import Axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { simplify, parse, derivative, isInteger } from 'mathjs';
import RiemannSum from './Function/RiemannSum';
import Summation from './Function/Summation';

const isComplex = (func) => {
  const COMPLEXREGEX =
    /[+-]?(((\d+\.\d*|\d*\.\d+|\d+)[+-])?((\d+\.\d*|\d*\.\d+|\d+)i|i(\d+\.\d*|\d*\.\d+|\d+)|i)|(\d+\.\d*|\d*\.\d+|\d+)?e\^(\([+-]?|[+-]?\()((\d+\.\d*|\d*\.\d+|\d+)i|i(\d+\.\d*|\d*\.\d+|\d+)|i)\))/gm;
  return COMPLEXREGEX.test(func);
};

const FunctionSettings = ({ masterProp, func }) => {
  const { preDefFunc = null, setFunctions, allFunctions, id, wsc } = masterProp;
  const [toCompute, setToCompute] = useState({});
  const [ddxCompute, setDdxCompute] = useState({});

  const GetDerivative = (func, val) => {
    const f = simplify(parse(func));

    return {
      dFunc: derivative(f, 'x').toString().replace(/\s/g, ''),
      value: derivative(f, 'x').evaluate({ x: val }),
    };
  };

  const sendRequest = async (task) => {
    const f = simplify(parse(func));
    switch (task) {
      case 'COMPUTE':
        if (toCompute?.val) {
          try {
            // console.log(toCompute.val);
            const res = f.evaluate({ x: toCompute.val });
            setToCompute({ ...toCompute, res, displayVal: toCompute.val });
          } catch (err) {
            Swal.fire({
              title: 'Error',
              text: err,
              icon: 'error',
            });
          }
        }
        break;

      case 'DERIVATIVE':
        try {
          const res = GetDerivative(func, ddxCompute.val);
          setDdxCompute({ ...ddxCompute, res });
        } catch (err) {
          return Swal.fire({
            title: 'Error',
            text: err,
            icon: 'error',
          });
        }
        break;
      case 'TANGENT':
        try {
          const res = GetDerivative(func, ddxCompute.val);
          const fc = f.evaluate({ x: ddxCompute.val });

          // return console.log(f.evaluate({ x: ddxCompute.val }));
          if (isNaN(res.value)) {
            return Swal.fire({
              title: 'Error',
              text: 'Tangent is not defined at x=' + ddxCompute.val,
              icon: 'error',
            });
          } else if (isComplex(res.value)) {
            return Swal.fire({
              title: 'Error',
              text:
                'The derivative at x=' +
                ddxCompute.val +
                ' is complex: ' +
                res.value,
              icon: 'error',
            });
          } else if (isComplex(fc)) {
            return Swal.fire({
              title: 'Error',
              text:
                'The function at x=' + ddxCompute.val + ' is complex: ' + fc,
              icon: 'error',
            });
          }
          const linearApproxFuncString = `${res.value}*(x-${ddxCompute.val})+${fc}`;
          const lap = simplify(parse(linearApproxFuncString))
            .toString()
            .replace(/\s/g, '');
          // Create a new d/dx function
          const newFuncId = uuidv4();
          setFunctions((functions) => [
            ...functions,
            { id: newFuncId, function: lap },
          ]);
          await Axios.post('/api/save', {
            object: 'FUNCTION',
            function: lap,
            task: 'PLOT',
            id: newFuncId,
          });
        } catch (err) {
          return Swal.fire({ title: 'Error', text: err, icon: 'error' });
        }
        break;
    }
  };
  return (
    <div className='flex flex-col mt-3 gap-4'>
      <div className='flex gap-3'>
        <input
          type='number'
          placeholder='Compute'
          className='rounded border pl-2'
          onChange={(e) => {
            setToCompute(
              e.target.value ? { ...toCompute, val: +e.target.value } : {}
            );
          }}
        />{' '}
        <button
          className={`rounded p-2 text-white ${
            toCompute?.val ? 'bg-orange-300' : 'bg-slate-500 cursor-not-allowed'
          }`}
          onClick={() => {
            if (toCompute?.val) sendRequest('COMPUTE');
          }}
        >
          Compute f(x)
        </button>
      </div>
      {toCompute?.res && (
        <h1>{`f(${toCompute.displayVal}) = ${toCompute.res}`}</h1>
      )}
      <div className='flex flex-col gap-3'>
        <input
          type='number'
          placeholder='Derivative'
          className='rounded border pl-2 py-2'
          onChange={(e) => {
            setDdxCompute({
              ...ddxCompute,
              val: e.target.value.length > 0 ? +e.target.value : null,
            });
          }}
        />{' '}
        <div className='flex justify-between'>
          <button
            className={`rounded p-2 text-white ${
              ddxCompute.val !== undefined
                ? 'bg-cyan-300'
                : 'bg-slate-500 cursor-not-allowed'
            }`}
            onClick={() => {
              if (ddxCompute.val !== undefined) {
                sendRequest('TANGENT');
              }
            }}
          >
            Plot Tangent
          </button>
          <button
            className={`rounded p-2 text-white ${
              ddxCompute.val !== undefined
                ? 'bg-cyan-300'
                : 'bg-slate-500 cursor-not-allowed'
            }`}
            onClick={() => {
              if (ddxCompute.val !== undefined) {
                sendRequest('DERIVATIVE');
              }
            }}
          >
            Compute Derivative
          </button>
        </div>
      </div>
      {ddxCompute?.res && (
        <h1>
          f'(x) = {ddxCompute?.res.dFunc}
          <br />
          f'({ddxCompute?.val}) = {ddxCompute?.res.value}
        </h1>
      )}
      <Summation func={func} />
      <RiemannSum func={func} />
    </div>
  );
};

export default function FunctionControl(props) {
  const { preDefFunc = null, setFunctions, allFunctions, id, wsc } = props;
  const [plotted, setPlotted] = useState(preDefFunc !== null);
  const [func, setFunc] = useState(preDefFunc !== null ? preDefFunc : '');
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
      {plotted && <FunctionSettings masterProp={props} func={func} />}
    </div>
  );
}
