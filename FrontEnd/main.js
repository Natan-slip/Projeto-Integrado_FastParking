const $nome = document.querySelector("#nome");
const $placa = document.querySelector("#placa");
const $registros = document.querySelector("#registros");
const $registrosRelatorio = document.querySelector("#registrosRelatorio")
const $adicionarVeiculo = document.querySelector("#btnAdicionar");
const $precos = document.querySelector("#btnPrecos");

const $txtNome = document.querySelector("#txtNome");
const $txtPlaca = document.querySelector("#txtPlaca");
const $txtData = document.querySelector("#txtData");
const $txtHora = document.querySelector("#txtHora");

const $btnSalvarPreco = document.querySelector("#btnSalvar");
const $btnFecharPreco = document.querySelector("#btnFecharPreco");
const $btnFecharComp = document.querySelector("#btnFecharComp");
const $btnImprimir = document.querySelector("#btnImprimir");
const $btnRelatorio = document.querySelector("#btnRelatorio")
const $btnSairRelatoio = document.querySelector("#btnSairRelatorio");
const $btnDemaishoras = document.querySelector("#btnDemaishoras");
const $btnHora = document.querySelector("#btnHora");

const $modalPrecos = document.querySelector(".container-precos");
const $modalComp = document.querySelector(".container-comprovante");
const $modalRelatorio = document.querySelector(".container-relatorio");

let codigoAtual;
let codigoRelatorio = 0;

let banco = [];
let bancoPreco = [];

const abrirModal = (el) => el.classList.add("exibirModal");

const fecharModal = (el) => el.classList.remove("exibirModal");

/* - Filtros e mascaras - */ 

const filtrarTexto = (texto) =>  texto.replace(/[^A-Za-zÀ-ÿ ]/g,"");

const filtrarNumero = (txt) => txt.replace(/[^0-9]/g, "");

const filtro = (txt) => txt.replace(/[^a-zA-Z0-9]/g, "");

const mascaraPlaca = txt => filtro(txt).replace(/(.{3})(.)/, "$1-$2");

const validarPlaca = (el) => /[A-Z]{3}-[0-9]{4}/g.test(el);

function alteraMaiusculo() {
	var $valor = document.querySelector("#placa");
	var novoTexto = $valor.value.toUpperCase();
	$valor.value = novoTexto;
}  

/* - Banco de Dados - */

const lerBDVeiculos = () => {
    const jsonBanco = JSON.parse ( localStorage.getItem("BDVeiculos"));
    banco = jsonBanco ? jsonBanco : [];
}

const gravarBDVeiculos = () => {
    const jsonBanco = JSON.stringify ( banco );
    localStorage.setItem ( "BDVeiculos", jsonBanco);
}

const lerBDPrecos = () => {
    const jsonBanco = JSON.parse ( localStorage.getItem("BDPrecos"));
    bancoPreco = jsonBanco ? jsonBanco : [];
}

const gravarBDPrecos = () => {
    const jsonBanco = JSON.stringify ( bancoPreco);
    localStorage.setItem ( "BDPrecos", jsonBanco);
}

/* - FUNÇÕES TABELA - */ 

const limparTabela = () => {
    while ( $registros.firstChild ) {
        $registros.removeChild( $registros.firstChild );
    }
}

const limparTabelaRelatorio = () => {
    while ( $registrosRelatorio.firstChild ) {
        $registrosRelatorio.removeChild( $registrosRelatorio.firstChild );
    }
}

/* - INCREMENTOS - */

const limparCampos = () => {
    $nome.value = "";
    $placa.value = "";
}

const cadastroSucesso = () => {
    if ($adicionarVeiculo.textContent == "Atualizar"){
        alert("Atualizado com Sucesso!");
    }else {
        alert("Cadastrado com Sucesso!");
    }
}

const validarCampos = () => {
    if($placa.value.length == 8){
        const $campos = Array.from(document.querySelectorAll(".adicionarVeiculo input"));

        const camposVazios = $campos.filter((campo) => campo.value == false).map(campos => campos.classList.add("erroCampo"));

        return camposVazios.length == 0;
    }
}

const limitarCaracteres = () => {
    $placa.maxLength = 8;
}

/* - CRIAR LINHA NA TABELA VEICULO - */

const calcularValorAPagar = () => {
    
    lerBDPrecos();
    
    let valor = 0;
    const ultimoIndicePreco = bancoPreco.length - 1;
    const ultimoIndice = banco.length - 1;
    var data = new Date;
    
    const valorPrimeiraHora = bancoPreco[ultimoIndicePreco].primeiroValor;
    const valorDemaisHoras = bancoPreco[ultimoIndicePreco].valorDemais;
    const tempoEntrada = banco[ultimoIndice].millsEntrada;
    const tempoSaida = banco[ultimoIndice].millsSaida;
    
    let diferencaTempo = tempoEntrada - tempoSaida;
    
    let horas = Math.trunc(diferencaTempo / 1000 / 60 / 60); 
    let minutos = Math.trunc(diferencaTempo / 1000 / 60);
    
    if(horas > 0) {
        if (minutos > horas * 60) {
            horas+= 1;
        }
    }
    
    if(horas != 0 || horas == 0) {
        valor = horas > 1 ? valorPrimeiraHora + ((horas - 1) * valorDemaisHoras) : valorPrimeiraHora;
    }
    
    return valor;
}

const exibirTabela = () => {
    
    lerBDVeiculos();
    limparTabela();
    
    banco.map ( registro => {

        $tr = document.createElement("tr");
        
        if (registro.horarioSaida == ""){
            $tr.innerHTML = `
                <td>${registro.codigo}</td>
                <td>${registro.nome}</td>
                <td>${registro.placa}</td>
                <td>${registro.data}</td>
                <td>${registro.horario}</td>
                <td class=acoes-tabela>
                    <button class=botao id=comp-${registro.codigo}>Comp</button>
                    <button class=botao id=editar-${registro.codigo}>Editar</button>
                    <button class=botao id=saida-${registro.codigo}>Saída</button>
                </td>
            `
            $registros.insertBefore ($tr, null);
        }
    })
}

const exibirRelatorio = () => {
    
    lerBDVeiculos();
    limparTabela();
    
    banco.map ( registro => {
        if (registro.horarioSaida != ""){
            $tr = document.createElement("tr");
            $tr.innerHTML = `
                <td>${registro.nome}</td>
                <td>${registro.data} ${registro.horario}</td>
                <td>${registro.dataSaida} ${registro.horarioSaida}</td>
                <td>R$ ${calcularValorAPagar()},00</td>
            `
            $registrosRelatorio.insertBefore( $tr, null);
        }
    })
}

/* - CRUD - */

/* ADICIONAR */
const adicionarRegistro = ( registro ) => {

    const ultimoIndice = banco.length - 1;
    let novoCodigo;
    if(ultimoIndice == -1) {
        novoCodigo = 1;
    } else {
        novoCodigo = parseInt(banco[ultimoIndice].codigo) + 1;
    }

    registro.codigo = novoCodigo.toString();

    banco.push ( registro );
    
    gravarBDVeiculos();
}

const adicionarRegistroPreco = ( registroPreco ) => {
    
    const ultimoIndicePreco = bancoPreco.length - 1;
    let novoCodigoPreco;
    if(ultimoIndicePreco == -1) {
        novoCodigoPreco = 1;
    } else {
        novoCodigoPreco = parseInt(bancoPreco[ultimoIndicePreco].codigoPreco) + 1;
    }

    registroPreco.codigoPreco = novoCodigoPreco.toString();

    bancoPreco.push ( registroPreco );
    
    gravarBDPrecos();
}

/* REMOVER */
const removerRegistro = ( codigo ) => {
    
    const indice = banco.findIndex( registro => registro.codigo == codigo);
    banco.splice(indice, 1);
    gravarBDVeiculos();
} 

/* ATUALIZAR */
const atualizarRegistro = (codigo, registro) => {
    
    const indice = banco.findIndex( registro => registro.codigo == codigo);
    banco.splice(indice, 1, registro)
    gravarBDVeiculos()
}

/* LER */
const lerRegistro = codigo => {
    return banco.filter(rs => rs.codigo == codigo);
}

/* - DADOS - */

const salvarVeiculo = () => {
    
    var data = new Date;
    var mills = data.getTime();
    
    var dataAtual = () => {
        
        var dataAtual;
        var dia = ("00" + data.getDate()).slice(-2);
        var mesIndex = data.getMonth() + 1;
        var mes = ("00" + mesIndex).slice(-2);
        var ano = data.getFullYear();
        
        return dataAtual = dia + "/" + mes + "/" + ano;
    }
    
    var horarioAtual = () => {  
        
        var horaAtual;
        var hora = ("00" + data.getHours()).slice(-2);
        var minuto = ("00" + data.getMinutes()).slice(-2);
        var segundo = ("00" + data.getSeconds()).slice(-2);

        return horaAtual = hora + ":" + minuto + ":" + segundo;
    }
    
    const novoRegistro = {
        nome: $nome.value,
        placa: $placa.value,
        data: dataAtual(),
        horario: horarioAtual(),
        horarioSaida: "",
        millsEntrada: mills
    }
    
    if ($adicionarVeiculo.textContent == "Adicionar"){
        
        adicionarRegistro (novoRegistro);
        
    }else if ($adicionarVeiculo.textContent == "Atualizar"){
           
        novoRegistro.codigo = codigoAtual;
        
        const novoRegistroAtualizado = {
            codigo: codigoAtual,
            nome: $nome.value,
            placa: $placa.value,
            data: banco[codigoAtual-1].data,
            horario: banco[codigoAtual-1].horario,
            horarioSaida: "",
            millsEntrada: banco[codigoAtual-1].millsEntrada   
        }

        atualizarRegistro (codigoAtual, novoRegistroAtualizado);
    }
}

const adicionarPreco = () => {
    
    const novoPreco = {
        primeiroValor: $btnHora.value,
        valorDemais: $btnDemaishoras.value
    }
    
    adicionarRegistroPreco(novoPreco);
    
}

salvarPrecos = () => {
    adicionarPreco();
    alert("Preço atualizado com sucesso!");
    fecharModal($modalPrecos);
}



adicionarVeiculo = () => {
    
    if(validarCampos()){
        if(validarPlaca($placa.value)){
            salvarVeiculo();
            exibirTabela();
            limparCampos();
            if($adicionarVeiculo.textContent == "Atualizar"){
                alert("Atualizado com Sucesso!");
                $adicionarVeiculo.textContent = "Adicionar";
            }else{
                alert("Cadastrado com Sucesso!");
            }
        }else{
            alert("Por favor, insira uma placa no formato XXX-0000");
        }
    }else if($nome.value.length >= 1 && $placa.value.lenght != 8){
        alert("Por favor, insira uma placa valida!");
    }else if($nome.value.length == 0){
        alert("Por favor, insira um nome!");
    }else{
        alert("Nome e/ou Placa não inserido");
    }
}


const identificarAcao = ( eventoBotao ) => {
    
     const [ acao, codigo ] = eventoBotao.target.id.split ("-")
     const dados = lerRegistro (codigo);
     
     if (acao == "comp"){
         
         abrirModal($modalComp);
         $txtNome.value = dados[0].nome;
         $txtPlaca.value = dados[0].placa;
         $txtData.value = dados[0].data;
         $txtHora.value = dados[0].horario;
         
     }else if (acao == "editar"){
         
         $nome.value = dados[0].nome;
         $placa.value = dados[0].placa;
         codigoAtual = dados[0].codigo;
         $adicionarVeiculo.textContent = "Atualizar";
         
     }else if (acao == "saida"){
         
        lerBDPrecos();
        limparTabelaRelatorio();
         
        if(bancoPreco.length != 0){
            var data = new Date;
            var mills = data.getTime();

            var dataAtual = () => {

                var dataAtual;
                var dia = ("00" + data.getDate()).slice(-2);
                var mesIndex = data.getMonth() + 1;
                var mes = ("00" + mesIndex).slice(-2);
                var ano = data.getFullYear();

                return dataAtual = dia + "/" + mes + "/" + ano;
            }

            var horarioAtual = () => {  

                var horaAtual;
                var hora = ("00" + data.getHours()).slice(-2);
                var minuto = ("00" + data.getMinutes()).slice(-2);
                var segundo = ("00" + data.getSeconds()).slice(-2);

                return horaAtual = hora + ":" + minuto + ":" + segundo;
            }

            const registroSaida = {
                nome: dados[0].nome,
                placa: dados[0].placa,
                data: dados[0].data,
                horario: dados[0].horario,
                horarioSaida: horarioAtual(),
                dataSaida: dataAtual(),
                millsEntrada: dados[0].millsEntrada,
                millsSaida: mills
            }

            removerRegistro(codigo);
            adicionarRegistro(registroSaida);
        }else{
            alert("Por favor, adicione um Preço!")
        }
        exibirRelatorio();
    }
    exibirTabela();
}

/* - MODAL - */

modalPrecos = () => {
    abrirModal($modalPrecos);
}

fecharModalPrecos = () => {
    fecharModal($modalPrecos);
}

fecharModalComp = () => {
    fecharModal ($modalComp);
}

imprimirComp = () => {
    alert("Impresso com Sucesso!")
    fecharModal($modalComp);
}

abrirRelatorio = () => {
    abrirModal($modalRelatorio);
}

saidaRelatorio = () => {
    fecharModal($modalRelatorio);
}

/* - CHAMANDO FUNÇÕES - */

limitarCaracteres();
exibirRelatorio();
exibirTabela();
lerBDPrecos();


$nome.addEventListener('keyup', () => $nome.value = filtrarTexto($nome.value));
$placa.addEventListener('keyup', () => $placa.value = mascaraPlaca ($placa.value));
$adicionarVeiculo.addEventListener('click', adicionarVeiculo);
$registros.addEventListener('click', identificarAcao);
$precos.addEventListener('click', modalPrecos);
$btnHora.addEventListener('keyup', () => $btnHora.value = filtrarNumero($btnHora.value));
$btnDemaishoras.addEventListener('keyup', () => $btnDemaishoras.value = filtrarNumero($btnDemaishoras.value));

$btnFecharPreco.addEventListener('click', fecharModalPrecos);
$btnFecharComp.addEventListener('click', fecharModalComp);
$btnSalvarPreco.addEventListener('click', salvarPrecos);
$btnImprimir.addEventListener('click', imprimirComp);
$btnRelatorio.addEventListener('click', abrirRelatorio);
$btnSairRelatoio.addEventListener('click', saidaRelatorio);
