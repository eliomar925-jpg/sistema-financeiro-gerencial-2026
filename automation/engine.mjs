import fs from 'node:fs';import path from 'node:path';import XLSX from 'xlsx';
const cfg=JSON.parse(fs.readFileSync(new URL('./config.json',import.meta.url),'utf8'));
const root=process.argv[2]||cfg.root,out=process.argv[3]||path.join(root,cfg.folders.controle,'painel-2026.json');
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
const num=v=>typeof v==='number'?v:Number(String(v??0).replace(/\./g,'').replace(',','.'))||0;
const date=v=>{if(v instanceof Date)return v; if(typeof v==='number'){const d=XLSX.SSF.parse_date_code(v);return d?new Date(d.y,d.m-1,d.d):null} const m=String(v??'').match(/(\d{2})\/(\d{2})\/(\d{4})/);return m?new Date(+m[3],+m[2]-1,+m[1]):null};
const files=[];function walk(d){if(!fs.existsSync(d))return;for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==='00_ENTRADA')throw Error('Pasta proibida encontrada: '+path.join(d,e.name));const p=path.join(d,e.name);e.isDirectory()?walk(p):/\.xlsx?$/i.test(e.name)&&files.push(p)}}walk(path.join(root,cfg.folders.year));
const rows=[];for(const file of files){const wb=XLSX.readFile(file,{cellDates:true});for(const sn of wb.SheetNames){const a=XLSX.utils.sheet_to_json(wb.Sheets[sn],{defval:null});for(const r of a)rows.push({...r,__arquivo:path.relative(root,file),__aba:sn})}}
const nature=r=>norm(r.NATUREZA_GERENCIAL||r['Classificação']||r.NATUREZA||r['TIPO DE OPERAÇÃO']);
const value=r=>num(r.VALPAGAMENTO??r.VALLIQUIDO??r.Valor??r.VALOR??r['VALOR ASSINADO']);
const typ=r=>norm(r.TIPO||r.Tipo);
const isFin=r=>['MUTUO','APORTE','TRANSFERENCIA','RESULTADO FINANCEIRO','DESPESA FINANCEIRA','DEVOLUCAO/ESTORNO'].some(x=>nature(r).includes(x));
const isOp=r=>!isFin(r)&&(norm(r.OPERACIONALIDADE||r['Classificação'])==='OPERACIONAL'||norm(r.INCLUIR_RESULTADO)==='SIM');
const company=r=>norm(r.Empresa||r.CODEMPRESA||r.RAZAOSOCIAL);
const front=r=>String(r.FRENTE_GERENCIAL||r.Unidade||r.CONTARESULTADO||'Não classificado');
const dre={};for(const r of rows){if(!isOp(r))continue;const k=front(r);dre[k]??={receita:0,despesa:0};const v=Math.abs(value(r));if(typ(r).startsWith('R')||norm(r.Tipo)==='RECEBIMENTO')dre[k].receita+=v;else if(typ(r).startsWith('P')||norm(r.Tipo)==='PAGAMENTO')dre[k].despesa+=v}
const inter=rows.filter(r=>nature(r).includes('MUTUO')&&cfg.rules.intercompany.some(x=>norm(r.RAZAOSOCIAL).includes(norm(x)))).map(r=>({data:date(r.DATQUITACAO),valor:Math.abs(value(r)),tipo:typ(r),arquivo:r.__arquivo}));
const ins=inter.filter(x=>x.tipo.startsWith('R')),outs=inter.filter(x=>x.tipo.startsWith('P')),used=new Set(),pairs=[];for(const a of ins){let best=-1,bd=1e99;for(let i=0;i<outs.length;i++){if(used.has(i)||Math.abs(outs[i].valor-a.valor)>.009)continue;const d=a.data&&outs[i].data?Math.abs(a.data-outs[i].data):0;if(d<bd){bd=d;best=i}}if(best>=0){used.add(best);pairs.push([a,outs[best]])}}
const pendingOut=outs.filter((_,i)=>!used.has(i));
const result={generatedAt:new Date().toISOString(),source:{root,files:files.length,rows:rows.length},dre,intercompany:{entradas:ins.length,saidas:outs.length,pareados:pairs.length,valorPareado:pairs.reduce((s,p)=>s+p[0].valor,0),excecoesSaida:pendingOut,valorExcecoes:pendingOut.reduce((s,x)=>s+x.valor,0)},rulesVersion:cfg.version};
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2));console.log('Gerado:',out);console.log(JSON.stringify(result.intercompany,null,2));