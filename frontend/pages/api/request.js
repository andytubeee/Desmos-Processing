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
  const { task } = body;
  let curRequests = fs.readFileSync('data/requests.json', (err, data) => {
    if (err) res.status(500).end();
    return data;
  });
  console.log(body);
  curRequests = JSON.parse(curRequests.toString());
  if (req.method === 'POST') {
    // Add request body to data/requests.json
    fs.writeFileSync(
      'data/requests.json',
      JSON.stringify([...curRequests, body])
    );
  } else if (req.method === 'GET') {
    // Fetch request from data/requests.json
    res.status(200).json({
      requests: curRequests,
    });
  }
}
