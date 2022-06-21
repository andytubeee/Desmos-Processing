// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'node:fs';
import isPortReachable from 'is-port-reachable';
import { w3cwebsocket } from 'websocket';

export default async function handler(req, res) {
  if (!(await isPortReachable(8000, { host: 'localhost' }))) {
    res.status(500).json({ error: 'Server not running' });
    return;
  }
  const client = await new w3cwebsocket('ws://localhost:8000');
  const { body } = req;
  const { object, task } = body;
  let curPoints = fs.readFileSync('data/points.json', (err, data) => {
    if (err) res.status(500).json({ error: 'File reading error' }).end();
    return data;
  });
  let curFunctions = fs.readFileSync('data/functions.json', (err, data) => {
    if (err) res.status(500).json({ error: 'File reading error' }).end();
    return data;
  });
  curPoints = JSON.parse(curPoints.toString()) || [];
  curFunctions = JSON.parse(curFunctions.toString()) || [];

  if (task === 'PLOT') {
    if (object === 'POINT') {
      const exists = curPoints.find((point) => point.id === body.id);
      if (!exists) {
        // Add point
        fs.writeFileSync(
          'data/points.json',
          JSON.stringify([
            ...curPoints,
            { x: +body.x, y: +body.y, id: body.id },
          ])
        );
      } else {
        // Update point object
        fs.writeFileSync(
          'data/points.json',
          JSON.stringify(
            curPoints.map((point) => {
              if (point.id === body.id)
                return { x: +body.x, y: +body.y, id: body.id };
              return point;
            })
          )
        );
      }
    } else if (object === 'FUNCTION') {
      const exists = curFunctions.find((f) => f.id === body.id);
      if (!exists) {
        // Add function to data/functions.json
        fs.writeFileSync(
          'data/functions.json',
          JSON.stringify([
            ...curFunctions,
            {
              function: body.function,
              id: body.id,
              note: body?.note ? body.note : 'null',
            },
          ])
        );
      } else {
        // Update the function with the given id.
        fs.writeFileSync(
          'data/functions.json',
          JSON.stringify(
            curFunctions.map((f) => {
              if (f.id === body.id)
                return {
                  function: body.function,
                  id: body.id,
                  note: body?.note ? body.note : 'null',
                };

              return f;
            })
          )
        );
      }
    }
  }

  if (task === 'DELETE') {
    if (object === 'POINT') {
      curPoints = curPoints.filter((point) => point.id !== body.id);
      fs.writeFileSync('data/points.json', JSON.stringify(curPoints));
    } else if (object === 'FUNCTION') {
      curFunctions = curFunctions.filter((f) => f.id !== body.id);
      fs.writeFileSync('data/functions.json', JSON.stringify(curFunctions));
    }
  }
  res.status(200).json({ success: true });

  // fs.writeFile('../backend/data/points.json', 'BRUH', (err) => {
  //   if (err) throw err;
  // });
}
