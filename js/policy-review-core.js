/* Pure anchor and merge rules shared by the browser and behavioral tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PolicyReviewCore=api})(typeof globalThis==='object'?globalThis:this,function(){
  const normalize=text=>String(text||'').replace(/\s+/g,' ').trim();
  function anchor(blockId,text,start,end,sectionId=''){
    while(start<end&&/\s/.test(text[start]))start++;
    while(end>start&&/\s/.test(text[end-1]))end--;
    if(!blockId||start<0||end<=start||end>text.length)throw new Error('Selecciona un fragmento dentro de un solo bloque.');
    return {blockId,sectionId,start,end,quote:text.slice(start,end),prefix:text.slice(Math.max(0,start-48),start),suffix:text.slice(end,end+48),source:text};
  }
  function locate(a,text){
    if(!a||!a.quote)return {status:'section'};
    const quote=normalize(a.quote),source=a.source;
    if(source===text&&text.slice(a.start,a.end)===quote)return {status:'attached',start:a.start,end:a.end};
    if(typeof source==='string'&&Number.isInteger(a.start)&&Number.isInteger(a.end)){
      let lead=0,tail=0;while(lead<Math.min(source.length,text.length)&&source[lead]===text[lead])lead++;
      while(tail<Math.min(source.length-lead,text.length-lead)&&source[source.length-1-tail]===text[text.length-1-tail])tail++;
      if(text.length-tail===lead&&lead<=a.start&&source.length-tail>=a.end)return {status:'orphan',reason:'El texto comentado fue eliminado.'};
    }
    const positions=[];let from=0,at;
    while((at=text.indexOf(quote,from))!==-1){positions.push(at);from=at+Math.max(1,quote.length)}
    if(positions.length===1)return {status:'attached',start:positions[0],end:positions[0]+quote.length};
    if(positions.length>1){
      const ranked=positions.map(start=>({start,score:(a.prefix&&text.slice(Math.max(0,start-a.prefix.length),start)===a.prefix?1:0)+(a.suffix&&text.slice(start+quote.length,start+quote.length+a.suffix.length)===a.suffix?1:0)})).sort((x,y)=>y.score-x.score);
      if(ranked[0].score>0&&ranked[0].score>ranked[1].score)return {status:'attached',start:ranked[0].start,end:ranked[0].start+quote.length};
      return {status:'orphan',reason:'El fragmento aparece varias veces. Vuelve a vincularlo.'};
    }
    // Map a single edit while preserving both boundaries. Deletion of the selected
    // range is explicitly orphaned, never silently attached to unrelated text.
    if(typeof source==='string'&&Number.isInteger(a.start)&&Number.isInteger(a.end)){
      let prefix=0,suffix=0;while(prefix<Math.min(source.length,text.length)&&source[prefix]===text[prefix])prefix++;
      while(suffix<Math.min(source.length-prefix,text.length-prefix)&&source[source.length-1-suffix]===text[text.length-1-suffix])suffix++;
      const oldEnd=source.length-suffix,newEnd=text.length-suffix,delta=text.length-source.length;
      if(prefix>=a.start&&oldEnd<=a.end&&!(prefix===a.start&&oldEnd===a.end)&&a.end+delta>a.start)
        return {status:'changed',start:a.start,end:a.end+delta};
      if(oldEnd<=a.start&&text.slice(a.start+delta,a.end+delta)===quote)return {status:'attached',start:a.start+delta,end:a.end+delta};
      if(prefix>=a.end)return {status:'attached',start:a.start,end:a.end};
      if(newEnd===prefix&&oldEnd>=a.end&&prefix<=a.start)return {status:'orphan',reason:'El texto comentado fue eliminado.'};
    }
    return {status:'orphan',reason:'El texto cambió. Revisa y vuelve a vincular este comentario.'};
  }
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  // Three-way merge of independent content edits; incompatible same-field edits
  // remain explicit conflicts. Comment records never enter this document merge.
  function merge(base,local,remote,path=''){
    if(equal(local,base))return {value:remote,conflicts:[]};
    if(equal(remote,base)||equal(local,remote))return {value:local,conflicts:[]};
    if(base&&local&&remote&&!Array.isArray(local)&&typeof local==='object'&&!Array.isArray(remote)&&typeof remote==='object'){
      const value={},conflicts=[];
      for(const key of new Set([...Object.keys(base),...Object.keys(local),...Object.keys(remote)])){
        if(['comments','_revision','updatedAt','versions'].includes(key)){value[key]=remote[key];continue}
        const part=merge(base[key],local[key],remote[key],path?path+'.'+key:key);value[key]=part.value;conflicts.push(...part.conflicts);
      }return {value,conflicts};
    }
    return {value:local,conflicts:[path||'documento']};
  }
  return {normalize,anchor,locate,merge};
});
