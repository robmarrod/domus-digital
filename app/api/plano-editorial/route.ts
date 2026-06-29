import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const prioridade = searchParams.get('prioridade')
  const statusPlan = searchParams.get('statusPlan')
  const comodo = searchParams.get('comodo')

  const where: Record<string, string> = {}
  if (prioridade) where.prioridade = prioridade
  if (statusPlan) where.statusPlan = statusPlan
  if (comodo) where.comodo = comodo

  const artigos = await prisma.planoEditorial.findMany({
    where,
    orderBy: { numero: 'asc' },
  })
  return NextResponse.json(artigos)
}
