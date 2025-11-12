import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pageId, content } = req.body;

    if (!pageId || !content) {
      return res.status(400).json({ error: 'Missing pageId or content' });
    }

    // Caminho do JSON atual
    const jsonPath = path.join(process.cwd(), 'src', 'locales', 'pt-BR', `${pageId.charAt(0).toUpperCase() + pageId.slice(1)}.json`);
    
    // Ler JSON atual
    let currentContent = {};
    if (fs.existsSync(jsonPath)) {
      currentContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    }

    // Comparar conteúdo
    const currentStr = JSON.stringify(currentContent, null, 2);
    const newStr = JSON.stringify(content, null, 2);

    if (currentStr === newStr) {
      return res.status(200).json({ 
        updated: false, 
        message: 'Content is identical, no update needed' 
      });
    }

    // Criar backup (rotacionar últimas 5 versões)
    const backupDir = path.join(process.cwd(), 'src', 'locales', 'pt-BR', 'backups', pageId);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Listar backups existentes
    const backups = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    // Se já tem 5 backups, remover o mais antigo
    if (backups.length >= 5) {
      fs.unlinkSync(path.join(backupDir, backups[4]));
    }

    // Criar novo backup com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${pageId}_${timestamp}.json`);
    fs.writeFileSync(backupPath, currentStr);

    // Atualizar JSON principal
    fs.writeFileSync(jsonPath, newStr);

    return res.status(200).json({ 
      updated: true, 
      message: 'Fallback updated successfully',
      backupCreated: backupPath
    });

  } catch (error) {
    console.error('Error updating fallback:', error);
    return res.status(500).json({ 
      error: 'Failed to update fallback',
      details: error.message 
    });
  }
}
