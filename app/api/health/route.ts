import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(){
  const checkedAt=new Date().toISOString();
  try{
    const supabase=await createClient();
    const {error}=await supabase.from('organizations').select('id').limit(1);
    if(error) return NextResponse.json({ok:false,database:'error',checkedAt},{status:503});
    return NextResponse.json({ok:true,database:'ok',checkedAt});
  }catch{return NextResponse.json({ok:false,database:'error',checkedAt},{status:503});}
}
