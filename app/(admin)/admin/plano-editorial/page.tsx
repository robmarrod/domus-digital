'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

type Artigo = {
  id: string
  numero: number
  produto: string
  comodo: string
  keywordPrincipal: string
  variacao1: string | null
  variacao2: string | null
  variacao3: string | null
  tituloH1: string
  intencaoBusca: string
  volumeEstimado: number
  sd: number
  ticket: string
  comissaoMin: string
  prioridade: string
  statusPlan: string
  concorrentes: string | null
  postSlug: string | null
  observacoes: string | null
}

const STATUS_COLORS: Record<string, string> = {
  'A criar': 'bg-gray-100 text-gray-700',
  'Em produção': 'bg-yellow-100 text-yellow-800',
  'Publicado': 'bg-green-100 text-green-800',
  'Agendado': 'bg-blue-100 text-blue-800',
}

const PRIORIDADE_COLORS: Record<string, string> = {
  '🔥 Top': 'bg-red-100 text-red-700',
  '✅ Alta': 'bg-emerald-100 text-emerald-700',
  '⚠️ SD alto': 'bg-amber-100 text-amber-700',
}

const STATUS_OPTIONS = ['A criar', 'Em produção', 'Publicado', 'Agendado']

export default function PlanoEditorialPage() {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroPrioridade, setFiltroPrioridade] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroComodo, setFiltroComodo] = useState('')
  const [busca, setBusca] = useState('')
  const [expandido, setExpandido] = useState<string | null>(null)
  const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null)
  const [valorEdit, setValorEdit] = useState('')
  const [importando, setImportando] = useState(false)
  const [importMsg, setImportMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)

  const fetchArtigos = useCallback(async () => {
    const params = new URLSearchParams()
    if (filtroPrioridade) params.set('prioridade', filtroPrioridade)
    if (filtroStatus) params.set('statusPlan', filtroStatus)
    if (filtroComodo) params.set('comodo', filtroComodo)
    const res = await fetch(`/api/plano-editorial?${params}`)
    const data = await res.json()
    setArtigos(data)
    setLoading(false)
  }, [filtroPrioridade, filtroStatus, filtroComodo])

  useEffect(() => {
    setLoading(true)
    fetchArtigos()
  }, [fetchArtigos])

  const artFiltrados = artigos.filter(a => {
    if (!busca) return true
    const q = busca.toLowerCase()
    return (
      a.keywordPrincipal.toLowerCase().includes(q) ||
      a.produto.toLowerCase().includes(q) ||
      a.tituloH1.toLowerCase().includes(q)
    )
  })

  const total = artigos.length
  const porStatus = artigos.reduce<Record<string, number>>((acc, a) => {
    acc[a.statusPlan] = (acc[a.statusPlan] || 0) + 1
    return acc
  }, {})
  const porPrioridade = artigos.reduce<Record<string, number>>((acc, a) => {
    acc[a.prioridade] = (acc[a.prioridade] || 0) + 1
    return acc
  }, {})
  const comodos = Array.from(new Set(artigos.map(a => a.comodo))).sort()
  const volTotal = artigos.reduce((s, a) => s + a.volumeEstimado, 0)

  async function importarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportando(true)
    setImportMsg(null)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/plano-editorial/import', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.ok) {
        setImportMsg({ tipo: 'ok', texto: `✅ ${data.inseridos} inseridos, ${data.atualizados} atualizados${data.erros ? `, ${data.erros} erros` : ''}.` })
        fetchArtigos()
      } else {
        setImportMsg({ tipo: 'erro', texto: `❌ ${data.error}` })
      }
    } catch {
      setImportMsg({ tipo: 'erro', texto: '❌ Falha ao enviar o arquivo.' })
    } finally {
      setImportando(false)
      e.target.value = ''
    }
  }

  async function salvarCampo(id: string, campo: string, valor: string) {
    await fetch(`/api/plano-editorial/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [campo]: valor }),
    })
    setArtigos(prev => prev.map(a => a.id === id ? { ...a, [campo]: valor } : a))
    setEditando(null)
  }

  function iniciarEdit(id: string, campo: string, valorAtual: string) {
    setEditando({ id, campo })
    setValorEdit(valorAtual || '')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 Plano Editorial 2026</h1>
          <p className="text-gray-500 text-sm mt-1">100 artigos long-tail Casa, Decoração &amp; Equipamentos</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${importando ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}>
            {importando ? '⏳ Importando...' : '📥 Importar Excel'}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              disabled={importando}
              onChange={importarArquivo}
            />
          </label>
          {importMsg && (
            <span className={`text-xs px-3 py-1 rounded-full ${importMsg.tipo === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {importMsg.texto}
            </span>
          )}
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500 mt-1">Artigos no plano</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-green-600">{porStatus['Publicado'] || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Publicados</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-yellow-600">{porStatus['Em produção'] || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Em produção</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-gray-400">{porStatus['A criar'] || 0}</div>
          <div className="text-xs text-gray-500 mt-1">A criar</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-red-600">{porPrioridade['🔥 Top'] || 0}</div>
          <div className="text-xs text-gray-500 mt-1">🔥 Prioridade Top</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-emerald-600">{porPrioridade['✅ Alta'] || 0}</div>
          <div className="text-xs text-gray-500 mt-1">✅ Prioridade Alta</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-purple-600">{(volTotal / 1000).toFixed(0)}k</div>
          <div className="text-xs text-gray-500 mt-1">Vol. total estimado/mês</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-pink-500">
            {total > 0 ? Math.round(((total - (porStatus['A criar'] || 0)) / total) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Progresso geral</div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progresso ({total - (porStatus['A criar'] || 0)} de {total} iniciados)</span>
          <span>{total > 0 ? Math.round(((total - (porStatus['A criar'] || 0)) / total) * 100) : 0}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${total > 0 ? ((total - (porStatus['A criar'] || 0)) / total) * 100 : 0}%`,
              background: 'linear-gradient(90deg, #F4607B, #e04060)',
            }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          {Object.entries(STATUS_COLORS).map(([s, cls]) => (
            <span key={s} className={`px-2 py-0.5 rounded-full ${cls}`}>
              {porStatus[s] || 0} {s}
            </span>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar keyword ou produto..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <select
          value={filtroPrioridade}
          onChange={e => setFiltroPrioridade(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="">Todas prioridades</option>
          <option value="🔥 Top">🔥 Top</option>
          <option value="✅ Alta">✅ Alta</option>
          <option value="⚠️ SD alto">⚠️ SD alto</option>
        </select>
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="">Todos status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filtroComodo}
          onChange={e => setFiltroComodo(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="">Todos cômodos</option>
          {comodos.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-xs text-gray-400 self-center">{artFiltrados.length} artigos</span>
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-3 py-3 text-left w-8">#</th>
                <th className="px-3 py-3 text-left">Produto / Keyword</th>
                <th className="px-3 py-3 text-left hidden md:table-cell">Cômodo</th>
                <th className="px-3 py-3 text-right hidden lg:table-cell">Vol.</th>
                <th className="px-3 py-3 text-right hidden lg:table-cell">SD</th>
                <th className="px-3 py-3 text-center hidden md:table-cell">Prioridade</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {artFiltrados.map(a => (
                <>
                  <tr
                    key={a.id}
                    className={`hover:bg-gray-50 cursor-pointer ${a.statusPlan === 'Publicado' ? 'opacity-70' : ''}`}
                    onClick={() => setExpandido(expandido === a.id ? null : a.id)}
                  >
                    <td className="px-3 py-3 text-gray-400 font-mono text-xs">{a.numero}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800 text-xs leading-tight">{a.produto}</div>
                      <div className="text-gray-500 text-xs mt-0.5 truncate max-w-xs">{a.keywordPrincipal}</div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-500">{a.comodo}</span>
                    </td>
                    <td className="px-3 py-3 text-right hidden lg:table-cell">
                      <span className="text-xs font-mono text-gray-700">
                        {a.volumeEstimado >= 1000 ? `${(a.volumeEstimado / 1000).toFixed(0)}k` : a.volumeEstimado}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right hidden lg:table-cell">
                      <span className={`text-xs font-mono ${a.sd <= 15 ? 'text-green-600' : a.sd <= 22 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {a.sd}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORIDADE_COLORS[a.prioridade] || 'bg-gray-100 text-gray-600'}`}>
                        {a.prioridade}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center" onClick={e => e.stopPropagation()}>
                      {editando?.id === a.id && editando.campo === 'statusPlan' ? (
                        <select
                          autoFocus
                          value={valorEdit}
                          onChange={e => setValorEdit(e.target.value)}
                          onBlur={() => salvarCampo(a.id, 'statusPlan', valorEdit)}
                          className="text-xs border rounded px-1 py-0.5"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${STATUS_COLORS[a.statusPlan] || 'bg-gray-100 text-gray-600'}`}
                          title="Clique para alterar status"
                          onClick={() => iniciarEdit(a.id, 'statusPlan', a.statusPlan)}
                        >
                          {a.statusPlan}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center" onClick={e => e.stopPropagation()}>
                      <Link
                        href={`/admin/posts/novo?keyword=${encodeURIComponent(a.keywordPrincipal)}&titulo=${encodeURIComponent(a.tituloH1)}&categoria=${encodeURIComponent(a.comodo)}`}
                        className="text-xs text-pink-500 hover:text-pink-700 font-medium"
                        title="Criar post para este artigo"
                      >
                        + Post
                      </Link>
                    </td>
                  </tr>
                  {expandido === a.id && (
                    <tr key={`${a.id}-expand`} className="bg-blue-50">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-semibold text-gray-700 mb-2">📌 Título H1</div>
                            <div className="text-gray-600">{a.tituloH1}</div>

                            <div className="font-semibold text-gray-700 mt-3 mb-1">🎯 Intenção de Busca</div>
                            <div className="text-gray-600 text-xs">{a.intencaoBusca}</div>

                            <div className="font-semibold text-gray-700 mt-3 mb-1">🔑 Variações</div>
                            <ul className="text-xs text-gray-500 space-y-0.5">
                              {a.variacao1 && <li>• {a.variacao1}</li>}
                              {a.variacao2 && <li>• {a.variacao2}</li>}
                              {a.variacao3 && <li>• {a.variacao3}</li>}
                            </ul>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700 mb-2">💰 Monetização</div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div><span className="font-medium">Ticket:</span> {a.ticket}</div>
                              <div><span className="font-medium">Comissão mín.:</span> {a.comissaoMin}</div>
                            </div>

                            <div className="font-semibold text-gray-700 mt-3 mb-1">🏆 Concorrentes</div>
                            <div className="text-xs text-gray-500">{a.concorrentes || '—'}</div>

                            <div className="mt-3">
                              <div className="font-semibold text-gray-700 mb-1">📝 Observações</div>
                              {editando?.id === a.id && editando.campo === 'observacoes' ? (
                                <div className="flex gap-2">
                                  <input
                                    autoFocus
                                    value={valorEdit}
                                    onChange={e => setValorEdit(e.target.value)}
                                    className="border rounded px-2 py-1 text-xs flex-1"
                                    placeholder="Adicionar observação..."
                                  />
                                  <button
                                    onClick={() => salvarCampo(a.id, 'observacoes', valorEdit)}
                                    className="text-xs bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600"
                                  >
                                    Salvar
                                  </button>
                                  <button onClick={() => setEditando(null)} className="text-xs text-gray-400">✕</button>
                                </div>
                              ) : (
                                <div
                                  className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 border border-dashed border-gray-200 rounded p-1.5"
                                  onClick={() => iniciarEdit(a.id, 'observacoes', a.observacoes || '')}
                                >
                                  {a.observacoes || 'Clique para adicionar observação...'}
                                </div>
                              )}
                            </div>

                            {a.postSlug && (
                              <div className="mt-3">
                                <Link href={`/reviews/${a.postSlug}`} target="_blank" className="text-xs text-blue-600 hover:underline">
                                  🔗 Ver post publicado →
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {artFiltrados.length === 0 && (
            <div className="text-center py-10 text-gray-400">Nenhum artigo encontrado com esses filtros.</div>
          )}
        </div>
      )}
    </div>
  )
}
