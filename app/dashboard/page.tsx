'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Dashboard(){
 const router=useRouter(); const [email,setEmail]=useState(''); const [clients,setClients]=useState(0); const [active,setActive]=useState(0); const [expired,setExpired]=useState(0); const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace('/login');return}setEmail(user.email??'');const {data:members}=await supabase.from('organization_members').select('organization_id').eq('user_id',user.id).limit(1);const org=members?.[0]?.organization_id;if(org){const {data}=await supabase.from('clients').select('status').eq('organization_id',org);const rows=data??[];setClients(rows.length);setActive(rows.filter(x=>x.status==='active').length);setExpired(rows.filter(x=>x.status==='expired').length)}setLoading(false)})()},[router]);
 async function logout(){await createClient().auth.signOut();router.replace('/login')}
 if(loading)return <main className="loading">Carregando GestorPro...</main>;
 return <main className="dashboard"><header><div className="brand"><span>GP</span><div><strong>GestorPro</strong><small>2.0</small></div></div><div className="user">{email}<button onClick={logout}>Sair</button></div></header><section className="hero"><div><p className="eyebrow">PAINEL DE GESTÃO</p><h1>Olá, seja bem-vindo 👋</h1><p>Gerencie seus clientes e acompanhe suas assinaturas.</p></div></section><section className="stats"><article><small>Total de clientes</small><strong>{clients}</strong></article><article><small>Clientes ativos</small><strong>{active}</strong></article><article><small>Vencidos</small><strong>{expired}</strong></article><article><small>Receita</small><strong>R$ 0,00</strong></article></section><section className="empty"><h2>Seu painel está pronto</h2><p>O próximo módulo será o cadastro e gerenciamento completo de clientes.</p></section></main>
}
