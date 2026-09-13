const http = require('http');
const port = Number(process.env.PORT || 3000);
const started = new Date().toISOString();
const json = (res, code, body) => { res.writeHead(code, {'content-type':'application/json'}); res.end(JSON.stringify(body)); };
const authorized = (req) => !process.env.HERMES_API_KEY || req.headers['x-api-key'] === process.env.HERMES_API_KEY;
const server = http.createServer((req, res) => {
  if (req.url === '/healthz') return json(res, 200, {status:'ok', service:'hermes-quantum'});
  if (req.url === '/v1/status') {
    if (!authorized(req)) return json(res, 401, {error:'unauthorized'});
    return json(res, 200, {service:'hermes-quantum', role:'coordination-cabin', mode:'quantum', started});
  }
  if (req.url === '/') return json(res, 200, {service:'hermes-quantum', status:'ready'});
  return json(res, 404, {error:'not_found'});
});
server.listen(port, '0.0.0.0', () => console.log(`Hermes listening on ${port}`));
