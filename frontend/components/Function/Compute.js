import React, { useState, useEffect } from 'react';
import math, { simplify, parse, derivative, isInteger, isNumber } from 'mathjs';
import Swal from 'sweetalert2';

export default function Compute({ func }) {
  const [toCompute, setToCompute] = useState({});
  const onEvaluateClick = () => {
    const f = simplify(parse(func));
    const res = f.evaluate({ x: toCompute.val });
    setToCompute({ ...toCompute, res, displayVal: toCompute.val });
  };
  useEffect(() => {
    switch (toCompute.val) {
      case 'e':
        setToCompute({ ...toCompute, val: Math.E });
        break;
      case 'pi':
        setToCompute({ ...toCompute, val: Math.PI });
        break;
      case 'g':
        setToCompute({ ...toCompute, val: 6.6743 * Math.pow(10, -11) });
        break;
      case 'phi':
        setToCompute({ ...toCompute, val: (1 + Math.sqrt(5)) / 2 });
        break;
      default:
        break;
    }
  }, [toCompute.val]);
  const ValidateInput = () => {
    const mathConstants = ['e', 'pi', 'g', 'phi'];
    if (mathConstants.includes(toCompute.val)) return true;
    else if (!isNaN(toCompute.val)) return true;
    return false;
  };
  return (
    <>
      <h1 className='font-bold'>Evaluate Function</h1>
      <div className='flex gap-3'>
        <input
          type='text'
          placeholder='Evaluate f(x)'
          className='rounded border pl-2'
          onChange={(e) => {
            setToCompute(
              e.target.value
                ? { ...toCompute, val: String(e.target.value).toLowerCase() }
                : {}
            );
          }}
        />{' '}
        <button
          className={`rounded p-2 text-white ${
            ValidateInput()
              ? 'bg-orange-300'
              : 'bg-slate-500 cursor-not-allowed'
          }`}
          onClick={() => {
            if (ValidateInput()) onEvaluateClick();
          }}
        >
          Evaluate f(x)
        </button>
      </div>
      {toCompute?.res && (
        <h1>{`f(${toCompute.displayVal}) = ${toCompute.res}`}</h1>
      )}
    </>
  );
}
