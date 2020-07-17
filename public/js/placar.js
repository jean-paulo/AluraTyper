$("#botao-placar").click(mostraPlacar);
$("#botao-sync").click(sincronizaPlacar);


function inserePlacar() {
    var corpoTabela = $(".placar").find("tbody"); // a função .find procura nos filhos de um elemento portanto estamos procurando por tbody dentro do placar
    var usuario = $('#usuarios').val();
    var numPalavras = $("#contador-palavras").text();

    //cria a tr que vamos inserir na tabela placar
    var linha = novaLinha(usuario, numPalavras);
    linha.find(".botao-remover").click(removeLinha);

    corpoTabela.prepend(linha); //adiciona no inicio da tabela o conteúdo da variavel linha
    $(".placar").slideDown(500);
    scrollPlacar();
}

function scrollPlacar() {
    var posicaoPlacar = $(".placar").offset().top;
    $("html").animate(
        {
            scrollTop: posicaoPlacar + "px"
        }, 1000);
}


//função que monta a tr
function novaLinha(usuario, palavras) {
    var linha = $("<tr>");  //cria um elemento html com Jquery
    var colunaUsuario = $("<td>").text(usuario);
    var colunaPalavras = $("<td>").text(palavras);
    var colunaRemover = $("<td>");
    var link = $("<a>").addClass("botao-remover").attr("href", "#"); //attr adiciona um atributo
    var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");

    link.append(icone);
    colunaRemover.append(link);
    linha.append(colunaUsuario);
    linha.append(colunaPalavras);
    linha.append(colunaRemover);

    return linha;
}

//programando a ação do botão remover do placar
function removeLinha() {
    event.preventDefault(); //previne o comportamento padrão do evento
    var linha = $(this).parent().parent();
    linha.fadeOut(1000); //acessa o pai do pai do botão, ou seja, a tr. E o faz desaparecer usando o fadeOut, porém o elemento não é removido do html, ele só fica display:none

    //espera 1s e depois remove, esperando a animação do fadeOut terminar
    setTimeout(function () {
        linha.remove(); //remove o elemento da pagina
    }, 1000);

}


function mostraPlacar() {
    $(".placar").stop().slideToggle(600);  //mostra ou esconde o elemento selecionado
}

function sincronizaPlacar() {
    var placar = [];
    var linhas = $("tbody>tr");           //seleciona todas as tr's que são filhas de tbody

    linhas.each(function () {                 //tem a mesma função do forEach() do Javascript, ou seja, executa uma função para cada elemento da variavel linhas
        var usuario = $(this).find("td:nth-child(1)").text();    //usa o seletor avançado do css nth-child que pega o primeiro filho da td
        var palavras = $(this).find("td:nth-child(2)").text();   //faz a mesma coisa que a variavel usuario, porem pega o segundo filho da td

        var score = {
            usuario: usuario,
            pontos: palavras,
        };

        placar.push(score);
    });

    //para passar como parametro para o post Só pode ser string ou Objeto Js, portanto temos que transformar nosso placar em um objeto
    var dados = {
        placar: placar
    }

    $.post("http://localhost:3000/placar", dados, function () {
        console.log("Salvou o placar no servidor");
        $(".tooltip").tooltipster("open").tooltipster("content", "Sucesso ao sincronizar");
    })
    .fail(function(){
        $(".tooltip").tooltipster("open").tooltipster("content", "Falha ao sincronizar");
    })
    .always(function () {
        setTimeout(function () {
            $(".tooltip").tooltipster("close");
        }, 1200);
    });
}

function atualizaPlacar() {

    $.get("http://localhost:3000/placar", function (data) {
        $(data).each(function () {
            var linha = novaLinha(this.usuario, this.pontos);
            linha.find(".botao-remover").click(removeLinha);
            $("tbody").append(linha);
        });
    });

}