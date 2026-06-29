import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

  const tipo = formData.get('tipo') as string || 'produtos' // 'produtos' | 'posts'

  const buffer = Buffer.from(await file.arrayBuffer())

  const [w, h] = tipo === 'posts' ? [1200, 630] : [800, 800]

  const webp = await sharp(buffer)
    .resize(w, h, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer()

  // Nome único baseado em timestamp
  const nome = `${Date.now()}.webp`
  const pasta = join(process.cwd(), 'public', 'uploads', tipo)
  await mkdir(pasta, { recursive: true })
  await writeFile(join(pasta, nome), webp)

  const url = `/uploads/${tipo}/${nome}`
  return NextResponse.json({ ok: true, url })
}
