var complete_data = null;
var meuGrafico = null;

function carrega () {
  //desenha grafico
    d3.csv("dados/recortes_ibope_2014.csv", function (data) {
        window.complete_data = data;
        //atualiza_recorte("escolaridade","medio");
        cria_grafico();
   });
}

function cria_grafico() {
    var data = dimple.filterData(dimple.filterData(window.complete_data, "recorte", "total"), "variavel", "total");
    var myChart = new dimple.chart(svg,data);
    myChart.setBounds(45,20,725,390);
    var x = myChart.addTimeAxis("x","data","%Y-%m-%d","%d/%m");
    x.addOrderRule("");
    x.title = "";
    x.overrideMin = new Date("2014-03-16"); //TODO: pegar a menor data usando a d3 e lendo a base de dados e subtrair 1
    x.overrideMax = new Date("2014-05-20"); //TODO: pegar a maior data usando a d3 e lendo a base de dados e somar 1
    //x.timeInterval = 4;
    myChart.addMeasureAxis("y","intencao");

    myChart.addSeries("candidato",dimple.plot.line);
    s = myChart.addSeries("candidato", dimple.plot.bubble);
    legend = myChart.addLegend(720, 2, 195, 220, "right");
    myChart.assignColor("Aécio Neves","#1C4587");
    myChart.assignColor("Dilma Rousseff","#CC0000");
    myChart.assignColor("Eduardo Campos","#E69138");
    myChart.assignColor("Pastor Everaldo","#6AA84F");
    myChart.assignColor("Não sabe","#2E2B2D");
    myChart.assignColor("Branco e Nulo","#C9C9C9");

    //arruma ordem da legenda
    legend._getEntries = function () {
        var orderedValues = ["Dilma Rousseff", "Aécio Neves", "Eduardo Campos","Pastor Everaldo","Outros","Branco e Nulo","Não sabe"];
        var entries = [];
        orderedValues.forEach(function (v) {
            entries.push(
            {
                    key: v,
                    fill: myChart.getColor(v).fill,
                    stroke: myChart.getColor(v).stroke,
                    opacity: myChart.getColor(v).opacity,
                    series: s,
                    aggField: [v]
                }
            );
        }, this);

        return entries;
    };

    //arruma as fontes
    //legend.fontFamily = "Arial";
    legend.fontSize = "82%";

    //x.fontFamily = "Arial";
    x.fontSize = "95%";

    y = myChart.axes[1]

    //y.fontFamily = "Arial";
    y.fontSize = "95%";
    y.title = "Intenção de Voto"

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
    window.chart=myChart;
}

function atualiza_grafico(argumentos) {
    // argumentos é um dicionário com as seguintes variáveis:
    // pergunta, recorte, variavel, texto_pergunta, texto_recorte

    // Definindo valor padrão para as variáveis, caso nenhum seja passado.
    var pergunta = argumentos.pergunta || $(".botao-selecao-pergunta").data("pergunta") || "intencao_de_voto";
        recorte = argumentos.recorte || $(".botao-selecao-recorte").data("recorte") || "total",
        variavel = argumentos.variavel || $(".botao-selecao-recorte").data("variavel") || "total",
        texto_pergunta = argumentos.texto_pergunta || $(".botao-selecao-pergunta").html() || "Intenção de Votos",
        texto_recorte = argumentos.texto_recorte || $(".botao-selecao-recorte").html() || "Total do eleitorado";

    var data = dimple.filterData(window.complete_data, "pergunta", pergunta); // Filtrando Pergunta
    data = dimple.filterData(data, "recorte", recorte); // Filtrando Recorte
    data = dimple.filterData(data, "variavel", variavel); //Filtrando variável do recorte

    chart.data = data; // Definindo novo conjunto de dados do gráfico

    chart.draw(1000); // Desenhando novo gráfico com animação durando 1000 ms

    $(".botao-selecao-pergunta").html(texto_pergunta); // Alterando texto do botão de pergunta
    $(".botao-selecao-recorte").html(texto_recorte); // Alterando texto do botão de recorte
}

function atualiza_recorte(recorte, variavel, texto){
    atualiza_grafico({recorte: recorte, variavel: variavel, texto_recorte: texto});
}

function atualiza_pergunta(pergunta,texto){
    atualiza_grafico({pergunta: pergunta, texto_pergunta: texto})
}

$(document).ready(function(){
    window.svg = dimple.newSvg("#grafico", 950, 490);
    carrega();
});
