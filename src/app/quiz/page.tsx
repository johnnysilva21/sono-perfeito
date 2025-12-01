'use client'

import { useState, useEffect } from 'react'
import { Moon, ArrowRight, ArrowLeft, Loader2, CheckCircle, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type QuizStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23

interface QuizData {
  ageRange: string
  sleepDifficulty: string
  feelingRested: string
  sleepHours: string
  electronicsUsage: string
  dietQuality: string
  caffeineEvening: string
  physicalActivity: string
  sleepImpediment: string
  nightRoutine: string
  email: string
  wantsEmailTips: boolean
}

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState<QuizStep>(0)
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  
  const [quizData, setQuizData] = useState<QuizData>({
    ageRange: '',
    sleepDifficulty: '',
    feelingRested: '',
    sleepHours: '',
    electronicsUsage: '',
    dietQuality: '',
    caffeineEvening: '',
    physicalActivity: '',
    sleepImpediment: '',
    nightRoutine: '',
    email: '',
    wantsEmailTips: false
  })

  const [recommendations, setRecommendations] = useState<string[]>([])

  // Salvar progresso no localStorage
  useEffect(() => {
    localStorage.setItem('quizProgress', JSON.stringify({ step, quizData }))
  }, [step, quizData])

  // Carregar progresso salvo
  useEffect(() => {
    const saved = localStorage.getItem('quizProgress')
    if (saved) {
      const { step: savedStep, quizData: savedData } = JSON.parse(saved)
      setStep(savedStep)
      setQuizData(savedData)
    }
  }, [])

  const nextStep = () => {
    if (step < 23) {
      setStep((step + 1) as QuizStep)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep((step - 1) as QuizStep)
    }
  }

  const handleAnswer = (field: keyof QuizData, value: string | boolean) => {
    setQuizData({ ...quizData, [field]: value })
  }

  const generateRecommendations = () => {
    const recs: string[] = []

    if (quizData.sleepHours === 'Menos de 5' || quizData.sleepHours === '5-7') {
      recs.push('🛏️ Aumente gradualmente seu tempo de sono para 7-9 horas por noite')
    }

    if (quizData.electronicsUsage === 'Sim, frequentemente' || quizData.electronicsUsage === 'Às vezes') {
      recs.push('📱 Desligue eletrônicos 1 hora antes de dormir para melhorar a qualidade do sono')
    }

    if (quizData.caffeineEvening === 'Sim, regularmente' || quizData.caffeineEvening === 'Às vezes') {
      recs.push('☕ Evite cafeína após 16h para não prejudicar seu sono')
    }

    if (quizData.dietQuality === 'Pouco saudável' || quizData.dietQuality === 'Não me preocupo com isso') {
      recs.push('🥗 Melhore sua alimentação com refeições leves à noite e evite alimentos pesados')
    }

    if (quizData.physicalActivity === 'Raramente' || quizData.physicalActivity === 'Nunca') {
      recs.push('🏃 Pratique exercícios físicos regulares, preferencialmente pela manhã')
    }

    if (quizData.sleepImpediment === 'Estresse') {
      recs.push('🧘 Pratique técnicas de relaxamento como meditação e respiração profunda')
    }

    if (quizData.nightRoutine === 'Ver TV ou usar celular' || quizData.nightRoutine === 'Trabalhar ou estudar') {
      recs.push('📖 Crie uma rotina noturna relaxante com leitura ou alongamentos')
    }

    recs.push('🌡️ Mantenha seu quarto entre 18-22°C para um sono ideal')
    recs.push('🌙 Crie um ambiente escuro e silencioso no seu quarto')
    recs.push('⏰ Mantenha horários regulares para dormir e acordar')

    setRecommendations(recs)
  }

  const saveQuizResults = async () => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from('quiz_responses')
        .insert({
          session_id: sessionId,
          age_range: quizData.ageRange,
          sleep_difficulty: quizData.sleepDifficulty,
          feeling_rested: quizData.feelingRested,
          sleep_hours: quizData.sleepHours,
          electronics_usage: quizData.electronicsUsage,
          diet_quality: quizData.dietQuality,
          caffeine_evening: quizData.caffeineEvening,
          physical_activity: quizData.physicalActivity,
          sleep_impediment: quizData.sleepImpediment,
          night_routine: quizData.nightRoutine,
          email: quizData.email || null,
          wants_email_tips: quizData.wantsEmailTips
        })

      if (error) throw error

      generateRecommendations()
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      nextStep()
    } catch (error: any) {
      console.error('Erro ao salvar quiz:', error)
      alert('Erro ao salvar respostas. Continuando...')
      generateRecommendations()
      nextStep()
    } finally {
      setLoading(false)
    }
  }

  const finishQuiz = () => {
    localStorage.removeItem('quizProgress')
    router.push('/login')
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center space-y-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#FFDC00] to-[#e6c200] rounded-full flex items-center justify-center shadow-2xl">
              <Moon className="w-16 h-16 text-[#001F3F]" />
            </div>
            <h1 className="text-5xl font-inter font-bold text-[#FFDC00] leading-tight">Descubra o Sono Perfeito</h1>
            <p className="text-xl text-white font-inter max-w-2xl mx-auto">Responda algumas perguntas e receba dicas personalizadas.</p>
            <button
              onClick={nextStep}
              className="px-10 py-5 bg-[#FFDC00] text-[#001F3F] font-inter font-semibold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg"
            >
              Começar o Quiz
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )

      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Qual sua faixa etária?</h2>
            <div className="grid gap-4">
              {['Menos de 18', '18-30', '31-50', 'Acima de 50'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('ageRange', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.ageRange === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Você tem alguma dificuldade para dormir?</h2>
            <div className="grid gap-4">
              {['Sim, frequentemente', 'Às vezes', 'Raramente', 'Nunca'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('sleepDifficulty', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.sleepDifficulty === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Com que frequência você se sente descansado ao acordar?</h2>
            <div className="grid gap-4">
              {['Sempre', 'Muitas vezes', 'Às vezes', 'Raramente'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('feelingRested', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.feelingRested === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-8">
            <Sparkles className="w-20 h-20 mx-auto text-[#FFDC00]" />
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00] leading-tight">A qualidade do seu sono pode estar diretamente ligada aos seus hábitos diários.</h2>
            <p className="text-xl text-white font-inter">Vamos descobrir mais!</p>
            <button
              onClick={nextStep}
              className="px-10 py-5 bg-[#FFDC00] text-[#001F3F] font-inter font-semibold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Quantas horas você geralmente dorme por noite?</h2>
            <div className="grid gap-4">
              {['Menos de 5', '5-7', '7-9', 'Mais de 9'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('sleepHours', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.sleepHours === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Você costuma usar eletrônicos antes de dormir?</h2>
            <div className="grid gap-4">
              {['Sim, frequentemente', 'Às vezes', 'Raramente', 'Nunca'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('electronicsUsage', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.electronicsUsage === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Como você classificaria sua alimentação ao longo do dia?</h2>
            <div className="grid gap-4">
              {['Muito saudável', 'Moderadamente saudável', 'Pouco saudável', 'Não me preocupo com isso'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('dietQuality', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.dietQuality === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Você costuma beber café ou bebidas com cafeína à noite?</h2>
            <div className="grid gap-4">
              {['Sim, regularmente', 'Às vezes', 'Raramente', 'Nunca'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('caffeineEvening', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.caffeineEvening === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Você pratica atividades físicas regularmente?</h2>
            <div className="grid gap-4">
              {['Sim, diariamente', 'Algumas vezes por semana', 'Raramente', 'Nunca'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('physicalActivity', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.physicalActivity === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 10:
        return (
          <div className="text-center space-y-8">
            <Sparkles className="w-20 h-20 mx-auto text-[#FFDC00]" />
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00] leading-tight">Nossos hábitos diários têm um grande impacto no sono.</h2>
            <p className="text-xl text-white font-inter">Entender isso é o primeiro passo para melhorar!</p>
            <button
              onClick={nextStep}
              className="px-10 py-5 bg-[#FFDC00] text-[#001F3F] font-inter font-semibold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )

      case 11:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">O que mais te impede de ter uma boa noite de sono?</h2>
            <div className="grid gap-4">
              {['Estresse', 'Má alimentação', 'Rotina irregular', 'Outros'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('sleepImpediment', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.sleepImpediment === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 12:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Qual é a sua rotina noturna usual?</h2>
            <div className="grid gap-4">
              {['Relaxamento e leitura', 'Ver TV ou usar celular', 'Trabalhar ou estudar', 'Outras atividades'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer('nightRoutine', option)
                    nextStep()
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left font-inter text-lg transform hover:scale-102 hover:shadow-xl ${
                    quizData.nightRoutine === option
                      ? 'bg-[#FFDC00] text-[#001F3F] border-[#FFDC00] shadow-lg'
                      : 'bg-[#002A54] text-white border-[#FFDC00]/30 hover:border-[#FFDC00]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 13:
        return (
          <div className="text-center space-y-8">
            <CheckCircle className="w-20 h-20 mx-auto text-[#FFDC00]" />
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00] leading-tight">Milhares de usuários já melhoraram seu sono usando nossas dicas!</h2>
            <p className="text-xl text-white font-inter">Você está no caminho certo!</p>
            <button
              onClick={nextStep}
              className="px-10 py-5 bg-[#FFDC00] text-[#001F3F] font-inter font-semibold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )

      case 14:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Antes de mostrar suas recomendações personalizadas...</h2>
            <p className="text-xl text-white font-inter">Você gostaria de se cadastrar para receber dicas por e-mail?</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-[#002A54] rounded-lg shadow-md border border-[#FFDC00]/20">
                <input
                  type="checkbox"
                  id="emailTips"
                  checked={quizData.wantsEmailTips}
                  onChange={(e) => handleAnswer('wantsEmailTips', e.target.checked)}
                  className="w-6 h-6 rounded accent-[#FFDC00]"
                />
                <label htmlFor="emailTips" className="text-white font-inter cursor-pointer">
                  Sim, gostaria de receber e-mails com dicas personalizadas
                </label>
              </div>

              {quizData.wantsEmailTips && (
                <input
                  type="email"
                  value={quizData.email}
                  onChange={(e) => handleAnswer('email', e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-6 py-4 rounded-lg bg-[#002A54] border-2 border-[#FFDC00] text-white placeholder-gray-400 focus:outline-none focus:border-[#e6c200] font-inter shadow-md"
                />
              )}

              <button
                onClick={() => {
                  saveQuizResults()
                }}
                className="w-full py-5 bg-[#FFDC00] text-[#001F3F] font-inter font-semibold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Ver Minhas Recomendações
              </button>
            </div>
          </div>
        )

      case 15:
        return (
          <div className="text-center space-y-8">
            <Loader2 className="w-20 h-20 mx-auto text-[#FFDC00] animate-spin" />
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Estamos analisando suas respostas...</h2>
            <p className="text-xl text-white font-inter">Isso levará apenas alguns segundos!</p>
          </div>
        )

      case 16:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00]">Aqui estão suas recomendações personalizadas!</h2>
            <p className="text-white font-inter text-lg">Baseado nas suas respostas, preparamos dicas específicas para você:</p>
            
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-6 bg-[#002A54] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 border border-[#FFDC00]/20">
                  <p className="text-white font-inter">{rec}</p>
                </div>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full py-5 bg-[#FFDC00] text-[#001F3F] font-inter font-semibold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-3 shadow-lg"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )

      case 17:
        return (
          <div className="text-center space-y-8">
            <Sparkles className="w-20 h-20 mx-auto text-[#FFDC00]" />
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00] leading-tight">Incorporar essas sugestões pode melhorar sua qualidade de sono e bem-estar geral!</h2>
            <p className="text-xl text-white font-inter">Pequenas mudanças fazem grande diferença.</p>
            <button
              onClick={nextStep}
              className="px-10 py-5 bg-[#FFDC00] text-[#001F3F] font-inter font-semibold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )

      case 18:
        return (
          <div className="text-center space-y-8">
            <div className="text-8xl font-inter font-bold text-[#FFDC00]">95%</div>
            <h2 className="text-4xl font-inter font-medium text-[#FFDC00] leading-tight">dos nossos usuários relataram uma melhora significativa na qualidade do sono</h2>
            <p className="text-xl text-white font-inter">após seguir nossas dicas personalizadas!</p>
            <button
              onClick={nextStep}
              className="px-10 py-5 bg-[#FFDC00] text-[#001F3F] font-inter font-semibold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )

      case 19:
        return (
          <div className="text-center space-y-8">
            <Moon className="w-24 h-24 mx-auto text-[#FFDC00]" />
            <h2 className="text-5xl font-inter font-bold text-[#FFDC00] leading-tight">Pronto para transformar suas noites em um momento de relaxamento?</h2>
            <p className="text-xl text-white font-inter max-w-2xl mx-auto">Crie sua conta agora para acessar conteúdo exclusivo e começar sua jornada para um sono perfeito!</p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="p-5 bg-[#002A54] rounded-lg text-left shadow-lg border border-[#FFDC00]/20">
                <p className="text-white font-inter">✅ Rotina de sono personalizada</p>
              </div>
              <div className="p-5 bg-[#002A54] rounded-lg text-left shadow-lg border border-[#FFDC00]/20">
                <p className="text-white font-inter">✅ Diário de sono completo</p>
              </div>
              <div className="p-5 bg-[#002A54] rounded-lg text-left shadow-lg border border-[#FFDC00]/20">
                <p className="text-white font-inter">✅ Dicas de alimentação e atividades</p>
              </div>
              <div className="p-5 bg-[#002A54] rounded-lg text-left shadow-lg border border-[#FFDC00]/20">
                <p className="text-white font-inter">✅ Comunidade de apoio</p>
              </div>
            </div>

            <button
              onClick={finishQuiz}
              className="px-12 py-6 bg-[#FFDC00] text-[#001F3F] font-inter font-bold text-xl rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg"
            >
              Criar conta e começar
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#001F3F] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        {step > 0 && step < 19 && (
          <div className="mb-8">
            <div className="h-3 bg-[#002A54] rounded-full overflow-hidden shadow-md">
              <div
                className="h-full bg-gradient-to-r from-[#FFDC00] to-[#e6c200] transition-all duration-500"
                style={{ width: `${(step / 19) * 100}%` }}
              />
            </div>
            <p className="text-white text-center mt-3 font-inter font-medium">
              Etapa {step} de 19
            </p>
          </div>
        )}

        {/* Content Card */}
        <div className="bg-[#002A54] rounded-lg p-8 sm:p-10 md:p-12 shadow-lg border border-[#FFDC00]/20">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {step > 0 && step < 14 && step !== 4 && step !== 10 && step !== 13 && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-[#002A54] hover:bg-[#003A6F] text-white font-inter font-medium rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md border border-[#FFDC00]/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
