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
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const signup = supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('O cadastro demorou mais que o esperado. Verifique a conexão com o Supabase e tente novamente.')), 15000)
      );

      const { data, error } = await Promise.race([signup, timeout]);

      if (error) {
        setError(error.message);
      } else if (data.session) {
        router.push('/dashboard');
        return;
      } else {
        setError('Conta criada. Verifique seu e-mail para continuar.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    } finally {
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
        <button disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
        <a href="/login">Já tenho uma conta</a>
      </form>
    </main>
  );
}
