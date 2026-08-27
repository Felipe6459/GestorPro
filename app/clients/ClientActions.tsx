'use client';
import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
export default function ClientActions({id,onDone}:{id:string;onDone:()=>void}){const [busy,setBusy]=useState(false);async function remove(){if(!confirm('Excluir este cliente?'))return;setBusy(true);const s=createClient();const res=await fetch(`/api/clients/${id}`,{method:'DELETE'});if(res.ok)onDone();else alert((await res.json()).error||'Erro ao excluir');setBusy(false)}return <button disabled={busy} onClick={remove} style={{background:'transparent',border:'1px solid #7f1d1d',color:'#fca5a5',borderRadius:7,padding:'6px 9px'}}>{busy?'...':'Excluir'}</button>}
