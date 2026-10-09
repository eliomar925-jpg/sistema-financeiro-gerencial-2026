/* Extratos PDF textuais Bradesco. Sem OCR silencioso e sem conciliação automática. */
(function(){
"use strict";
const amountRE=/^-?\d{1,3}(?:\.\d{3})*,\d{2}$/;
const dateRE=/^\d{2}\/\d{2}\/20\d{2}$/;
function brValue(s){return Number(s.replace(/\./g,"").replace(",", "."))}
function normalize(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim()}
function iso(s){const a=s.split("/");return a[2]+"-"+a[1]+"-"+a[0]}
function textItems(pageContent){
 return pageContent.items.filter(i=>i.str&&i.str.trim()).map(i=>({t:i.str.trim(),x:i.transform[4],y:-i.transform[5]})).sort((a,b)=>a.y-b.y||a.x-b.x);
}
function nearby(items,y,min,max){return items.filter(x=>x.x>=85&&x.x<249&&x.y-y>=min&&x.y-y<=max).map(x=>x.t).join(" ").trim()}
async function parseBankPdf(file){
 if(!window.pdfjsLib)throw Error("Biblioteca de leitura PDF indisponível. Recarregue a página e tente novamente.");
 pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
 const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
 const metadata=await pdf.getMetadata().catch(()=>null);
 let agencia="",conta="",empresa="",date="",rows=[],sawBradesco=/BRADESCO/i.test(metadata?.info?.Title||""),sawStatement=false;
 for(let pageNo=1;pageNo<=pdf.numPages;pageNo++){
  const page=await pdf.getPage(pageNo),items=textItems(await page.getTextContent());
  const allHeader=items.slice(0,100).map(x=>x.t).join(" ");
  if(items.some(x=>/BRADESCO/i.test(x.t)))sawBradesco=true;
  if(/EXTRATO\s+(MENSAL|DE:|POR PER[IÍ]ODO)/i.test(allHeader))sawStatement=true;
  const accountText=items.filter(x=>x.y< -600).map(x=>x.t).join(" ");
  const match=(allHeader+" "+accountText).match(/Extrato de:\s*Ag:\s*(\d+)\s*\|\s*CC:\s*([\d-]+)/i);
  if(match){agencia=match[1];conta=match[2]}
  const co=(allHeader+" "+accountText).match(/(SALVADOR PRODU[ÇC][OÕ]ES[^|]{0,90}|SOF[AÁ] DA SOGRA[^|]{0,90})\s*\|\s*CNPJ/i);
  if(co)empresa=co[1].trim();
  const dates=items.filter(x=>x.x>=15&&x.x<85&&dateRE.test(x.t));
  const candidates=items.filter(x=>x.x>315&&x.x<490&&amountRE.test(x.t));
  for(const amount of candidates){
   for(const d of dates){if(d.y<=amount.y+1.6)date=iso(d.t)}
   if(!date)continue;
   const sameLine=items.filter(x=>Math.abs(x.y-amount.y)<2);
   if(sameLine.some(x=>x.x<220&&/\bTOTAL\b/i.test(x.t)))continue;
   const docParts=sameLine.filter(x=>x.x>=245&&x.x<315&&/^\d{3,}$/.test(x.t));
   if(!docParts.length)continue;
   const doc=docParts.map(x=>x.t).join(" ");
   const title=nearby(items,amount.y,-6.8,1.2);
   const benef=nearby(items,amount.y,1.3,6.8);
   if(!title||/^(SALDO|TOTAL|DATA|HIST[OÓ]RICO)/i.test(title))continue;
   const raw=brValue(amount.t),value=raw<0?raw:(amount.x>=405?-raw:raw);
   if(!Number.isFinite(value)||!value)continue;
   rows.push({
    id:"pdf-"+pageNo+"-"+rows.length+"-"+Math.random().toString(36).slice(2,8),
    file:file.name,empresa,agencia,conta,date,
    lanc:title,razao:benef.replace(/^(DES|REM|DEST|REMET)\s*:\s*/i,"").trim(),
    doc,value,matchedDoc:null,sourceFormat:"PDF",pdfPage:pageNo,
    pdfReview:true
   });
  }
 }
 if(!sawBradesco||!sawStatement)throw Error("Este PDF não é um extrato Bradesco textual reconhecido. Nenhum lançamento foi importado; use XLSX ou envie o modelo para adaptação.");
 if(!agencia||!conta)throw Error("Não foi possível identificar agência e conta no PDF. Importação cancelada para evitar conciliação incorreta.");
 if(!rows.length)throw Error("Nenhum lançamento reconhecido. Se o PDF for digitalizado/imagem, será necessário OCR e revisão antes da importação.");
 return rows;
}
window.parseBankPdf=parseBankPdf;
})();