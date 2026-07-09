import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

    const tipo = (formData.get('tipo') as string) || 'produtos'
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = extname(file.name) || '.jpg'
    const nome = `${Date.now()}${ext}`
    const pasta = join(process.cwd(), 'public', 'uploads', tipo)

    await mkdir(pasta, { recursive: true })
    await writeFile(join(pasta, nome), buffer)

    return NextResponse.json({ ok: true, url: `/uploads/${tipo}/${nome}` })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
