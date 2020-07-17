var tempoInicial = $("#tempo-digitacao").text();
var campo = $(".campo-digitacao");

/*
$(document).ready(function () {     //Essa função serve para que assim que a pagina é carregada, as funções são inicializadas
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    $("#botao-reiniciar").click(reiniciaJogo); //os eventos mais comuns do Javascript possuem funções simplificadas no Jquery o .click, .focus e etc.
});
*/


//função que inicializa todas as funções assim que a página é carregada
$(function () {                //essa é uma versão simplificada(atalho) para a função $(document).ready comentada acima
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    $("#botao-reiniciar").click(reiniciaJogo);
    inicializaMarcadores();
    atualizaPlacar();
    $("#usuarios").selectize({
        create: true,
        sortField: 'text'
    });
    $('.tooltip').tooltipster({
        trigger: 'custom'
    });
});

function atualizaTempoInicial(tempo){
    tempoInicial = tempo;
    $("#tempo-digitacao").text(tempo);
}


//conta quantas palavras tem na frase
function atualizaTamanhoFrase() {
    var frase = $(".frase").text();  //$ é o seletor do Jquery, selecionamos a frase e a função .text() devolve seu conteudo de texto
    var numPalavras = frase.split(" ").length; //quebra a frase em pedaços que são definidos pelo espaço
    var tamanhoFrase = $("#tamanho-frase");
    tamanhoFrase.text(numPalavras);
}


function inicializaContadores() {
    campo.on("input", function () {  //o evento de input escuta a entrada de dados do usuario nesse caso ele atualiza nosso campo automaticamente enquanto o usuario digita
        var conteudo = campo.val(); //.val() acessa o valor dos inputs do usuario

        var qtdPalavras = conteudo.split(/\S+/).length - 1; // /\S+/ -> e uma expressão regular que busca por todos espaços em branco, ajuda tornar nosso codigo mais preciso
        $("#contador-palavras").text(qtdPalavras);

        var qtdCaracteres = conteudo.length;
        $("#contador-caracteres").text(qtdCaracteres);

    });
}


function inicializaCronometro() {
    campo.one("focus", function () {   //o evento focus detecta quando um campo ganha foco, seja ele através do click ou do tab, etc. e a função .one só funciona na primeira vez que o evento é chamado
        var tempoRestante = $("#tempo-digitacao").text();
        $("#botao-reiniciar").attr("disabled", true);
        var cronometroID = setInterval(function () { //a função setInterval realiza o conteudo da function de tempo em tempo, como passamos 1000ms como parametro ele executa a cada 1s
            tempoRestante--;
            $("#tempo-digitacao").text(tempoRestante);

            if (tempoRestante < 1) {
                clearInterval(cronometroID);
                finalizaJogo();
            }
        }, 1000);
    });
}

function finalizaJogo() {
    campo.attr("disabled", true); //attr acessa um atributo no html            
    $("#botao-reiniciar").attr("disabled", false);
    campo.toggleClass("campo-desativado");  //adiciona a classe que deixa o campo cinza no css quando acaba o tempo de digitação
    inserePlacar(); //chama a função que insere no placar
}


function inicializaMarcadores() {
    campo.on("input", function () {
        var frase = $(".frase").text();
        var digitado = campo.val();
        var comparavel = frase.substr(0, digitado.length); //função substr pega um pedaço da frase e compara com o que digitamos

        //se o usuario estiver acertando o conteudo da frase pinta de verde a borda se estiver errando, pinta de vermelho
        if (digitado == comparavel) {
            campo.addClass("borda-verde");
            campo.removeClass("borda-vermelha");
        } else {
            campo.addClass("borda-vermelha");
            campo.removeClass("borda-verde");
        }

    });
}

function reiniciaJogo() {
    campo.attr("disabled", false); //reativa o campo de digitação quando o jogo é reiniciado
    campo.val(""); //apaga o que tem digitado no campo
    $("#contador-palavras").text("0"); //reseta o contador de palavras
    $("#contador-caracteres").text("0"); //reseta o contador de caracteres
    $("#tempo-digitacao").text(tempoInicial); //reseta o tempo
    inicializaCronometro();
    campo.toggleClass("campo-desativado");  //remove a classe que deixa o campo cinza
    campo.removeClass("borda-verde"); //remove a classe do css que deixa a borda verde
    campo.removeClass("borda-vermelha"); //remove a classe do css que deixa a borda vermelha
}






