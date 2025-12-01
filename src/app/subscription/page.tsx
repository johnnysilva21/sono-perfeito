'use client'

import { useState, useEffect } from 'react'
import { Moon, Check, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Plan = 'freemium' | 'mensal' | 'trimestral' | 'semestral' | 'anual'

export default function SubscriptionPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

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
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (plan: Plan) => {
    setSelectedPlan(plan)
    
    if (plan === 'freemium') {
      alert('✅ Você já tem acesso ao plano gratuito!')
      router.push('/')
      return
    }

    // Aqui você integraria com um sistema de pagamento real
    alert(`🎉 Plano ${plan} selecionado! Em breve você será redirecionado para o pagamento.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001F3F] flex items-center justify-center">
        <div className="text-[#FFDC00] text-2xl font-inter font-medium">Carregando...</div>
      </div>
    )
  }

  const plans = [
    {
      id: 'freemium' as Plan,
      name: 'Freemium',
      price: 'Grátis',
      description: 'Acesso básico e funcionalidade limitada',
      features: [
        'Rotina básica de sono',
        'Diário simples',
        'Dicas gerais',
        'Suporte por email'
      ],
      color: 'from-[#FFDC00] to-[#e6c200]',
      borderColor: 'border-[#FFDC00]',
      buttonColor: 'bg-[#FFDC00] hover:bg-[#e6c200] text-[#001F3F]',
      popular: false
    },
    {
      id: 'mensal' as Plan,
      name: 'Mensal',
      price: 'R$ 15,90',
      period: '/mês',
      description: 'Acesso total a todos os recursos e relatórios',
      features: [
        'Todas as funcionalidades',
        'Relatórios detalhados',
        'Análise de padrões',
        'Suporte prioritário',
        'Sem anúncios'
      ],
      color: 'from-[#FFDC00] to-[#e6c200]',
      borderColor: 'border-[#FFDC00]',
      buttonColor: 'bg-[#FFDC00] hover:bg-[#e6c200] text-[#001F3F]',
      popular: false
    },
    {
      id: 'trimestral' as Plan,
      name: 'Trimestral',
      price: 'R$ 41,90',
      period: '/3 meses',
      description: 'Economize em comparação ao plano mensal',
      features: [
        'Todas as funcionalidades',
        'Relatórios detalhados',
        'Análise de padrões',
        'Suporte prioritário',
        'Sem anúncios',
        '💰 Economize 12%'
      ],
      color: 'from-[#FFDC00] to-[#e6c200]',
      borderColor: 'border-[#FFDC00]',
      buttonColor: 'bg-[#FFDC00] hover:bg-[#e6c200] text-[#001F3F]',
      popular: true
    },
    {
      id: 'semestral' as Plan,
      name: 'Semestral',
      price: 'R$ 85,90',
      period: '/6 meses',
      description: 'Melhor valor com desconto em comparação ao plano trimestral',
      features: [
        'Todas as funcionalidades',
        'Relatórios detalhados',
        'Análise de padrões',
        'Suporte prioritário',
        'Sem anúncios',
        '💰 Economize 10%'
      ],
      color: 'from-[#FFDC00] to-[#e6c200]',
      borderColor: 'border-[#FFDC00]',
      buttonColor: 'bg-[#FFDC00] hover:bg-[#e6c200] text-[#001F3F]',
      popular: false
    },
    {
      id: 'anual' as Plan,
      name: 'Anual',
      price: 'R$ 139,90',
      period: '/ano',
      description: 'O melhor valor com desconto em comparação ao plano semestral',
      features: [
        'Todas as funcionalidades',
        'Relatórios detalhados',
        'Análise de padrões',
        'Suporte VIP 24/7',
        'Sem anúncios',
        '💰 Economize 27%',
        '🎁 Bônus exclusivos'
      ],
      color: 'from-[#FFDC00] to-[#e6c200]',
      borderColor: 'border-[#FFDC00]',
      buttonColor: 'bg-[#FFDC00] hover:bg-[#e6c200] text-[#001F3F]',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-[#001F3F] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFDC00] to-[#e6c200] rounded-full flex items-center justify-center shadow-lg">
              <Moon className="w-10 h-10 text-[#001F3F]" />
            </div>
          </div>
          <h1 className="text-5xl font-inter font-bold text-[#FFDC00] mb-4">Escolha sua Assinatura</h1>
          <p className="text-xl text-white font-inter max-w-2xl mx-auto">
            Aproveite as funcionalidades do nosso app para melhorar a qualidade do seu sono!
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[#002A54] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative border-2 ${
                plan.popular ? plan.borderColor : 'border-[#FFDC00]/30'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className={`bg-gradient-to-r ${plan.color} text-[#001F3F] px-6 py-2 rounded-full shadow-md flex items-center gap-2 font-inter font-bold`}>
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 mt-4">
                <h2 className="text-2xl font-inter font-bold mb-2 text-[#FFDC00]">
                  {plan.name}
                </h2>
                <div className="mb-3">
                  <span className="text-4xl font-inter font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-300 font-inter ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-300 font-inter text-sm">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#FFDC00] flex-shrink-0 mt-0.5" />
                    <span className="text-white font-inter text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-4 ${plan.buttonColor} font-inter font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md`}
              >
                {plan.id === 'freemium' ? 'Começar Grátis' : `Assinar ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-[#002A54] rounded-2xl p-8 shadow-md text-center border border-[#FFDC00]/20">
          <h3 className="text-2xl font-inter font-bold text-[#FFDC00] mb-4">
            🌙 Garantia de 30 dias
          </h3>
          <p className="text-white font-inter mb-6 max-w-2xl mx-auto">
            Experimente qualquer plano premium sem riscos. Se não ficar satisfeito, devolvemos seu dinheiro em até 30 dias.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-[#003A6F] hover:bg-[#004A8F] text-white font-inter font-medium rounded-lg transition-all duration-300"
          >
            Voltar para o App
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-[#002A54] rounded-xl p-6 shadow-md border border-[#FFDC00]/20">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="font-inter font-bold text-[#FFDC00] mb-2">Pagamento Seguro</h4>
            <p className="text-white font-inter text-sm">Criptografia de ponta a ponta</p>
          </div>
          <div className="bg-[#002A54] rounded-xl p-6 shadow-md border border-[#FFDC00]/20">
            <div className="text-4xl mb-3">⭐</div>
            <h4 className="font-inter font-bold text-[#FFDC00] mb-2">95% de Satisfação</h4>
            <p className="text-white font-inter text-sm">Milhares de usuários satisfeitos</p>
          </div>
          <div className="bg-[#002A54] rounded-xl p-6 shadow-md border border-[#FFDC00]/20">
            <div className="text-4xl mb-3">💬</div>
            <h4 className="font-inter font-bold text-[#FFDC00] mb-2">Suporte Dedicado</h4>
            <p className="text-white font-inter text-sm">Estamos aqui para ajudar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
