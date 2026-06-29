import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'

async function garantirTabela() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PlanoEditorial" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "numero" INTEGER NOT NULL,
      "produto" TEXT NOT NULL,
      "comodo" TEXT NOT NULL,
      "keywordPrincipal" TEXT NOT NULL,
      "variacao1" TEXT,
      "variacao2" TEXT,
      "variacao3" TEXT,
      "tituloH1" TEXT NOT NULL,
      "intencaoBusca" TEXT NOT NULL,
      "volumeEstimado" INTEGER NOT NULL,
      "sd" INTEGER NOT NULL,
      "ticket" TEXT NOT NULL,
      "comissaoMin" TEXT NOT NULL,
      "prioridade" TEXT NOT NULL,
      "statusPlan" TEXT NOT NULL DEFAULT 'A criar',
      "concorrentes" TEXT,
      "postSlug" TEXT,
      "observacoes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "PlanoEditorial_numero_key" ON "PlanoEditorial"("numero")
  `)
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const wb = XLSX.read(buffer, { type: 'buffer' })

  const sheetName = wb.SheetNames.find(n => n.includes('Plano')) || wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null })

  const headerIdx = rows.findIndex(r => Array.isArray(r) && r.some(c => c === '#'))
  if (headerIdx === -1) {
    return NextResponse.json({ error: 'Cabeçalho não encontrado. Certifique que a planilha tem a coluna "#".' }, { status: 400 })
  }

  const headers = rows[headerIdx] as string[]
  const col = (name: string) => headers.findIndex(h => h && String(h).trim() === name)

  const iNum = col('#')
  const iProduto = col('Produto')
  const iComodo = col('Cômodo')
  const iKw = col('Keyword Principal (H1)')
  const iV1 = col('Variação 1')
  const iV2 = col('Variação 2')
  const iV3 = col('Variação 3')
  const iTitulo = col('Título H1 do Artigo')
  const iIntencao = col('Intenção de Busca')
  const iVol = col('Vol. Est.')
  const iSd = col('SD')
  const iTicket = col('Ticket')
  const iComissao = col('Comissão Mín.')
  const iPrioridade = col('Prioridade')
  const iStatus = col('Status')
  const iConc = col('Concorrentes Reais (URLs)')

  if (iNum === -1 || iProduto === -1 || iKw === -1) {
    return NextResponse.json({
      error: `Colunas não encontradas. Colunas detectadas: ${headers.filter(Boolean).join(', ')}`,
    }, { status: 400 })
  }

  // Garante que a tabela existe antes de inserir
  try {
    await garantirTabela()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: `Erro ao criar tabela: ${msg}` }, { status: 500 })
  }

  let inseridos = 0
  let atualizados = 0
  let erros = 0
  let primeiroErro = ''

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i] as unknown[]
    const numero = r[iNum]
    if (!numero || isNaN(Number(numero))) continue

    const data = {
      numero: Number(numero),
      produto: String(r[iProduto] ?? ''),
      comodo: iComodo !== -1 ? String(r[iComodo] ?? '') : '',
      keywordPrincipal: String(r[iKw] ?? ''),
      variacao1: (iV1 !== -1 && r[iV1]) ? String(r[iV1]) : null,
      variacao2: (iV2 !== -1 && r[iV2]) ? String(r[iV2]) : null,
      variacao3: (iV3 !== -1 && r[iV3]) ? String(r[iV3]) : null,
      tituloH1: iTitulo !== -1 ? String(r[iTitulo] ?? '') : '',
      intencaoBusca: iIntencao !== -1 ? String(r[iIntencao] ?? '') : '',
      volumeEstimado: (iVol !== -1 && r[iVol]) ? (Number(r[iVol]) || 0) : 0,
      sd: (iSd !== -1 && r[iSd]) ? (Number(r[iSd]) || 0) : 0,
      ticket: iTicket !== -1 ? String(r[iTicket] ?? '') : '',
      comissaoMin: iComissao !== -1 ? String(r[iComissao] ?? '') : '',
      prioridade: iPrioridade !== -1 ? String(r[iPrioridade] ?? '') : '',
      concorrentes: (iConc !== -1 && r[iConc]) ? String(r[iConc]) : null,
    }

    try {
      const existing = await prisma.planoEditorial.findUnique({ where: { numero: data.numero } })
      if (existing) {
        await prisma.planoEditorial.update({ where: { numero: data.numero }, data })
        atualizados++
      } else {
        const statusVal = (iStatus !== -1 && r[iStatus]) ? String(r[iStatus]) : 'A criar'
        await prisma.planoEditorial.create({ data: { ...data, statusPlan: statusVal } })
        inseridos++
      }
    } catch (e: unknown) {
      erros++
      if (!primeiroErro) primeiroErro = e instanceof Error ? e.message : String(e)
    }
  }

  return NextResponse.json({ ok: true, inseridos, atualizados, erros, primeiroErro: primeiroErro || null })
}
