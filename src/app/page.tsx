'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Heart, Book, Users, LogOut, Crown, TrendingUp, Award, Settings, User, Target, Zap, Calendar, Clock, Star, Trophy, Medal, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Tab = 'dashboard' | 'analise' | 'perfil' | 'dicas' | 'configuracoes'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
}

export default function SonoPerfeito() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [user, setUser] = useState<any>(null)
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Estados do Dashboard
  const [sleepQuality, setSleepQuality] = useState(7.8)
  const [sleepHours, setSleepHours] = useState(7.5)
  const [weekStreak, setWeekStreak] = useState(12)
  const [totalPoints, setTotalPoints] = useState(850)

  // Estados do Perfil
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    sleepGoal: '8',
    bedtimeGoal: '22:00',
    waketimeGoal: '06:00'
  })

  // Estados das Badges (Gamificação)
  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'Dorminhoco Iniciante', description: 'Complete 7 dias seguidos', icon: '🌙', unlocked: true, progress: 7, target: 7 },
    { id: '2', name: 'Mestre do Sono', description: 'Complete 30 dias seguidos', icon: '⭐', unlocked: false, progress: 12, target: 30 },
    { id: '3', name: 'Rotina Perfeita', description: 'Durma 8h por 14 dias', icon: '🏆', unlocked: false, progress: 8, target: 14 },
    { id: '4', name: 'Madrugador', description: 'Acorde antes das 6h por 7 dias', icon: '🌅', unlocked: true, progress: 7, target: 7 },
    { id: '5', name: 'Zen Master', description: 'Complete 50 meditações', icon: '🧘', unlocked: false, progress: 23, target: 50 },
    { id: '6', name: 'Campeão do Sono', description: 'Atinja 90 dias de streak', icon: '👑', unlocked: false, progress: 12, target: 90 }
  ])

  // Dados mock para gráficos
  const weekData = [
    { day: 'Seg', hours: 7.5, quality: 8 },
    { day: 'Ter', hours: 6.8, quality: 6 },
    { day: 'Qua', hours: 8.2, quality: 9 },
    { day: 'Qui', hours: 7.0, quality: 7 },
    { day: 'Sex', hours: 7.8, quality: 8 },
    { day: 'Sáb', hours: 8.5, quality: 9 },
    { day: 'Dom', hours: 8.0, quality: 8 }
  ]

  // Posts da comunidade (mock)
  const [communityPosts] = useState([
    { id: '1', author: 'Maria Silva', content: 'Consegui dormir 8h por 5 dias seguidos! A meditação antes de dormir está fazendo toda diferença 🧘✨', likes: 24, date: '2024-01-15' },
    { id: '2', author: 'João Santos', content: 'Dica: evitar telas 1h antes de dormir mudou minha vida. Qualidade do sono aumentou 40%! 📱❌', likes: 18, date: '2024-01-14' },
    { id: '3', author: 'Ana Costa', content: 'Acabei de desbloquear a badge Mestre do Sono! 30 dias de rotina perfeita 🏆🎉', likes: 32, date: '2024-01-13' }
  ])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      
      const { data: userData } = await supabase
        .from('usuarios')
        .select('nome')
        .eq('id', session.user.id)
        .single()
      
      if (userData) {
        setUserName(userData.nome)
        setProfileData(prev => ({ ...prev, name: userData.nome }))
      }
      
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const saveProfile = () => {
    alert('✅ Perfil atualizado com sucesso!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001F3F] flex items-center justify-center">
        <div className="text-[#FFDC00] text-2xl font-inter font-medium">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#001F3F]">
      {/* Header */}
      <header className="bg-[#002A54] shadow-lg border-b border-[#FFDC00]/20">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFDC00] to-[#e6c200] rounded-full flex items-center justify-center shadow-lg">
                <Moon className="w-6 h-6 text-[#001F3F]" />
              </div>
              <h1 className="text-3xl font-inter font-bold text-[#FFDC00]">Sono Perfeito</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#001F3F] rounded-lg border border-[#FFDC00]/30">
                <Trophy className="w-5 h-5 text-[#FFDC00]" />
                <span className="text-[#FFDC00] font-inter font-bold">{totalPoints} pts</span>
              </div>
              <button
                onClick={() => router.push('/subscription')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFDC00] to-[#e6c200] hover:from-[#e6c200] hover:to-[#FFDC00] text-[#001F3F] rounded-lg transition-all duration-300 font-inter font-bold shadow-md transform hover:scale-105"
              >
                <Crown className="w-4 h-4" />
                Premium
              </button>
              <span className="hidden md:block text-white font-inter font-medium">Olá, {userName || 'Usuário'}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#003A6F] hover:bg-[#004A8F] text-white rounded-lg transition-all duration-300 font-inter font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#002A54] shadow-sm border-b border-[#FFDC00]/20">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'analise', label: 'Análise', icon: Book },
              { id: 'perfil', label: 'Perfil', icon: User },
              { id: 'dicas', label: 'Dicas', icon: Heart },
              { id: 'configuracoes', label: 'Configurações', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as Tab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 whitespace-nowrap font-inter font-medium ${
                  activeTab === id
                    ? 'bg-[#FFDC00] text-[#001F3F] shadow-md'
                    : 'text-white hover:bg-[#003A6F]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#002A54] to-[#003A6F] rounded-2xl p-6 shadow-lg border border-[#FFDC00]/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#FFDC00]" />
                  </div>
                  <span className="text-[#FFDC00] text-sm font-inter font-medium">Hoje</span>
                </div>
                <h3 className="text-white text-sm font-inter mb-2">Qualidade do Sono</h3>
                <p className="text-[#FFDC00] text-3xl font-inter font-bold">{sleepQuality}/10</p>
                <div className="mt-3 flex items-center gap-2 text-green-400 text-sm font-inter">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% vs ontem</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#002A54] to-[#003A6F] rounded-2xl p-6 shadow-lg border border-[#FFDC00]/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#FFDC00]" />
                  </div>
                  <span className="text-[#FFDC00] text-sm font-inter font-medium">Média</span>
                </div>
                <h3 className="text-white text-sm font-inter mb-2">Horas de Sono</h3>
                <p className="text-[#FFDC00] text-3xl font-inter font-bold">{sleepHours}h</p>
                <div className="mt-3 flex items-center gap-2 text-green-400 text-sm font-inter">
                  <TrendingUp className="w-4 h-4" />
                  <span>Meta: 8h</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#002A54] to-[#003A6F] rounded-2xl p-6 shadow-lg border border-[#FFDC00]/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#FFDC00]" />
                  </div>
                  <span className="text-[#FFDC00] text-sm font-inter font-medium">Sequência</span>
                </div>
                <h3 className="text-white text-sm font-inter mb-2">Dias Consecutivos</h3>
                <p className="text-[#FFDC00] text-3xl font-inter font-bold">{weekStreak}</p>
                <div className="mt-3 flex items-center gap-2 text-green-400 text-sm font-inter">
                  <Target className="w-4 h-4" />
                  <span>Continue assim! 🔥</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#002A54] to-[#003A6F] rounded-2xl p-6 shadow-lg border border-[#FFDC00]/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#FFDC00]" />
                  </div>
                  <span className="text-[#FFDC00] text-sm font-inter font-medium">Total</span>
                </div>
                <h3 className="text-white text-sm font-inter mb-2">Badges Desbloqueadas</h3>
                <p className="text-[#FFDC00] text-3xl font-inter font-bold">{badges.filter(b => b.unlocked).length}/{badges.length}</p>
                <div className="mt-3 flex items-center gap-2 text-blue-400 text-sm font-inter">
                  <Trophy className="w-4 h-4" />
                  <span>Ver todas</span>
                </div>
              </div>
            </div>

            {/* Gráfico Semanal */}
            <div className="bg-[#002A54] rounded-2xl p-8 shadow-lg border border-[#FFDC00]/20">
              <h2 className="text-2xl font-inter font-bold text-[#FFDC00] mb-6">Progresso Semanal</h2>
              <div className="flex items-end justify-between gap-4 h-64">
                {weekData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-full bg-[#001F3F] rounded-t-lg relative overflow-hidden" style={{ height: `${(day.hours / 10) * 100}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FFDC00] to-[#e6c200]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#001F3F] font-inter font-bold text-sm">{day.hours}h</span>
                      </div>
                    </div>
                    <span className="text-white text-sm font-inter">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges em Destaque */}
            <div className="bg-[#002A54] rounded-2xl p-8 shadow-lg border border-[#FFDC00]/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-inter font-bold text-[#FFDC00]">Suas Conquistas 🏆</h2>
                <span className="text-white text-sm font-inter">{badges.filter(b => b.unlocked).length} desbloqueadas</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-[#FFDC00] to-[#e6c200] shadow-lg hover:scale-105'
                        : 'bg-[#001F3F] opacity-50 hover:opacity-70'
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className={`text-xs font-inter font-bold mb-1 ${badge.unlocked ? 'text-[#001F3F]' : 'text-white'}`}>
                      {badge.name}
                    </h3>
                    {!badge.unlocked && (
                      <div className="mt-2">
                        <div className="w-full bg-[#003A6F] rounded-full h-1.5">
                          <div
                            className="bg-[#FFDC00] h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-inter">{badge.progress}/{badge.target}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feed da Comunidade */}
            <div className="bg-[#002A54] rounded-2xl p-8 shadow-lg border border-[#FFDC00]/20">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-[#FFDC00]" />
                <h2 className="text-2xl font-inter font-bold text-[#FFDC00]">Comunidade</h2>
              </div>
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <div key={post.id} className="bg-[#001F3F] rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-[#FFDC00]/10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFDC00] to-[#e6c200] flex items-center justify-center text-[#001F3F] font-bold font-inter shadow-md">
                        {post.author[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-2 font-inter">{post.author}</h3>
                        <p className="text-gray-300 mb-3 font-inter">{post.content}</p>
                        <div className="flex items-center gap-4 text-gray-400 text-sm font-inter">
                          <button className="flex items-center gap-1 hover:text-[#FFDC00] transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Análise do Sono Tab */}
        {activeTab === 'analise' && (
          <div className="space-y-6">
            <div className="bg-[#002A54] rounded-2xl p-8 shadow-lg border border-[#FFDC00]/20">
              <h2 className="text-3xl font-inter font-bold text-[#FFDC00] mb-6">Análise Detalhada do Sono</h2>
              
              {/* Gráfico de Qualidade */}
              <div className="mb-8">
                <h3 className="text-xl font-inter font-bold text-white mb-4">Qualidade por Dia da Semana</h3>
                <div className="flex items-end justify-between gap-4 h-64">
                  {weekData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3">
                      <div className="w-full bg-[#001F3F] rounded-t-lg relative overflow-hidden" style={{ height: `${(day.quality / 10) * 100}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFDC00] to-[#e6c200]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[#001F3F] font-inter font-bold text-sm">{day.quality}/10</span>
                        </div>
                      </div>
                      <span className="text-white text-sm font-inter">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#001F3F] rounded-xl p-6 border border-[#FFDC00]/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#FFDC00]" />
                    </div>
                    <h3 className="text-lg font-inter font-bold text-white">Tendências</h3>
                  </div>
                  <ul className="space-y-3 text-gray-300 font-inter">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Sua qualidade de sono melhorou 15% esta semana</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Fins de semana têm melhor qualidade (+18%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>Terça-feira é seu dia mais desafiador</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#001F3F] rounded-xl p-6 border border-[#FFDC00]/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#FFDC00]" />
                    </div>
                    <h3 className="text-lg font-inter font-bold text-white">Recomendações</h3>
                  </div>
                  <ul className="space-y-3 text-gray-300 font-inter">
                    <li className="flex items-start gap-2">
                      <Star className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                      <span>Tente dormir 30min mais cedo nas terças</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                      <span>Mantenha a rotina dos fins de semana</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                      <span>Adicione 15min de meditação antes de dormir</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Estatísticas Mensais */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#002A54] rounded-xl p-6 shadow-lg border border-[#FFDC00]/20">
                <h3 className="text-white font-inter font-medium mb-2">Média Mensal</h3>
                <p className="text-[#FFDC00] text-4xl font-inter font-bold mb-2">7.6h</p>
                <p className="text-gray-400 text-sm font-inter">+0.4h vs mês anterior</p>
              </div>
              <div className="bg-[#002A54] rounded-xl p-6 shadow-lg border border-[#FFDC00]/20">
                <h3 className="text-white font-inter font-medium mb-2">Melhor Noite</h3>
                <p className="text-[#FFDC00] text-4xl font-inter font-bold mb-2">9.2h</p>
                <p className="text-gray-400 text-sm font-inter">Sábado, 13 Jan</p>
              </div>
              <div className="bg-[#002A54] rounded-xl p-6 shadow-lg border border-[#FFDC00]/20">
                <h3 className="text-white font-inter font-medium mb-2">Consistência</h3>
                <p className="text-[#FFDC00] text-4xl font-inter font-bold mb-2">87%</p>
                <p className="text-gray-400 text-sm font-inter">Excelente! Continue assim</p>
              </div>
            </div>
          </div>
        )}

        {/* Perfil do Usuário Tab */}
        {activeTab === 'perfil' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#002A54] rounded-2xl p-8 shadow-lg border border-[#FFDC00]/20">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFDC00] to-[#e6c200] flex items-center justify-center text-[#001F3F] text-4xl font-bold font-inter shadow-lg">
                  {userName[0] || 'U'}
                </div>
                <div>
                  <h2 className="text-3xl font-inter font-bold text-[#FFDC00] mb-2">{userName || 'Usuário'}</h2>
                  <p className="text-gray-400 font-inter">Membro desde Janeiro 2024</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-inter font-medium">Nome Completo</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-4 rounded-lg bg-[#001F3F] border-2 border-[#FFDC00] text-white focus:outline-none focus:border-[#e6c200] font-inter transition-all duration-300"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-inter font-medium">Idade</label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                    className="w-full px-4 py-4 rounded-lg bg-[#001F3F] border-2 border-[#FFDC00] text-white focus:outline-none focus:border-[#e6c200] font-inter transition-all duration-300"
                    placeholder="Sua idade"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-inter font-medium">Meta de Sono (horas)</label>
                  <input
                    type="number"
                    value={profileData.sleepGoal}
                    onChange={(e) => setProfileData({ ...profileData, sleepGoal: e.target.value })}
                    className="w-full px-4 py-4 rounded-lg bg-[#001F3F] border-2 border-[#FFDC00] text-white focus:outline-none focus:border-[#e6c200] font-inter transition-all duration-300"
                    placeholder="8"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2 font-inter font-medium">Horário Ideal para Dormir</label>
                    <input
                      type="time"
                      value={profileData.bedtimeGoal}
                      onChange={(e) => setProfileData({ ...profileData, bedtimeGoal: e.target.value })}
                      className="w-full px-4 py-4 rounded-lg bg-[#001F3F] border-2 border-[#FFDC00] text-white focus:outline-none focus:border-[#e6c200] font-inter transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-inter font-medium">Horário Ideal para Acordar</label>
                    <input
                      type="time"
                      value={profileData.waketimeGoal}
                      onChange={(e) => setProfileData({ ...profileData, waketimeGoal: e.target.value })}
                      className="w-full px-4 py-4 rounded-lg bg-[#001F3F] border-2 border-[#FFDC00] text-white focus:outline-none focus:border-[#e6c200] font-inter transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  onClick={saveProfile}
                  className="w-full py-4 bg-[#FFDC00] text-[#001F3F] font-inter font-bold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>

              {/* Estatísticas do Perfil */}
              <div className="mt-8 pt-8 border-t border-[#FFDC00]/20">
                <h3 className="text-xl font-inter font-bold text-white mb-4">Suas Estatísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-[#FFDC00] text-3xl font-inter font-bold">{weekStreak}</p>
                    <p className="text-gray-400 text-sm font-inter mt-1">Dias de Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#FFDC00] text-3xl font-inter font-bold">{totalPoints}</p>
                    <p className="text-gray-400 text-sm font-inter mt-1">Pontos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#FFDC00] text-3xl font-inter font-bold">{badges.filter(b => b.unlocked).length}</p>
                    <p className="text-gray-400 text-sm font-inter mt-1">Badges</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#FFDC00] text-3xl font-inter font-bold">87%</p>
                    <p className="text-gray-400 text-sm font-inter mt-1">Consistência</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dicas Tab */}
        {activeTab === 'dicas' && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-[#002A54] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FFDC00]/20">
              <div className="w-12 h-12 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-inter font-bold text-[#FFDC00] mb-4">Alimentação</h3>
              <ul className="space-y-3 text-white font-inter">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Evite cafeína após 16h</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Jantar leve 2-3h antes de dormir</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Banana ou iogurte antes de dormir</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Evite álcool e comidas pesadas</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#002A54] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FFDC00]/20">
              <div className="w-12 h-12 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">🧘</span>
              </div>
              <h3 className="text-2xl font-inter font-bold text-[#FFDC00] mb-4">Relaxamento</h3>
              <ul className="space-y-3 text-white font-inter">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Meditação de 10 minutos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Respiração profunda 4-7-8</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Alongamentos suaves</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Música relaxante</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#002A54] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FFDC00]/20">
              <div className="w-12 h-12 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">🏃</span>
              </div>
              <h3 className="text-2xl font-inter font-bold text-[#FFDC00] mb-4">Atividades Diárias</h3>
              <ul className="space-y-3 text-white font-inter">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Exercícios pela manhã</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Exposição ao sol</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Caminhadas regulares</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Evite cochilos longos</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#002A54] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FFDC00]/20">
              <div className="w-12 h-12 bg-[#FFDC00]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">🛏️</span>
              </div>
              <h3 className="text-2xl font-inter font-bold text-[#FFDC00] mb-4">Ambiente Ideal</h3>
              <ul className="space-y-3 text-white font-inter">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Temperatura entre 18-22°C</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Quarto escuro e silencioso</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Colchão confortável</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                  <span>Sem telas 1h antes de dormir</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Configurações Tab */}
        {activeTab === 'configuracoes' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#002A54] rounded-2xl p-8 shadow-lg border border-[#FFDC00]/20">
              <h2 className="text-3xl font-inter font-bold text-[#FFDC00] mb-6">Configurações</h2>
              
              <div className="space-y-6">
                <div className="pb-6 border-b border-[#FFDC00]/20">
                  <h3 className="text-xl font-inter font-bold text-white mb-4">Notificações</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-inter font-medium">Lembrete para Dormir</p>
                        <p className="text-gray-400 text-sm font-inter">Receba notificação 30min antes do horário ideal</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-12 h-6 rounded-full accent-[#FFDC00]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-inter font-medium">Relatório Semanal</p>
                        <p className="text-gray-400 text-sm font-inter">Resumo do seu progresso toda segunda-feira</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-12 h-6 rounded-full accent-[#FFDC00]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-inter font-medium">Conquistas</p>
                        <p className="text-gray-400 text-sm font-inter">Notificações quando desbloquear badges</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-12 h-6 rounded-full accent-[#FFDC00]" />
                    </div>
                  </div>
                </div>

                <div className="pb-6 border-b border-[#FFDC00]/20">
                  <h3 className="text-xl font-inter font-bold text-white mb-4">Privacidade</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-inter font-medium">Perfil Público</p>
                        <p className="text-gray-400 text-sm font-inter">Permitir que outros vejam suas conquistas</p>
                      </div>
                      <input type="checkbox" className="w-12 h-6 rounded-full accent-[#FFDC00]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-inter font-medium">Compartilhar Dados</p>
                        <p className="text-gray-400 text-sm font-inter">Ajude a melhorar o app com dados anônimos</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-12 h-6 rounded-full accent-[#FFDC00]" />
                    </div>
                  </div>
                </div>

                <div className="pb-6 border-b border-[#FFDC00]/20">
                  <h3 className="text-xl font-inter font-bold text-white mb-4">Aparência</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-white font-inter font-medium mb-3">Tema</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-[#001F3F] border-2 border-[#FFDC00] rounded-lg text-white font-inter hover:bg-[#003A6F] transition-all">
                          Escuro (Atual)
                        </button>
                        <button className="p-4 bg-[#001F3F] border-2 border-[#FFDC00]/20 rounded-lg text-gray-400 font-inter hover:bg-[#003A6F] transition-all">
                          Claro
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-inter font-bold text-white mb-4">Conta</h3>
                  <div className="space-y-3">
                    <button className="w-full p-4 bg-[#001F3F] text-white rounded-lg hover:bg-[#003A6F] transition-all font-inter text-left">
                      Alterar Senha
                    </button>
                    <button className="w-full p-4 bg-[#001F3F] text-white rounded-lg hover:bg-[#003A6F] transition-all font-inter text-left">
                      Exportar Dados
                    </button>
                    <button className="w-full p-4 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-all font-inter text-left">
                      Excluir Conta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
