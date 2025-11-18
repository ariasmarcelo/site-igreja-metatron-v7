const http = require('http');

const options = {
  hostname: '192.168.1.2',
  port: 3000,
  path: '/api/content/tratamentos',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const treatments = json.content?.treatments || json.treatments || [];
      
      console.log('\n=== TRATAMENTOS (total:', treatments.length, ') ===\n');
      treatments.forEach((t, i) => {
        console.log(`[${i}] ${t.title}`);
      });
      console.log('\n');
    } catch (e) {
      console.error('Erro ao parsear JSON:', e.message);
      console.log('Dados recebidos:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Erro na requisição:', e.message);
});

req.end();
