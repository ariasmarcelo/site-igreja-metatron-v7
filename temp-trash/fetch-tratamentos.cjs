const http = require('http');

const options = {
  hostname: '192.168.1.2',
  port: 3000,
  path: '/api/content/tratamentos',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.success && response.content && response.content.treatments) {
        console.log('\n📋 Lista de Tratamentos:\n');
        response.content.treatments.forEach((treatment, index) => {
          console.log(`${index}: ${treatment.title}`);
        });
        console.log('');
      } else {
        console.log('Estrutura da resposta:', JSON.stringify(response, null, 2));
      }
    } catch (e) {
      console.error('Erro ao parsear:', e.message);
      console.log('Resposta:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Erro na requisição:', e.message);
  console.log('Tente verificar se o servidor está rodando em 192.168.1.2:3000');
});

req.end();
