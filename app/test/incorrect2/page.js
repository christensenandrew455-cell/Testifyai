"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Incorrect2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const question = decodeURIComponent(searchParams.get("question") || "No question provided");
  const userAnswer = decodeURIComponent(searchParams.get("userAnswer") || "—");
  const feedback = decodeURIComponent(searchParams.get("feedback") || "");

  const [canContinue,setCanContinue] = useState(false);
  useEffect(()=>{const t=setTimeout(()=>setCanContinue(true),2000);return()=>clearTimeout(t);},[]);

  const handleContinue=()=>{if(!canContinue)return;router.push("/test/controller");};

  return (
    <div onClick={handleContinue} style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",background:"linear-gradient(to right, #ff8a80, #e53935)",color:"white",fontFamily:"Segoe UI, Roboto, sans-serif",textAlign:"center",cursor:canContinue?"pointer":"default",padding:"20px"}}>
      <div style={{fontSize:72,marginBottom:8}}>❌</div>
      <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>Incorrect</h1>

      <div style={{maxWidth:760,textAlign:"center"}}>
        <p style={{fontWeight:700,margin:0}}>Question</p>
        <p style={{margin:"2px 0 4px 0"}}>{question}</p>

        <p style={{fontWeight:700,margin:"4px 0 2px 0"}}>Your answer</p>
        <p style={{margin:"2px 0 4px 0"}}>{userAnswer}</p>

        {feedback && <>
          <p style={{fontWeight:700,margin:"4px 0 2px 0"}}>Explanation</p>
          <p style={{margin:"2px 0 4px 0"}}>{feedback}</p>
        </>}
      </div>

      <small style={{marginTop:20}}>{canContinue?"Click anywhere to continue":"Please wait..."}</small>
    </div>
  );
}

export default function Incorrect2Page() {
  return <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center",fontFamily:"Segoe UI, Roboto, sans-serif",fontSize:"1.4rem",color:"#1976d2"}}>Loading result…</div>}><Incorrect2Content/></Suspense>;
}
