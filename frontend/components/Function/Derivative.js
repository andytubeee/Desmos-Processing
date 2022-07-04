import React, { useState, useEffect } from 'react';
import { simplify, parse, derivative, isInteger } from 'mathjs';
import Swal from 'sweetalert2';
import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function Derivative({ func, setFunctions }) {
  const [ddxCompute, setDdxCompute] = useState({});

  const isComplex = (func) => {
    const COMPLEXREGEX =
      /[+-]?(((\d+\.\d*|\d*\.\d+|\d+)[+-])?((\d+\.\d*|\d*\.\d+|\d+)i|i(\d+\.\d*|\d*\.\d+|\d+)|i)|(\d+\.\d*|\d*\.\d+|\d+)?e\^(\([+-]?|[+-]?\()((\d+\.\d*|\d*\.\d+|\d+)i|i(\d+\.\d*|\d*\.\d+|\d+)|i)\))/gm;
    return COMPLEXREGEX.test(func);
  };
  const GetDerivative = (func, val) => {
    const f = simplify(parse(func));

    return {
      dFunc: derivative(f, 'x').toString().replace(/\s/g, ''),
      value: derivative(f, 'x').evaluate({ x: val }),
    };
  };
  const ComputeDDX = () => {
    try {
      const res = GetDerivative(func, ddxCompute.val);
      setDdxCompute({ ...ddxCompute, res, displayValue: ddxCompute.val });
    } catch (err) {
      return Swal.fire({
        title: 'Error',
        text: err,
        icon: 'error',
      });
    }
  };
  useEffect(() => {
    switch (ddxCompute.val) {
      case 'e':
        setDdxCompute({ ...ddxCompute, val: Math.E });
        break;
      case 'pi':
        setDdxCompute({ ...ddxCompute, val: Math.PI });
        break;
      case 'g':
        setDdxCompute({ ...ddxCompute, val: 6.6743 * Math.pow(10, -11) });
        break;
      case 'phi':
        setDdxCompute({ ...ddxCompute, val: (1 + Math.sqrt(5)) / 2 });
        break;
      default:
        break;
    }
  }, [ddxCompute.val]);
  const ValidateInput = () => {
    const mathConstants = ['e', 'pi', 'g', 'phi'];
    if (mathConstants.includes(ddxCompute.val)) return true;
    else if (!isNaN(ddxCompute.val)) return true;
    return false;
  };
  const PlotTangent = async () => {
    try {
      const f = simplify(parse(func));
      const res = GetDerivative(func, ddxCompute.val);
      const fc = f.evaluate({ x: ddxCompute.val });

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
          text: 'The function at x=' + ddxCompute.val + ' is complex: ' + fc,
          icon: 'error',
        });
      }
      const linearApproxFuncString = `${res.value}*(x-${ddxCompute.val})+${fc}`;
      const lap = simplify(parse(linearApproxFuncString))
        .toString()
        .replace(/\s/g, '');
      // Create a new d/dx function
      const newFuncId = uuidv4();
      const funcNote = `This function is the tangent of ${func} at x equals ${ddxCompute.val}`;
      setFunctions((functions) => [
        ...functions,
        {
          id: newFuncId,
          function: lap,
          note: funcNote,
        },
      ]);
      await Axios.post('/api/save', {
        object: 'FUNCTION',
        function: lap,
        task: 'PLOT',
        id: newFuncId,
        note: funcNote,
      });
    } catch (err) {
      return Swal.fire({ title: 'Error', text: err, icon: 'error' });
    }
  };
  return (
    <>
      <h1 className='font-bold'>Function Derivative</h1>
      <div className='flex flex-col gap-3'>
        <input
          placeholder="f'(x)"
          className='rounded border pl-2 py-2'
          onChange={(e) => {
            setDdxCompute({
              ...ddxCompute,
              val: e.target.value.length > 0 ? e.target.value : null,
            });
          }}
        />{' '}
        <div className='flex justify-between'>
          <button
            className={`rounded p-2 text-white ${
              ValidateInput()
                ? 'bg-cyan-300'
                : 'bg-slate-500 cursor-not-allowed'
            }`}
            onClick={() => {
              if (ValidateInput()) {
                PlotTangent();
              }
            }}
          >
            Plot Tangent
          </button>
          <button
            className={`rounded p-2 text-white ${
              ValidateInput()
                ? 'bg-cyan-300'
                : 'bg-slate-500 cursor-not-allowed'
            }`}
            onClick={() => {
              if (ValidateInput()) {
                ComputeDDX();
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
          f'({ddxCompute?.displayValue}) = {ddxCompute?.res.value}
        </h1>
      )}
    </>
  );
}
