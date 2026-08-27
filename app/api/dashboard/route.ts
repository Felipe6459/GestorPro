import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(){
 const s=await createClient();
 const {data:{user}}=await s.auth.getUser();
 if(!user)return NextResponse.json({error:'Não autenticado'},{status:401});
 const {data:m}=await s.from('organization_members').select('organization_id').eq('user_id',user.id).limit(1);
 const org=m?.[0]?.organization_id;
 if(!org)return NextResponse.json({clients:0,active:0,expiring:0,expired:0,revenue:0});
 const {data,error}=await s.from('clients').select('status,amount,due_date').eq('organization_id',org);
 if(error)return NextResponse.json({error:error.message},{status:500});
 const today=new Date();today.setHours(0,0,0,0);const in7=new Date(today);in7.setDate(in7.getDate()+7);
 const rows=data??[];
 const dated=rows.filter(x=>x.due_date).map(x=>({...x,d:new Date(`${x.due_date}T00:00:00`)}));
 return NextResponse.json({clients:rows.length,active:rows.filter(x=>x.status==='active').length,expired:rows.filter(x=>x.status==='expired'||(x.d&&x.d<today)).length,expiring:dated.filter(x=>x.d>=today&&x.d<=in7).length,revenue:rows.reduce((n,x)=>n+Number(x.amount||0),0)});
}
