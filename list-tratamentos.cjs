const http = require('http');

http.get('http://localhost:3000/api/content/tratamentos', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.treatments && Array.isArray(json.treatments)) {
        console.log('\n📋 Lista de Tratamentos:\n');
        json.treatments.forEach((treatment, index) => {
          console.log(`${index}: ${treatment.title}`);
        });
        console.log('');
      } else {
        console.log('❌ Formato inesperado:', Object.keys(json));
      }
    } catch (e) {
      console.error('❌ Erro ao parsear:', e.message);
    }
  });
}).on('error', (e) => {
  console.error('❌ Erro na requisição:', e.message);
});
