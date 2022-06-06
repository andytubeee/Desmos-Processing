import { useState } from 'react';
import Swal from 'sweetalert2';
import Axios from 'axios';

export const PointControl = ({ points, setPoints, id, x, y }) => {
  const [xVal, setXVal] = useState(x);
  const [yVal, setYVal] = useState(y);
  const [plotted, setPlotted] = useState(x && y);
  const sendPoint = async (task) => {
    if (plotted && task === 'PLOT') return;
    if ((isNaN(xVal) || isNaN(yVal)) && task === 'PLOT') {
      return Swal.fire({
        title: 'Error',
        text: 'Please enter a valid number',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    await Axios.post('/api/save', {
      object: 'POINT',
      x: xVal,
      y: yVal,
      task,
      id,
    })
      .then(() => {
        setPlotted(task === 'PLOT');
        if (task === 'DELETE') {
          // Remove the component
          const prevPoints = [...points];
          setPoints(prevPoints.filter((point) => point.id !== id));
          // setPoints(prevPoints.filter((point) => point.id !== id));
        } else if (task === 'PLOT') {
          setPoints((points) =>
            points.map((point) =>
              point.id === id ? { ...point, x: +xVal, y: +yVal } : point
            )
          );
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className='my-2 w-[250px] border rounded p-2'>
      <div className='flex justify-between'>
        <input
          placeholder='X'
          className='border rounded mr-3 pl-2 w-1/2'
          onChange={(e) => {
            setXVal(e.target.value);
            if (plotted) setPlotted(false);
          }}
          defaultValue={x}
        />
        <input
          placeholder='Y'
          className='border rounded pl-2 w-1/2'
          onChange={(e) => setYVal(e.target.value)}
          defaultValue={y}
        />
      </div>
      <div className='flex gap-4 mt-3 justify-end'>
        <button
          className={`rounded  text-white px-3 ${
            !plotted ? 'bg-blue-300' : 'bg-slate-500 cursor-not-allowed'
          }`}
          onClick={() => sendPoint('PLOT')}
        >
          {!plotted ? 'Plot' : 'Plotted'}
        </button>
        <button
          className='rounded bg-red-500 text-white px-3'
          onClick={() => sendPoint('DELETE')}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
