const PRODUCTS = [
  {id:1,name:"Pie Susu Bali",category:"Manis",price:35000,unit:"isi 10",emoji:"🥮",description:"Kulit pastry renyah dengan isian susu lembut.",color:"#f3d7ad",tag:"Favorit"},
  {id:2,name:"Kacang Disco",category:"Gurih",price:25000,unit:"250 gram",emoji:"🥜",description:"Kacang berbalut tepung yang gurih dan renyah.",color:"#ead6b5",tag:"Renyah"},
  {id:3,name:"Dodol Bali",category:"Manis",price:30000,unit:"250 gram",emoji:"🍬",description:"Camilan legit dengan tekstur kenyal khas tradisi.",color:"#e8c7b4",tag:"Tradisi"},
  {id:4,name:"Pia Kacang Hijau",category:"Manis",price:28000,unit:"isi 10",emoji:"🥯",description:"Pia berlapis dengan isian kacang hijau lembut.",color:"#e1e6c7",tag:"Klasik"},
  {id:5,name:"Keripik Singkong",category:"Gurih",price:20000,unit:"200 gram",emoji:"🍘",description:"Irisan singkong tipis dengan sensasi gurih.",color:"#e9d4a9",tag:"Teman santai"},
  {id:6,name:"Sambal Matah",category:"Tradisional",price:22000,unit:"150 gram",emoji:"🌶️",description:"Sambal segar khas Bali dengan aroma serai.",color:"#f1c5a9",tag:"Khas Bali"},
  {id:7,name:"Jaje Laklak",category:"Tradisional",price:18000,unit:"1 porsi",emoji:"🥞",description:"Kue tradisional lembut, nikmat dengan kelapa.",color:"#cfe0c6",tag:"Tradisional"},
  {id:8,name:"Pisang Rai",category:"Tradisional",price:18000,unit:"1 porsi",emoji:"🍌",description:"Pisang berbalut adonan, disajikan dengan kelapa.",color:"#f0df9f",tag:"Manis gurih"}
];
const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const cart = new Map();
let activeCategory = "Semua";
let lastOrderText = "";

const grid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const cartCount = document.querySelector("#cart-count");
const drawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
const checkoutDialog = document.querySelector("#checkout-dialog");
const orderDialog = document.querySelector("#order-dialog");
const toast = document.querySelector("#toast");

function renderProducts(){
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  const filtered = PRODUCTS.filter(p => (activeCategory === "Semua" || p.category === activeCategory) && `${p.name} ${p.description} ${p.category}`.toLocaleLowerCase("id").includes(query));
  document.querySelector("#product-count").textContent = `${filtered.length} pilihan`;
  document.querySelector("#empty-state").hidden = filtered.length !== 0;
  grid.innerHTML = filtered.map(p => `<article class="product-card">
    <div class="product-art" style="background:${p.color}"><span class="product-tag">${p.tag}</span><span class="product-emoji" aria-hidden="true">${p.emoji}</span></div>
    <div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><div><div class="price">${rupiah(p.price)}</div><small style="color:var(--muted);font-size:9px">${p.unit}</small></div><button class="add-button" type="button" data-add="${p.id}" aria-label="Tambah ${p.name} ke keranjang">+</button></div></div>
  </article>`).join("");
}
function showToast(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(()=>toast.classList.remove("show"),2600);
}
function addToCart(id){
  cart.set(id,(cart.get(id)||0)+1); renderCart(); showToast(`${PRODUCTS.find(p=>p.id===id).name} ditambahkan ke keranjang.`);
}
function cartTotals(){
  let count=0,total=0;
  cart.forEach((qty,id)=>{count+=qty;total+=PRODUCTS.find(p=>p.id===id).price*qty;});
  return {count,total};
}
function renderCart(){
  const {count,total}=cartTotals();cartCount.textContent=count;document.querySelector("#cart-subtotal").textContent=rupiah(total);
  document.querySelector("#checkout-total").textContent=rupiah(total);
  document.querySelector("#checkout-button").disabled=count===0;
  const container=document.querySelector("#cart-items");
  if(!count){container.innerHTML='<p class="cart-empty">Keranjangmu masih kosong. Yuk pilih jajanan!</p>';return;}
  container.innerHTML=[...cart.entries()].map(([id,qty])=>{
    const p=PRODUCTS.find(item=>item.id===id);
    return `<div class="cart-item"><div class="cart-item-art" style="background:${p.color}">${p.emoji}</div><div><h3>${p.name}</h3><small>${rupiah(p.price)} / ${p.unit}</small><div class="quantity-control"><button type="button" data-qty="${id}" data-delta="-1" aria-label="Kurangi ${p.name}">−</button><span>${qty}</span><button type="button" data-qty="${id}" data-delta="1" aria-label="Tambah ${p.name}">+</button></div></div><span class="cart-item-total">${rupiah(p.price*qty)}</span></div>`;
  }).join("");
}
function openCart(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");overlay.hidden=false;document.body.style.overflow="hidden";}
function closeCart(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");overlay.hidden=true;document.body.style.overflow="";}
grid.addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(Number(btn.dataset.add));});
document.querySelectorAll(".chip").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===btn));renderProducts();}));
searchInput.addEventListener("input",renderProducts);
document.querySelector("#open-cart").addEventListener("click",openCart);
document.querySelector("#close-cart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.querySelector("#cart-items").addEventListener("click",e=>{
  const btn=e.target.closest("[data-qty]");if(!btn)return;
  const id=Number(btn.dataset.qty),next=(cart.get(id)||0)+Number(btn.dataset.delta);
  if(next<=0)cart.delete(id);else cart.set(id,next);renderCart();
});
document.querySelector("#checkout-button").addEventListener("click",()=>{closeCart();checkoutDialog.showModal();});
document.querySelector("#close-checkout").addEventListener("click",()=>checkoutDialog.close());
document.querySelector("#checkout-form").addEventListener("submit",e=>{
  e.preventDefault();if(cart.size===0)return;
  const data=new FormData(e.currentTarget);const {total}=cartTotals();
  const lines=[...cart.entries()].map(([id,qty])=>{const p=PRODUCTS.find(x=>x.id===id);return `• ${p.name} × ${qty} — ${rupiah(p.price*qty)}`;});
  lastOrderText=`RINGKASAN PESANAN BALI BITES\nNama: ${data.get("name")}\nTelepon: ${data.get("phone")}\nAlamat: ${data.get("address")}\n${data.get("notes")?`Catatan: ${data.get("notes")}\n`:""}\n${lines.join("\n")}\n\nSubtotal: ${rupiah(total)}\nStatus: Demo — belum dibayar dan belum dikirim ke penjual.`;
  document.querySelector("#order-summary").textContent=lastOrderText;
  checkoutDialog.close();orderDialog.showModal();cart.clear();renderCart();e.currentTarget.reset();
});
document.querySelectorAll(".close-order").forEach(btn=>btn.addEventListener("click",()=>orderDialog.close()));
document.querySelector("#copy-order").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(lastOrderText);showToast("Ringkasan pesanan berhasil disalin.");}
  catch{const ta=document.createElement("textarea");ta.value=lastOrderText;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();showToast("Ringkasan pesanan disalin.");}
});
document.querySelector("#year").textContent=new Date().getFullYear();

function recommend(message){
  const s=message.toLocaleLowerCase("id");
  let items,lead;
  if(/manis|legit|gula|dessert|susu|kue/.test(s)){items=PRODUCTS.filter(p=>p.category==="Manis"||p.id===7);lead="Kalau ingin yang manis, coba ini:";}
  else if(/gurih|renyah|asin|kacang|keripik|pedas/.test(s)){items=PRODUCTS.filter(p=>p.category==="Gurih"||p.id===6);lead="Untuk rasa gurih atau sensasi renyah, ini pilihanku:";}
  else if(/tradisional|khas|lokal|bali|budaya/.test(s)){items=PRODUCTS.filter(p=>p.category==="Tradisional"||p.id===1);lead="Untuk mengenal rasa khas Bali, kamu bisa mulai dari:";}
  else if(/murah|hemat|budget|terjangkau/.test(s)){items=[...PRODUCTS].sort((a,b)=>a.price-b.price).slice(0,3);lead="Berikut beberapa pilihan dengan harga paling terjangkau di katalog demo:";}
  else if(/rekomendasi|pilih|bingung|apa|saran/.test(s)){items=[PRODUCTS[0],PRODUCTS[1],PRODUCTS[6]];lead="Aku sarankan tiga pilihan ini untuk mulai menjelajah:";}
  else{items=[PRODUCTS[0],PRODUCTS[1],PRODUCTS[6]];lead="Aku bisa bantu memilih. Coba beri tahu apakah kamu suka rasa manis, gurih, atau jajanan tradisional.";}
  return lead+"\n"+items.slice(0,3).map(p=>`• ${p.name} — ${rupiah(p.price)}. ${p.description}`).join("\n")+"\n\nPilih produk di katalog untuk menambahkannya ke keranjang.";
}
function addChatMessage(text,isUser=false){
  const el=document.createElement("div");el.className=`message ${isUser?"user-message":"assistant-message"}`;
  if(!isUser){const avatar=document.createElement("span");avatar.className="avatar";avatar.textContent="✦";el.appendChild(avatar);}
  const p=document.createElement("p");p.textContent=text;el.appendChild(p);
  document.querySelector("#chat-messages").appendChild(el);
  document.querySelector("#chat-messages").scrollTop=document.querySelector("#chat-messages").scrollHeight;
}
async function sendChat(message){
  if(!message.trim())return;addChatMessage(message,true);
  const input=document.querySelector("#chat-input");input.value="";
  const submit=document.querySelector("#chat-form button");submit.disabled=true;
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,products:PRODUCTS.map(p=>({name:p.name,category:p.category,price:p.price,description:p.description}))})});
    if(!res.ok)throw new Error("AI endpoint unavailable");
    const data=await res.json();addChatMessage(data.reply||recommend(message));
  }catch{addChatMessage(recommend(message));}
  finally{submit.disabled=false;input.focus();}
}
document.querySelector("#chat-form").addEventListener("submit",e=>{e.preventDefault();sendChat(document.querySelector("#chat-input").value);});
document.querySelectorAll("[data-prompt]").forEach(btn=>btn.addEventListener("click",()=>sendChat(btn.dataset.prompt)));
renderProducts();renderCart();
