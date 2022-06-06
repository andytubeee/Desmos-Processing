// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'node:fs';
import isPortReachable from 'is-port-reachable';

export default async function handler(req, res) {
  if (!(await isPortReachable(8000, { host: 'localhost' }))) {
    res.status(500).json({ error: 'Server not running' });
    return;
  }
  const functions = fs.readFileSync('data/functions.json', (err, data) => {
    if (err) res.status(500).end();
    return data;
  });
  const points = fs.readFileSync('data/points.json', (err, data) => {
    if (err) res.status(500).end();
    return data;
  });

  res.status(200).json({
    functions:
      functions.toString().length > 0 ? JSON.parse(functions.toString()) : [],
    points: points.toString().length > 0 ? JSON.parse(points.toString()) : [],
  });
}
