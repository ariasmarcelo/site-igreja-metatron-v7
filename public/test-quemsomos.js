console.log('=== DEBUG QUEM SOMOS ===');
fetch('http://localhost:3000/api/content-v2?pages=quemsomos')
  .then(r => r.json())
  .then(data => {
    console.log('API Response:', data);
    console.log('Has quemsomos?', !!data.pages.quemsomos);
    console.log('Header:', data.pages.quemsomos?.header);
  })
  .catch(err => console.error('Error:', err));
