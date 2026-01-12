import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = '/var/www/uploads'; 
const PUBLIC_BASE_URL = 'https://mimomeueseu.com/uploads'; // Ajuste para o seu domínio real

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'Arquivo vazio' }, { status: 400 });
    }

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.type?.split('/')[1] || 'jpg';
    const fileName = `banner-${Date.now()}-${crypto.randomUUID().slice(0, 4)}.${extension}`;
    const filePath = path.resolve(UPLOAD_DIR, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `${PUBLIC_BASE_URL}/${fileName}`
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 });
  }
}