import {Schema, DOMParser, DOMSerializer} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {baseKeymap, toggleMark,setBlockType} from 'prosemirror-commands';
import {wrapInList,splitListItem,liftListItem} from 'prosemirror-schema-list';
import {keymap} from 'prosemirror-keymap';
import {ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo, prosemirrorToYXmlFragment, yXmlFragmentToProseMirrorRootNode} from 'y-prosemirror';

export const schema = new Schema({
  nodes: {
    doc:{content:'block+'},
    paragraph:{content:'inline*', group:'block', parseDOM:[{tag:'p'},{tag:'div'}], toDOM:() => ['p',0]},
    heading:{attrs:{level:{default:3}},content:'inline*',group:'block',parseDOM:[{tag:'h2',attrs:{level:2}},{tag:'h3',attrs:{level:3}}],toDOM:node=>[node.attrs.level===2?'h2':'h3',0]},
    bullet_list:{content:'list_item+',group:'block',parseDOM:[{tag:'ul'}],toDOM:()=>['ul',0]},
    ordered_list:{attrs:{order:{default:1}},content:'list_item+',group:'block',parseDOM:[{tag:'ol'}],toDOM:node=>['ol',{start:node.attrs.order},0]},
    list_item:{content:'paragraph block*',parseDOM:[{tag:'li'}],toDOM:()=>['li',0]},
    text:{group:'inline'},
    hard_break:{inline:true,group:'inline',selectable:false,parseDOM:[{tag:'br'}],toDOM:() => ['br']}
  },
  marks: {
    strong:{parseDOM:[{tag:'b'},{tag:'strong'},{style:'font-weight=bold'}],toDOM:() => ['strong',0]},
    em:{parseDOM:[{tag:'i'},{tag:'em'},{style:'font-style=italic'}],toDOM:() => ['em',0]},
    underline:{parseDOM:[{tag:'u'},{style:'text-decoration=underline'}],toDOM:() => ['u',0]},
    color:{attrs:{color:{}},parseDOM:[{style:'color',getAttrs:value => /^#[0-9a-f]{6}$|^rgb\([\d,\s]+\)$/i.test(value) ? {color:value} : false}],
      toDOM:mark => ['span',{style:'color:'+mark.attrs.color},0]}
  }
});

export function seedRich(fragment, html) {
  if (fragment.length) return;
  const container = document.createElement('div'); container.innerHTML = html;
  prosemirrorToYXmlFragment(DOMParser.fromSchema(schema).parse(container), fragment);
}

export function readRich(fragment,keepBlocks=false) {
  if (!fragment.length) return {richHtml:'',content:''};
  const node = yXmlFragmentToProseMirrorRootNode(fragment, schema);
  const container = document.createElement('div');
  container.append(DOMSerializer.fromSchema(schema).serializeFragment(node.content));
  return {richHtml:keepBlocks?container.innerHTML:[...container.children].map(p => p.innerHTML).join('<br>'),content:node.textBetween(0,node.content.size,'\n','\n')};
}

export function bindRich({element,fragment,awareness,editable,onChange,field}) {
  for (const attr of [...element.attributes]) if (attr.name.startsWith('on')) element.removeAttribute(attr.name);
  element.removeAttribute('contenteditable'); element.innerHTML='';
  const cursorBuilder = user => {
    const cursor=document.createElement('span'), label=document.createElement('span');
    cursor.className='ProseMirror-yjs-cursor';
    const color=/^#[0-9a-f]{6}$/i.test(user.color) ? user.color : '#007d73';
    cursor.style.borderColor=color; label.style.backgroundColor=color;
    label.textContent=String(user.name || 'Colaborador').slice(0,80); cursor.append(label); return cursor;
  };
  const view = new EditorView(element, {
    state:EditorState.create({schema,plugins:[ySyncPlugin(fragment),
      yCursorPlugin(awareness,{cursorBuilder,awarenessStateFilter:(localId,clientId,state) => localId!==clientId && state.field===field}),
      yUndoPlugin(),keymap({'Mod-z':undo,'Mod-y':redo,'Mod-Shift-z':redo,
        'Mod-b':toggleMark(schema.marks.strong),'Mod-i':toggleMark(schema.marks.em),
        Enter:(state,dispatch) => {if(splitListItem(schema.nodes.list_item)(state,dispatch))return true;dispatch(state.tr.replaceSelectionWith(schema.nodes.hard_break.create()).scrollIntoView());return true;},
        'Mod-[':liftListItem(schema.nodes.list_item)}),keymap(baseKeymap)]}),
    editable,
    attributes:{'aria-label':element.getAttribute('aria-label') || 'Texto del comunicado','role':'textbox','aria-multiline':'true'},
    handleDOMEvents:{focus:() => {awareness.setLocalStateField('field',field);return false;}},
    dispatchTransaction(transaction) {
      if(this.isDestroyed)return;
      this.updateState(this.state.apply(transaction));
      if (transaction.docChanged) queueMicrotask(onChange);
    }
  });
  return view;
}

export function richCommand(view,command,value) {
  const {state,dispatch}=view;
  const mark={bold:'strong',italic:'em',underline:'underline'}[command];
  if (mark) toggleMark(schema.marks[mark])(state,dispatch);
  else if(command==='formatBlock')setBlockType(value==='p'?schema.nodes.paragraph:schema.nodes.heading,{level:3})(state,dispatch);
  else if(command==='insertUnorderedList'||command==='insertOrderedList')wrapInList(command==='insertUnorderedList'?schema.nodes.bullet_list:schema.nodes.ordered_list)(state,dispatch);
  else if(command==='foreColor' && /^#[0-9a-f]{6}$/i.test(value)) {
    const {from,to,empty}=state.selection, m=schema.marks.color.create({color:value});
    dispatch(empty ? state.tr.addStoredMark(m) : state.tr.addMark(from,to,m));
  } else if(command==='removeFormat') dispatch(state.tr.removeMark(state.selection.from,state.selection.to).setStoredMarks([]));
  view.focus();
}
