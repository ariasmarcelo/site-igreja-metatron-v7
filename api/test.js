// API de teste simples para verificar se Vercel Dev está funcionando

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    success: true,
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
      hasAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
      nodeVersion: process.version,
    }
  });
};
