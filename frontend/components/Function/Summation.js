import React, { useState, useEffect } from 'react';
import { simplify, parse, derivative, isInteger } from 'mathjs';

const ComputeSummation = (func, start, end) => {
  if (start > end) throw new Error('Bound not valid');
  if (!isInteger(start) || !isInteger(end))
    throw new Error('Make sure bounds are integers');
  let sum = 0;

  const f = simplify(parse(func));
  for (let i = start; i <= end; i++) {
    sum += f.evaluate({ x: i });
  }
  return sum;
};

export default function Summation({ func }) {
  const [summationParam, setSummationParam] = useState({});
  const [summationRes, setSummationRes] = useState({});
  useEffect(() => {
    if (!summationParam.start && !summationParam.end) {
      setSummationRes({});
    }
  }, [summationParam]);
  const onSummationClick = () => {
    try {
      const res = ComputeSummation(
        func,
        summationParam.start,
        summationParam.end
      );
      setSummationRes({
        start: summationParam.start,
        end: summationParam.end,
        res,
      });
    } catch (err) {
      return Swal.fire({
        title: 'Error',
        text: err,
        icon: 'error',
      });
    }
  };
  return (
    <>
      <h1 className='font-bold'>Summation</h1>
      <div className='flex h-[40px] gap-3'>
        <input
          type='number'
          placeholder='Starting'
          className='w-1/3 rounded border pl-2 mr-2'
          onChange={(e) => {
            setSummationParam({
              ...summationParam,
              start: e.target.value.length > 0 ? +e.target.value : undefined,
            });
            if (e.target.value.length === 0) {
              setSummationRes({});
            }
            // console.log(e.target.value.length);
          }}
        />
        <input
          placeholder='Ending'
          type='number'
          className='w-1/3 rounded border pl-2'
          onChange={(e) => {
            setSummationParam({
              ...summationParam,
              end: e.target.value.length > 0 ? +e.target.value : undefined,
            });
            if (e.target.value.length === 0) {
              setSummationRes({});
            }
            console.log(summationParam);
          }}
        />{' '}
        <button
          type='number'
          className={`rounded p-2 ${
            summationParam.start !== undefined &&
            summationParam?.end !== undefined
              ? 'bg-green-300'
              : 'bg-slate-500 cursor-not-allowed'
          }  text-white`}
          onClick={() => {
            if (
              summationParam.start !== undefined &&
              summationParam?.end !== undefined
            ) {
              onSummationClick();
            }
          }}
        >
          Summation
        </button>
      </div>
      {summationRes?.res && (
        <h1>{`SUM(f(x), ${summationRes.start}, ${summationRes.end}) = ${summationRes.res}`}</h1>
      )}
    </>
  );
}
