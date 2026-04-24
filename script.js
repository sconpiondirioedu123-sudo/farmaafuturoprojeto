let USER_DATA = { nome: "Visitante", descVal: 0.90, cpf: "", endereco: "", telefone: "" };
let CARRINHO = [];
let HISTORICO = [];
let currentQty = 1;
let selectedDelivery = 'delivery';
const TAXA_DELIVERY = 7.90;

// Produtos agora recebem a propriedade "imagem" com URLs (coloquei algumas de exemplo)
const PRODUTOS = [
    { id: 1, cat: "Medicamentos", nome: "Buscopan Duo", preco: 28.00, imagem: "img/buscopan01.webp", bula: "Para alívio de cólicas abdominais." },
    { id: 2, cat: "Higiene", nome: "Shampoo Neutro", preco: 22.00, imagem: "img/shampo02.png", bula: "Uso diário para limpeza profunda." },
    { id: 3, cat: "Medicamentos", nome: "Dipirona 500mg", preco: 12.50, imagem:"img/dipirona03.png", bula: "Analgésico e antitérmico para febre." },
    { id: 4, cat: "Bem-Estar", nome: "Preservativo 3un", preco: 14.00, imagem: "img/pre04.png", bula: "Segurança e proteção." },
    { id: 5, cat: "Higiene", nome: "Sabonete Dove", preco: 5.50, imagem: "img/sabonete05.png", bula: "Limpeza com hidratação para pele." },
    { id: 6, cat: "Medicamentos", nome: "Vitamina C 1g", preco: 19.90, imagem: "img/vit06.png", bula: "Reforço da imunidade, gripe." },
    { id: 7, cat: "Bem-Estar", nome: "Repelente Off", preco: 35.00, imagem: "img/repe07.png", bula: "Proteção contra insetos e mosquitos." },
    { id: 8, cat: "Higiene", nome: "Lenço Umedecido", preco: 15.00, imagem: "img/leco08.png", bula: "Limpeza suave da pele." },
    { id: 9, cat: "Medicamentos", nome: "Paracetamol", preco: 10.00, imagem: "img/para09.png", bula: "Para febre e dor de cabeça." },
    { id: 10, cat: "Higiene", nome: "Fio Dental", preco: 8.50, imagem: "img/fio10.png", bula: "Limpeza entre os dentes." }
];

function init() { renderProducts(PRODUTOS); lucide.createIcons(); }

function handleLogin() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    if(email.length > 3 && pass.length > 3) {
        USER_DATA.nome = email.split('@')[0].toUpperCase();
        document.querySelectorAll('.user-name-display').forEach(el => el.innerText = USER_DATA.nome);
        document.getElementById('auth-screen').classList.add('hidden');
        document.body.classList.remove('auth-open');
    } else { alert("Acesso negado."); }
}

function renderProducts(lista) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = lista.map(p => `
        <div class="product-card bg-[#12181f] p-4 md:p-6 rounded-[30px] md:rounded-[40px] border border-white/5 transition hover:border-[#00f294]/50">
            <div class="bg-white/5 aspect-square rounded-[20px] md:rounded-[30px] mb-4 flex items-center justify-center cursor-pointer overflow-hidden relative" onclick="openProduct(${p.id})">
                <img src="${p.imagem}" alt="${p.nome}" class="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition duration-500">
            </div>
            <p class="text-[#00f294] text-[8px] font-black uppercase mb-1 italic">${p.cat}</p>
            <h4 class="font-bold text-[11px] uppercase mb-4 h-8 overflow-hidden">${p.nome}</h4>
            <div class="flex justify-between items-center">
                <span class="text-white font-black italic text-base md:text-lg">R$ ${(p.preco * USER_DATA.descVal).toFixed(2)}</span>
                <button onclick="openProduct(${p.id})" class="bg-[#00f294] text-black w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center hover:scale-110 transition"><i data-lucide="plus" size="18"></i></button>
            </div>
        </div>`).join('');
    lucide.createIcons();
}

function buscarComIA() {
    const termo = document.getElementById('ia-search-input').value.toLowerCase();
    
    if (!termo) {
        renderProducts(PRODUTOS);
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn').classList.add('active'); 
        return;
    }

    const filtrados = PRODUTOS.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.cat.toLowerCase().includes(termo) || 
        p.bula.toLowerCase().includes(termo)
    );
    
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

    if(filtrados.length > 0) {
        renderProducts(filtrados);
    } else {
        document.getElementById('product-grid').innerHTML = `
            <div class="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
                <i data-lucide="search-x" size="48" class="mb-4 opacity-50"></i>
                <p class="uppercase font-black italic text-center text-xs">IA: Nenhum medicamento encontrado para "${termo}".<br>Tente outro sintoma.</p>
            </div>`;
        lucide.createIcons();
    }
}

// Paddings ajustados para mobile (p-6) e desk (md:p-12)
function openProduct(id) {
    const p = PRODUTOS.find(x => x.id === id);
    const preco = (p.preco * USER_DATA.descVal).toFixed(2);
    currentQty = 1; selectedDelivery = 'delivery';
    
    document.getElementById('modal-content').innerHTML = `
        <div class="w-full md:w-2/5 bg-black/20 p-8 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 relative">
            <button onclick="closeModals()" class="absolute top-4 right-4 md:hidden bg-white/10 p-2 rounded-full text-white"><i data-lucide="x" size="20"></i></button>
            <div class="w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-[30px] md:rounded-[50px] flex items-center justify-center text-8xl font-black text-white/5 mb-6 overflow-hidden shadow-2xl">
                <img src="${p.imagem}" class="w-full h-full object-cover">
            </div>
            <h2 class="text-2xl md:text-3xl font-black uppercase italic text-center leading-none">${p.nome}</h2>
        </div>
        <div class="p-6 md:p-12 flex-1 flex flex-col">
            <div class="flex gap-4 md:gap-8 border-b border-white/5 mb-6 overflow-x-auto no-scrollbar">
                <button onclick="switchTab('comprar', ${p.id})" id="tab-comprar" class="tab-btn active whitespace-nowrap">Opções</button>
                <button onclick="switchTab('bula', ${p.id})" id="tab-bula" class="tab-btn whitespace-nowrap">Bula</button>
            </div>
            <div id="tab-content" class="space-y-4 md:space-y-6 flex-1">
                <div class="grid grid-cols-2 gap-3 md:gap-4">
                    <button onclick="setDel('delivery')" id="btn-del" class="opt-box active flex flex-col items-start">
                        <span class="text-[10px] md:text-[11px]">Delivery</span>
                        <span class="text-[8px] md:text-[9px] opacity-70 mt-1">+ R$ 7,90</span>
                    </button>
                    <button onclick="setDel('loja')" id="btn-loja" class="opt-box flex flex-col items-start">
                        <span class="text-[10px] md:text-[11px]">Retirar na Loja</span>
                        <span class="text-[8px] md:text-[9px] opacity-70 mt-1">Grátis</span>
                    </button>
                </div>
                <div class="flex items-center gap-4 md:gap-6 bg-white/5 w-fit p-2 px-4 rounded-2xl border border-white/10 mt-4">
                    <span class="text-[9px] uppercase font-black text-gray-500 italic mr-2">Qtd:</span>
                    <button onclick="updQty(-1, ${preco})" class="text-xl font-black hover:text-[#00f294] transition py-1 px-2">-</button>
                    <span id="q-val" class="text-xl md:text-2xl font-black w-6 text-center">1</span>
                    <button onclick="updQty(1, ${preco})" class="text-xl font-black hover:text-[#00f294] transition py-1 px-2">+</button>
                </div>
            </div>
            <div class="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                    <p class="text-[10px] font-black uppercase text-gray-500 italic">Total</p>
                    <p id="t-modal" class="text-3xl md:text-5xl font-black italic text-[#00f294]">R$ ${(parseFloat(preco) + TAXA_DELIVERY).toFixed(2)}</p>
                </div>
                <button onclick="addCart('${p.nome}', ${preco})" class="bg-[#00f294] text-black font-black px-6 md:px-14 py-4 md:py-6 rounded-2xl md:rounded-3xl uppercase italic shadow-2xl hover:scale-105 transition text-sm md:text-base">Adicionar</button>
            </div>
        </div>`;
    document.getElementById('modal-product').classList.remove('hidden');
    lucide.createIcons();
}

function addCart(n, p) {
    const t = (currentQty * p) + (selectedDelivery === 'delivery' ? TAXA_DELIVERY : 0);
    CARRINHO.push({ n, t, q: currentQty });
    updateCartUI();
    closeModals();
}

function updateCartUI() {
    const total = CARRINHO.reduce((s, i) => s + i.t, 0);
    document.getElementById('cart-count').innerText = CARRINHO.length;
    document.getElementById('cart-count').classList.toggle('hidden', CARRINHO.length === 0);
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2)}`;
    document.getElementById('cart-items').innerHTML = CARRINHO.map(i => `
        <div class="bg-white/5 p-3 md:p-4 rounded-2xl flex justify-between items-center">
            <span class="text-xs font-bold uppercase">${i.q}x ${i.n}</span>
            <span class="text-[#00f294] font-black italic">R$ ${i.t.toFixed(2)}</span>
        </div>`).join('');
}

function checkout() {
    if(CARRINHO.length === 0) return;
    const total = CARRINHO.reduce((s, i) => s + i.t, 0);
    HISTORICO.push({ total, data: new Date().toLocaleTimeString() });
    CARRINHO = []; updateCartUI(); closeModals(); alert("Pedido Finalizado!");
}

function openHistory() {
    document.getElementById('history-items').innerHTML = HISTORICO.map(h => `
        <div class="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex justify-between items-center border border-white/5">
            <div><p class="text-gray-500 text-[9px] md:text-[10px] uppercase font-black">Finalizado às ${h.data}</p><p class="text-white font-bold uppercase italic text-xs md:text-sm">Pedido Concluído</p></div>
            <p class="text-[#00f294] font-black italic text-base md:text-lg">R$ ${h.total.toFixed(2)}</p>
        </div>`).join('') || "<p class='text-center opacity-30 uppercase font-black italic py-10'>Sem pedidos recentes</p>";
    document.getElementById('modal-history').classList.remove('hidden');
    lucide.createIcons();
}

function enviarSintomas() {
    const input = document.getElementById('sintomas-input').value;
    const res = document.getElementById('res-sintomas');
    
    if(input.trim().length < 3) {
        res.classList.remove('hidden');
        res.innerText = "Por favor, descreva o que está sentindo antes de enviar.";
        res.className = "mt-4 p-4 rounded-xl bg-red-500/10 text-red-500 font-black uppercase text-[10px] italic text-center";
        return;
    }

    res.classList.remove('hidden');
    res.innerText = "Seus sintomas foram enviados.\nEspere 5 minutos pela análise do farmacêutico.";
    res.className = "mt-4 p-4 rounded-xl bg-blue-500/10 text-blue-500 font-black uppercase text-[10px] italic text-center border border-blue-500/20";
    
    document.getElementById('sintomas-input').value = '';
}

function switchTab(t, id) {
    const p = PRODUTOS.find(x => x.id === id);
    if(t === 'bula') { document.getElementById('tab-content').innerHTML = `<div class="bg-white/5 p-6 rounded-[20px] md:rounded-[30px] italic text-gray-400 text-xs md:text-sm overflow-y-auto max-h-32 md:max-h-full no-scrollbar">${p.bula}</div>`; }
    else { openProduct(id); }
    document.getElementById('tab-comprar').classList.toggle('active', t === 'comprar');
    document.getElementById('tab-bula').classList.toggle('active', t === 'bula');
}

function updQty(v, p) { currentQty = Math.max(1, currentQty + v); document.getElementById('q-val').innerText = currentQty; const taxa = selectedDelivery === 'delivery' ? TAXA_DELIVERY : 0; document.getElementById('t-modal').innerText = `R$ ${(currentQty * p + taxa).toFixed(2)}`; }
function setDel(t) { selectedDelivery = t; document.getElementById('btn-del').classList.toggle('active', t === 'delivery'); document.getElementById('btn-loja').classList.toggle('active', t === 'loja'); const pStr = document.querySelector('#modal-content h2').innerText; const prod = PRODUTOS.find(x => x.nome === pStr); updQty(0, prod.preco * USER_DATA.descVal); }

function toggleCart() { document.getElementById('modal-cart').classList.toggle('hidden'); }

function toggleProfileMenu() { 
    document.getElementById('edit-name').value = USER_DATA.nome !== "Visitante" ? USER_DATA.nome : "";
    document.getElementById('edit-cpf').value = USER_DATA.cpf;
    document.getElementById('edit-address').value = USER_DATA.endereco;
    document.getElementById('edit-phone').value = USER_DATA.telefone;
    
    document.getElementById('modal-edit-profile').classList.toggle('hidden'); 
}

function closeModals() { document.querySelectorAll('.fixed.inset-0').forEach(m => { if(!m.id.includes('auth')) m.classList.add('hidden'); }); }

function filterCat(cat, btn) { 
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); 
    btn.classList.add('active'); 
    document.getElementById('ia-search-input').value = '';
    renderProducts(cat === 'Todos' ? PRODUTOS : PRODUTOS.filter(p => p.cat === cat)); 
}

function saveProfile() { 
    const novoNome = document.getElementById('edit-name').value; 
    const novoCpf = document.getElementById('edit-cpf').value;
    const novoEnd = document.getElementById('edit-address').value;
    const novoTel = document.getElementById('edit-phone').value;

    if(novoNome) { 
        USER_DATA.nome = novoNome; // Mantém a formatação que o usuário digitou
        document.querySelectorAll('.user-name-display').forEach(el => el.innerText = USER_DATA.nome); 
    }
    
    USER_DATA.cpf = novoCpf;
    USER_DATA.endereco = novoEnd;
    USER_DATA.telefone = novoTel;

    toggleProfileMenu(); 
    alert("Dados atualizados com sucesso!");
}

init();