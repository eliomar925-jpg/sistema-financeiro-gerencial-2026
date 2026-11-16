const {readFileSync}=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const html=readFileSync('index.html','utf8');const script=html.split('<script>').pop().split('</script>')[0];
new vm.Script(script);
const fn=name=>{const start=script.indexOf('function '+name+'(');assert(start>=0,name);let pos=script.indexOf('{',start),depth=1,end=pos+1;for(;depth;end++){if(script[end]==='{')depth++;if(script[end]==='}')depth--;}return script.slice(start,end)};
const state={docs:[],banks:[{id:'bank',matchedDoc:'pay'}]};const ctx={state,Map,console,save(){},allGroups:()=>['REPRESENTAÇÃO DE BANDAS','EVENTOS','TIMBALADA'],norm:s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase(),inferDate:()=> '2026-10-06',inferGroup:()=> 'SEM GRUPO',putMedia:async(id,blob)=>ctx.restored={id,blob},readImageText:async()=>ctx.ocrText,getMedia:async(id)=>ctx.stored.get(id)||null,mediaFingerprint:async(blob)=>blob,stored:new Map(),uid:()=> 'new-'+(++ctx.sequence),sequence:0};vm.createContext(ctx);
for(const name of ['brNumber','parseOcr','detectSavedGroup','applyDetectedGroup','canonicalImportName','recoverImportedSource','identifyImport','importDocumentFile','paymentIdentityMatches','ocrMatchesPayments','readSourceOcr','matchScore','dateDiff','tokenOverlap'])vm.runInContext(fn(name).replace(/^function (recoverImportedSource|identifyImport|importDocumentFile|readSourceOcr)\b/,'async function $1'),ctx);
const text='REPRESENTAÇÃO | SALVADOR\nBANDAS\nFORNECEDOR DESCRICAO FORMA DATA VALOR\nTESTE EXEMPLO CACHÊ REPRESENTACAO - SETEMBRO.26 TRANSFERENCIA | 06/10/2026] R$ 25.000,00\nTOTAL R$ 25.000,00';
const items=ctx.parseOcr(text,{date:'2026-10-06'});assert.equal(items.length,1);assert.equal(items[0].value,25000);assert.equal(items[0].benef,'TESTE EXEMPLO');assert.equal(items[0].date,'2026-10-06');assert.equal(ctx.detectSavedGroup(text),'REPRESENTAÇÃO DE BANDAS');assert.equal(ctx.detectSavedGroup(text.replace('REPRESENTAÇÃO','REPRESENTACGAO')),'REPRESENTAÇÃO DE BANDAS');
(async()=>{
 const pay={id:'pay',sourceId:'source',name:'Pagamento 2026-10-06 at 09.52.14.jpeg',date:'2026-10-06',kind:'image',itemNo:1,value:25000,benef:'TESTE EXEMPLO',status:'CONCILIADO',bankId:'bank',group:'KART LOVE'};
 const other={id:'other',date:'2026-09-01',group:'LS',value:100};state.docs=[pay,other];ctx.ocrText=text;

 await ctx.recoverImportedSource(pay,'image','', 'batch');
 assert.equal(pay.group,'REPRESENTAÇÃO DE BANDAS');assert.equal(pay.status,'CONCILIADO');assert.equal(pay.bankId,'bank');assert.equal(pay.value,25000);assert.equal(pay.benef,'TESTE EXEMPLO');assert.equal(ctx.restored.id,'source');assert.equal(state.docs.length,2);assert.equal(other.group,'LS');assert.equal(state.banks[0].matchedDoc,'pay');
 const before=JSON.stringify(state);ctx.ocrText=text.replace('TESTE EXEMPLO','OUTRA PESSOA');ctx.restored=null;
 await assert.rejects(()=>ctx.recoverImportedSource(pay,'wrong-image','', 'batch'),/conteúdo/);assert.equal(ctx.restored,null);assert.equal(JSON.stringify(state),before);
 ctx.ocrText=text;pay.group='EVENTOS';pay.groupDetection='manual';await ctx.recoverImportedSource(pay,'image','', 'batch');assert.equal(pay.group,'EVENTOS');
 pay.date='2026-10-07';ctx.restored=null;await assert.rejects(()=>ctx.recoverImportedSource(pay,'image','', 'batch'),/conteúdo/);assert.equal(ctx.restored,null);
 assert.equal(ctx.matchScore({date:'2026-10-06',value:25000,benef:'TESTE EXEMPLO'},{date:'2026-10-06',value:-25000,razao:'TESTE EXEMPLO',lanc:'PIX'}),100);
 assert.equal(ctx.ocrMatchesPayments([{date:'2026-10-06',value:25000,benef:'TESTE EXEMPLO'}],[{date:'2026-10-06',value:25000,benef:'OUTRA PESSOA'}]),false);

 // Exact regression: same filename/date, different group and payment.
 const name='Pagamento 2026-10-06 at 09.52.14.jpeg';
 const kart={id:'kart',sourceId:'kart',name,date:'2026-10-06',kind:'image',itemNo:1,value:5000,benef:'OUTRO ARTISTA',group:'KART LOVE',status:'CONCILIADO',bankId:'bank-kart'};
 state.docs=[kart,other];ctx.ocrText=text;const kartBefore=JSON.stringify(kart),otherBefore=JSON.stringify(other);
 let result=await ctx.importDocumentFile(name,'2026-10-06','representacao-image','image','','new-batch');
 assert.equal(result.existing,false);assert.equal(state.docs.length,3);assert.equal(result.doc.group,'REPRESENTAÇÃO DE BANDAS');assert.equal(JSON.stringify(kart),kartBefore);assert.equal(JSON.stringify(other),otherBefore);assert.equal(result.doc.status,'PENDENTE');assert.equal(result.doc.bankId,null);
 // Materialize the parsed payment as the UI does, then reimport.
 Object.assign(result.doc,{itemNo:1,value:25000,benef:'TESTE EXEMPLO',ocrDone:true});
 const rep=result.doc;result=await ctx.importDocumentFile(name,'2026-10-06','representacao-image','image','','retry');assert.equal(result.existing,true);assert.equal(result.doc,rep);assert.equal(state.docs.length,3);assert.equal(JSON.stringify(kart),kartBefore);
 // Renaming must not duplicate an existing payment.
 result=await ctx.importDocumentFile('Outro nome 2026-10-06.jpeg','2026-10-06','renamed-image','image','','renamed');assert.equal(result.existing,true);assert.equal(result.doc,rep);assert.equal(state.docs.length,3);
 // Same-group pending evidence with different bytes must remain untouched.
 const pending={id:'pending',name,date:'2026-10-06',kind:'image',value:null,itemNo:0,group:'REPRESENTAÇÃO DE BANDAS'};state.docs=[pending];ctx.stored.set('pending','different-image');
 result=await ctx.identifyImport(name,'2026-10-06','new-image','','image');assert.equal(result.existing,null);assert.equal(ctx.stored.get('pending'),'different-image');
 // Partial overlap or multiple existing copies must block, not add payments.
 state.docs=[rep];ctx.ocrText=text.replace('TOTAL R$ 25.000,00','SEGUNDO EXEMPLO 06/10/2026 R$ 1.000,00');await assert.rejects(()=>ctx.identifyImport(name,'2026-10-06','partial','','image'),/Parte dos pagamentos/);
 ctx.ocrText=text;state.docs=[rep,{...rep,id:'duplicate',sourceId:'duplicate'}];await assert.rejects(()=>ctx.identifyImport(name,'2026-10-06','duplicate','','image'),/mais de um cadastro/);
 state.docs=[kart];ctx.ocrText='ilegível';const staged=await ctx.identifyImport(name,'2026-10-06','unreadable','','image');assert.equal(staged.requiresReview,true);
 const stagedImport=await ctx.importDocumentFile(name,'2026-10-06','unreadable','image','','staged');assert.equal(stagedImport.doc.value,null);assert.equal(stagedImport.doc.requiresReview,true);assert.equal(state.docs.length,2);
 const retryStaged=await ctx.importDocumentFile(name,'2026-10-06','unreadable','image','','staged-retry');assert.equal(retryStaged.existing,true);assert.equal(state.docs.length,2);assert.equal(JSON.stringify(kart),kartBefore);
 ctx.stored.set(stagedImport.doc.id,'unreadable');assert.equal(await ctx.readSourceOcr(stagedImport.doc,true),0);assert.equal(state.docs.length,2);assert.equal(stagedImport.doc.value,null);
 ctx.ocrText='TIMBALADA\nARTISTA TESTE TRANSFERENCIA 06/10/2026 R$ 6.000,00';const tim=await ctx.importDocumentFile('Pagamento 2026-10-08.jpeg','2026-10-08','timbalada','image','','tim');assert.equal(tim.doc.group,'TIMBALADA');
 stagedImport.doc.group='TIMBALADA';stagedImport.doc.groupDetection='manual';ctx.ocrText='TIMBALADA\nARTISTA TESTE TRANSFERENCIA 06/10/2026 R$ 6.000,00';const beforeRead=state.docs.length;assert.equal(await ctx.readSourceOcr(stagedImport.doc,true),1);assert.equal(state.docs.length,beforeRead);assert.equal(state.docs.find(d=>d.id===stagedImport.doc.id).value,6000);
 state.docs=[{id:'old-ocr',sourceId:'old-ocr',name,date:'2026-10-06',group:'TIMBALADA',kind:'image',itemNo:1,benef:'NOME ILEGIVEL',value:6000}];ctx.ocrText='TIMBALADA\nARTISTA TESTE 06/10/2026 R$ 6.000,00';const weak=await ctx.identifyImport(name,'2026-10-06','weak','','image');assert.equal(weak.requiresReview,true);assert.match(weak.issue,/nome precisa/);
 const cellText='TIMBALADA\nTESTE EXEMPLO\tFOLHA COMPLEMENTO 02 REF 08/10/2026\t13/10/2026\t15.624,00\nTOTAL R$ 15.624,00';const cellItems=ctx.parseOcr(cellText,{date:'2026-10-08'});assert.equal(cellItems.length,1);assert.equal(cellItems[0].date,'2026-10-13');assert.equal(cellItems[0].benef,'TESTE EXEMPLO');assert.equal(cellItems[0].value,15624);assert.equal(ctx.detectSavedGroup('TIMBALADA\nEMPRESA EVENTOS LTDA'),'TIMBALADA');
 const tableCtx={norm:ctx.norm,parseOcr:ctx.parseOcr,brNumber:ctx.brNumber,money:String,detectSavedGroup:()=> 'TIMBALADA',detectPaymentGrid:()=>({xs:[0,100,200,300,400,500],ys:[0,10,30,80,110]}),createImageBitmap:async()=>({width:500,height:110,close(){}}),document:{createElement:()=>({width:500,height:110,getContext:()=>({fillRect(){},drawImage(){},getImageData:()=>({data:[]})})})}};vm.createContext(tableCtx);vm.runInContext(fn('readPaymentTable').replace(/^function /,'async function '),tableCtx);
 const tableCells=['FORNECEDOR','DESCRICAO','FORMA','DATA','VALOR','TESTE EXEMPLO','SERVICO','PIX','13/10/2026','R$ 1.000,00','','','','TOTAL','R$ 1.000,00'];let cellIndex=0;const tableWorker={recognize:async()=>({data:{text:tableCells[cellIndex++]}})};const tableRead=await tableCtx.readPaymentTable('image',tableWorker,'TIMBALADA');assert.equal(ctx.parseOcr(tableRead,{}).length,1);cellIndex=0;tableCells[14]='R$ 900,00';await assert.rejects(()=>tableCtx.readPaymentTable('image',tableWorker,'TIMBALADA'),/precisa de revisão/);
 const batchCtx={save(){},inferDate:()=> '2026-10-06',importDocumentFile:async(name)=>{if(name.includes('falha'))throw new Error('arquivo com conflito');return {existing:false,doc:{name}};}};vm.createContext(batchCtx);vm.runInContext(fn('importDocumentsBatch').replace(/^function /,'async function '),batchCtx);
 const batch=await batchCtx.importDocumentsBatch([{name:'falha.jpeg'},{name:'timbalada.jpeg'}],'TIMBALADA','batch');assert.equal(batch.accepted,1);assert.equal(batch.errors.length,1);assert.match(batch.errors[0],/falha.jpeg/);assert.equal(batch.existingSelected.name,'timbalada.jpeg');
 console.log('PASS: collisions, TIMBALADA group, unreadable collision staged without payment, repeat staging deduplicated, review gate, per-file failure continues batch, original records and links preserved, syntax');

})().catch(e=>{console.error(e);process.exitCode=1});
