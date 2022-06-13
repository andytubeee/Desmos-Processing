import React, { useState, useEffect } from 'react';
import { simplify, parse, derivative, isInteger } from 'mathjs';

export default function Compute({ func }) {
  const [toCompute, setToCompute] = useState({});
  const onComputeClick = () => {
    const f = simplify(parse(func));
    const res = f.evaluate({ x: toCompute.val });
    setToCompute({ ...toCompute, res, displayVal: toCompute.val });
  };
  return (
    <>
      <h1 className='font-bold'>Compute Function</h1>
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
            if (toCompute?.val) onComputeClick();
          }}
        >
          Compute f(x)
        </button>
      </div>
      {toCompute?.res && (
        <h1>{`f(${toCompute.displayVal}) = ${toCompute.res}`}</h1>
      )}
    </>
  );
}