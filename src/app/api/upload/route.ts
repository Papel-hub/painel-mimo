import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = '/var/www/uploads'; 
const PUBLIC_BASE_URL = 'https://mimomeueseu.com/uploads';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File; // Alterado de Blob para File para melhor suporte

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'Arquivo vazio' }, { status: 400 });
    }

    // 1. Lógica de Extensão Robusta
    // Em vez de split no MIME type, pegamos a extensão real do nome do arquivo
    let extension = path.extname(file.name).toLowerCase().replace('.', '');
    
    // Fallback: se não tiver extensão no nome, usamos o MIME type mas limpamos o +xml
    if (!extension) {
      extension = file.type?.split('/')[1]?.split('+')[0] || 'jpg';
    }

    // 2. Garantir que o diretório existe
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 3. Gerar nome limpo: banner-timestamp-hash.extensao
    const fileName = `banner-${Date.now()}-${crypto.randomUUID().slice(0, 4)}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `${PUBLIC_BASE_URL}/${fileName}`
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 });
  }
}