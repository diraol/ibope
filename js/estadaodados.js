var complete_data = null;
var meuGrafico = null;
new dimple.color("")

function carrega () {
  //desenha grafico
    d3.csv("dados/ibope_2014.csv", function (data) {
        window.complete_data = data;
        //atualiza_recorte("escolaridade","medio");
        cria_grafico();
   });
}

function cria_grafico() {
    var data = dimple.filterData(window.complete_data, "cat_recorte", "total");
        data = dimple.filterData(data, "recorte", "total");
        data = dimple.filterData(data, "cat_pergunta", "intencao_estimulada");
    var myChart = new dimple.chart(svg,data);
    window.chart=myChart;
    myChart.setBounds(45,20,725,390);
    var x = myChart.addTimeAxis("x","data","%Y-%m-%d","%d/%m");
    x.addOrderRule("");
    x.title = "";
    x.overrideMin = new Date("2014-03-16"); //TODO: pegar a menor data usando a d3 e lendo a base de dados e subtrair 1
    x.overrideMax = new Date("2014-05-20"); //TODO: pegar a maior data usando a d3 e lendo a base de dados e somar 1
    //x.timeInterval = 4;
    myChart.addMeasureAxis("y","valor");

    myChart.addSeries("dado",dimple.plot.line);
    s = myChart.addSeries("dado", dimple.plot.bubble);
    legend = myChart.addLegend(720, 2, 195, 220, "right");
    myChart = configuraCores(myChart,"intencao_estimulada");
    
    //arruma ordem da legenda
    legend._getEntries = function () { return ordemLegenda("intencao_estimulada"); };

    //arruma as fontes
    //legend.fontFamily = "Arial";
    legend.fontSize = "82%";

    //x.fontFamily = "Arial";
    x.fontSize = "95%";

    y = myChart.axes[1]

    //y.fontFamily = "Arial";
    y.fontSize = "95%";
    y.title = "Intenção de Voto (%)"

    //customiza a tooltip
    s.getTooltipText = function (e) {
        return [
            e.aggField[0]+": "+ e.y
        ];
    };

    myChart.draw();

    x.shapes.selectAll("text").attr("transform",
        function (d) {
            //return d3.select(this).attr("transform") + " translate(-14, 38) rotate(-90)";
            return d3.select(this).attr("transform") + " translate(0, 20) rotate(-45)";
        });
}

function ordemLegenda(pergunta) {
    var orderedValues = []
    if (pergunta.indexOf("intencao_estimulada") != -1) {
        orderedValues = ["Dilma Rousseff", "Aécio Neves", "Eduardo Campos","Pastor Everaldo","Outros","Branco e Nulo","Não sabe"];
    } else if (pergunta.indexOf("intencao_espontanea") != -1) {
        orderedValues = ["Dilma Rousseff", "Aécio Neves", "Eduardo Campos","Pastor Everaldo","Lula","Marina Silva","Outros","Branco e Nulo","Não sabe"];
    } else if (pergunta.indexOf("rejeicao") != -1) {
        orderedValues = ["Dilma Rousseff", "Aécio Neves", "Eduardo Campos","Pastor Everaldo"];
    } else if (pergunta.indexOf("turno_aecio") != -1) {
        orderedValues = ["Dilma Rousseff", "Aécio Neves","Branco e Nulo","Não sabe"];
    } else if (pergunta.indexOf("turno_campos") != -1) {
        orderedValues = ["Dilma Rousseff", "Eduardo Campos","Branco e Nulo","Não sabe"];
    } else if (pergunta.indexOf("avaliacao") != -1) {
        orderedValues = ["Ótimo ou bom","Regular","Ruim ou péssimo","NS/NR*"]
    } else if (pergunta.indexOf("interesse")!= -1) {
        orderedValues = ["Tem muito interesse","Tem médio interesse","Não tem interesse","NS/NR*"]
    } else if (pergunta.indexOf("aprova")!= -1) {
        orderedValues = ["Aprova","Desaprova","NS/NR*"]
    } else if (pergunta.indexOf("desejo")!= -1) {
        orderedValues = ["Quer mudança","Quer continuidade","NS/NR*"]
    }
    
    console.log(pergunta)
    var entries = [];
    orderedValues.forEach(function (v) {
        entries.push(
        {
                key: v,
                fill: window.chart.getColor(v).fill,
                stroke: window.chart.getColor(v).stroke,
                opacity: window.chart.getColor(v).opacity,
                series: s,
                aggField: [v]
            }
        );
    }, this);
    return entries
}
function configuraCores(grafico, pergunta) {
    if (pergunta.indexOf("intencao") != -1 || pergunta.indexOf("rejeicao") != -1 || pergunta.indexOf("turno") != -1) {
        grafico.assignColor("Aécio Neves","#1C4587");
        grafico.assignColor("Dilma Rousseff","#CC0000");
        grafico.assignColor("Eduardo Campos","#E69138");
        grafico.assignColor("Pastor Everaldo","#6AA84F");
        grafico.assignColor("Não sabe","#2E2B2D");
        grafico.assignColor("Branco e Nulo","#C9C9C9");
    } else if (pergunta.indexOf("avalia") != -1 || pergunta.indexOf("aprova") != -1 ) {
        grafico.defaultColors = [
            new dimple.color("#3C3C3C"),
            new dimple.color("#5C5C5C"),
            new dimple.color("#8C8C8C"),
            new dimple.color("#ACACAC"),
            new dimple.color("#CCCCCC"),
            new dimple.color("#000000")
            ]
    }else if (pergunta.indexOf("interesse") != -1) {
         grafico.defaultColors = [
            new dimple.color("#001C44"),
            new dimple.color("#002159"),
            new dimple.color("#0A4F87"),
            new dimple.color("#1E5DAE"),
            new dimple.color("#D3CAD3")
         ]
    } else {
         grafico.defaultColors = [
            new dimple.color("#6C2817"),
            new dimple.color("#BA7E50"),
            new dimple.color("#F3AA4B"),
            new dimple.color("#EDF1DB"),
            new dimple.color("#A9C4BB")
         ]
    }
    return grafico;
}


function limpar_legendas() {
    $('*[class^="dimple-legend"]').remove()
}

function atualiza_grafico(argumentos) {
    // argumentos é um dicionário com as seguintes variáveis:
    // pergunta, recorte, variavel, texto_pergunta, texto_recorte


    // Definindo valor padrão para as variáveis, caso nenhum seja passado.
    var pergunta = argumentos.pergunta || $(".botao-selecao-pergunta").data("pergunta") || "intencao_estimulada",
        cat_recorte = argumentos.cat_recorte || $(".botao-selecao-recorte").data("catRecorte") || "total",
        recorte = argumentos.recorte || $(".botao-selecao-recorte").data("recorte") || "total",
        texto_pergunta = argumentos.texto_pergunta || $(".botao-selecao-pergunta").html() || "Intenção de Voto Estimulada",
        texto_recorte = argumentos.texto_recorte || $(".botao-selecao-recorte").html() || "Total do eleitorado";
    //Escondendo opções de recorte que são incompatíveis com perguntas
    if ( pergunta == "desejo_mudanca" ){
        $(".rec-avalia").show();
        $(".rec-muda").hide();
        if (cat_recorte == "desejo_mudanca" ) {
            cat_recorte = "total";
            recorte = "total";
            texto_recorte = "Total do Eleitorado";
        }
    } else if (pergunta == "avaliacao_governo") {
        $(".rec-muda").show();
        $(".rec-avalia").hide();
        if (cat_recorte == "avaliacao_governo") {
            cat_recorte = "total";
            recorte = "total";
            texto_recorte = "Total do Eleitorado";
        }
    } else {
        $(".rec-muda").show();
        $(".rec-avalia").show();
    }

    // filtra os dados de acordo com a pergunta e o recorte atuais
    var data = dimple.filterData(window.complete_data,"cat_recorte", cat_recorte);
        data = dimple.filterData(data, "recorte", recorte);
        data = dimple.filterData(data, "cat_pergunta", pergunta);

    $(".botao-selecao-pergunta").html(texto_pergunta); // Alterando texto do botão de pergunta
    $(".botao-selecao-recorte").html(texto_recorte); // Alterando texto do botão de recorte
    $(".botao-selecao-pergunta").data("pergunta",pergunta); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta
    $(".botao-selecao-recorte").data("catRecorte",cat_recorte); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta
    $(".botao-selecao-recorte").data("recorte",recorte); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta

    chart.data = data; // Definindo novo conjunto de dados do gráfico
        
    //arruma as legendas
    chart.legends = [];
    limpar_legendas(); //limpa as antigas
    legend = chart.addLegend(720, 2, 195, 220, "right"); //adiciona as novas
    legend._getEntries = function () { return ordemLegenda(pergunta); }; //arruma a ordem
    chart = configuraCores(chart, pergunta); //aruma as cores

    y.title = texto_pergunta + " (%)";

    chart.draw(1000); // Desenhando novo gráfico com animação durando 1000 ms
}

function atualiza_recorte(cat_recorte, recorte, texto){
        atualiza_grafico({cat_recorte: cat_recorte, recorte: recorte, texto_recorte: texto});
}

function atualiza_pergunta(pergunta, texto){
    atualiza_grafico({pergunta: pergunta, texto_pergunta: texto})
}

$(document).ready(function(){
    window.svg = dimple.newSvg("#grafico", 950, 490);
    carrega();
});
