'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Moon, Mail, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: ''
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) throw error

      router.push('/')
    } catch (error: any) {
      alert('Erro ao fazer login: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: dbError } = await supabase
          .from('usuarios')
          .insert({
            id: authData.user.id,
            email: formData.email,
            nome: formData.nome
          })

        if (dbError) throw dbError

        alert('✅ Cadastro realizado com sucesso! Faça login para continuar.')
        setIsLogin(true)
        setFormData({ email: '', password: '', nome: '' })
      }
    } catch (error: any) {
      alert('Erro ao cadastrar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#001F3F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FFDC00] to-[#e6c200] rounded-full flex items-center justify-center shadow-lg">
              <Moon className="w-12 h-12 text-[#001F3F]" />
            </div>
          </div>
          <h1 className="text-5xl font-inter font-bold text-[#FFDC00] mb-3">Sono Perfeito</h1>
          <p className="text-white font-inter text-lg">Melhore sua qualidade de sono</p>
        </div>

        {/* Card de Login/Cadastro */}
        <div className="bg-[#002A54] rounded-lg p-8 shadow-md border border-[#FFDC00]/20">
          {/* Toggle Login/Cadastro */}
          <div className="flex gap-2 mb-8 bg-[#001F3F] rounded-lg p-1.5 shadow-sm">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg transition-all duration-300 font-inter font-medium ${
                isLogin
                  ? 'bg-[#FFDC00] text-[#001F3F] shadow-md'
                  : 'text-white hover:bg-[#003A6F]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg transition-all duration-300 font-inter font-medium ${
                !isLogin
                  ? 'bg-[#FFDC00] text-[#001F3F] shadow-md'
                  : 'text-white hover:bg-[#003A6F]'
              }`}
            >
              Cadastro
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-white mb-2 font-inter font-medium">Nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFDC00]" />
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#001F3F] border-2 border-[#FFDC00] text-white placeholder-gray-400 focus:outline-none focus:border-[#e6c200] font-inter transition-all duration-300"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white mb-2 font-inter font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFDC00]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#001F3F] border-2 border-[#FFDC00] text-white placeholder-gray-400 focus:outline-none focus:border-[#e6c200] font-inter transition-all duration-300"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-inter font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFDC00]" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#001F3F] border-2 border-[#FFDC00] text-white placeholder-gray-400 focus:outline-none focus:border-[#e6c200] font-inter transition-all duration-300"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-gray-300 text-sm mt-2 font-inter">Mínimo de 6 caracteres</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFDC00] text-[#001F3F] font-inter font-bold text-lg rounded-lg hover:bg-[#e6c200] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          {/* Informações Adicionais */}
          <div className="mt-6 text-center">
            <p className="text-white text-sm font-inter">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#FFDC00] font-medium hover:underline"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>

          {/* Link para Quiz */}
          <div className="mt-4 text-center">
            <p className="text-white text-sm font-inter">
              Ainda não fez o quiz?{' '}
              <button
                onClick={() => router.push('/quiz')}
                className="text-[#FFDC00] font-medium hover:underline"
              >
                Começar agora
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white text-sm font-inter">
          <p>🌙 Transforme suas noites com o Sono Perfeito</p>
        </div>
      </div>
    </div>
  )
}
