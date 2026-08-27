'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        throw new Error('Configuração do Supabase não encontrada na implantação da Vercel.');
      }

      const response = await fetch(`${url.replace(/\\/$/, '')}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          data: { name: name.trim() },
        }),
        signal: controller.signal,
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(result?.msg || result?.message || result?.error_description || `Supabase recusou o cadastro (HTTP ${response.status}).`);
      }

      if (result?.access_token && result?.refresh_token) {
        const supabase = createClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.access_token,
          refresh_token: result.refresh_token,
        });
        if (sessionError) throw sessionError;
        router.push('/dashboard');
        return;
      }

      setError('Conta criada. Verifique seu e-mail para continuar.');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('O Supabase não respondeu em 10 segundos. Verifique as variáveis do Supabase na Vercel.');
      } else {
        setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form onSubmit={submit} className="auth-card">
        <div className="brand"><span>GP</span><div><strong>GestorPro</strong><small>2.0</small></div></div>
        <h1>Criar conta</h1>
        <p>Comece seu ambiente de gestão.</p>
        <label>Nome<input required value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" /></label>
        <label>E-mail<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" /></label>
        <label>Senha<input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" /></label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
        <a href="/login">Já tenho uma conta</a>
      </form>
    </main>
  );
}
