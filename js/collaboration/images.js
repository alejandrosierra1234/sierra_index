// Optimize a detached sharing copy. Originals and small graphics stay untouched.
const photoKeys=new Set(['src','photo','heroImage','authorPhoto']);
export async function optimizeSharingImages(draft,{maxDimension=2400,quality=.9,convert=resizeImage,progress=()=>{},valid=()=>true}={}) {
  const copy=structuredClone(draft),images=new Map();
  function collect(value,path=[]) {
    if(!value||typeof value!=='object')return;
    for(const [key,item] of Object.entries(value)) {
      if(typeof item==='string'&&photoKeys.has(key)&&/^data:image\/(png|jpeg|webp);base64,/i.test(item)
        && item.length>350000&&!path.some(part=>/signature|qr|logo/i.test(part))) {
        if(!images.has(item))images.set(item,[]);
        images.get(item).push({value,key});
      }else if(item&&typeof item==='object')collect(item,[...path,key]);
    }
  }
  collect(copy);let completed=0;
  for(const [image,fields] of images) {
    if(!valid())throw Error('Se canceló la preparación del comunicado.');
    const optimized=await convert(image,{maxDimension,quality});
    if(!valid())throw Error('Se canceló la preparación del comunicado.');
    if(typeof optimized==='string'&&optimized.startsWith('data:image/')&&optimized.length<image.length)
      fields.forEach(({value,key})=>{value[key]=optimized;});
    progress(++completed,images.size);
  }
  return copy;
}

async function resizeImage(source,{maxDimension,quality}) {
  const image=new Image();image.decoding='async';image.src=source;
  await image.decode();
  const scale=Math.min(1,maxDimension/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
  try {
    const context=canvas.getContext('2d');
    if(!context)throw Error('No se pudo preparar una imagen. Tu original se conserva.');
    context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
    context.drawImage(image,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/webp',quality);
  }finally{canvas.width=canvas.height=1;image.src='';}
}
