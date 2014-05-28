var complete_data = null;
var meuGrafico = null;

function carrega () {
  //desenha grafico
    d3.csv("dados/ibope_2014.csv", function (data) {
        window.complete_data = data;
        //atualiza_recorte("escolaridade","medio");
        cria_grafico();
   });
}

function cria_grafico() {
    var data = dimple.filterData(dimple.filterData(window.complete_data, "recorte", "total"),"cat_dado","intencao_estimulada");
    var myChart = new dimple.chart(svg,data);
    myChart.setBounds(45,20,725,390);
    var x = myChart.addTimeAxis("x","data","%Y-%m-%d","%d/%m");
    x.addOrderRule("");
    x.title = "";
    x.overrideMin = new Date("2014-03-16"); //TODO: pegar a menor data usando a d3 e lendo a base de dados e subtrair 1
    x.overrideMax = new Date("2014-05-20"); //TODO: pegar a maior data usando a d3 e lendo a base de dados e somar 1
    //x.timeInterval = 4;
    myChart.addMeasureAxis("y","variavel");

    myChart.addSeries("dado",dimple.plot.line);
    s = myChart.addSeries("dado", dimple.plot.bubble);
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

function limpar_legendas() {
    $('*[class^="dimple-legend"]').remove()
}

function atualiza_grafico(argumentos) {
    mudanca = (argumentos.pergunta) ? "pergunta" : "resposta";

    // argumentos é um dicionário com as seguintes variáveis:
    // pergunta, recorte, variavel, texto_pergunta, texto_recorte

    // Definindo valor padrão para as variáveis, caso nenhum seja passado.
    var pergunta = argumentos.pergunta || $(".botao-selecao-pergunta").data("pergunta") || "intencao_estimulada";
        recorte = argumentos.recorte || $(".botao-selecao-recorte").data("recorte") || "total",
        texto_pergunta = argumentos.texto_pergunta || $(".botao-selecao-pergunta").html() || "Intenção de Voto Estimulada",
        texto_recorte = argumentos.texto_recorte || $(".botao-selecao-recorte").html() || "Total do eleitorado";
    
    // faz com que o recorte vire total se uma nova pergunta for selecionada
    if (mudanca == "pergunta") {
        recorte = "total"
        texto_recorte = "Total do eleitorado"
    // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta
        $(".botao-selecao-pergunta").data("pergunta",pergunta) 
    }
    
    // filtra os dados de acordo com a pergunta e o recorte atuais
    var data = window.complete_data
    data = dimple.filterData(data, "cat_dado", pergunta); 
    data = dimple.filterData(data, "recorte", recorte); 
    
    $(".botao-selecao-pergunta").html(texto_pergunta); // Alterando texto do botão de pergunta
    $(".botao-selecao-recorte").html(texto_recorte); // Alterando texto do botão de recorte
    
    console.log(argumentos)
    
    chart.data = data; // Definindo novo conjunto de dados do gráfico
    chart.legends = []
    limpar_legendas()
    
    legend = chart.addLegend(720, 2, 195, 220, "right");

    chart.draw(1000); // Desenhando novo gráfico com animação durando 1000 ms

}

function atualiza_recorte(cat_recorte, recorte, texto){
    atualiza_grafico({cat_recorte:cat_recorte, recorte: recorte, texto_recorte: texto});
}

function atualiza_pergunta(pergunta,texto){
    atualiza_grafico({pergunta: pergunta, texto_pergunta: texto})
}

$(document).ready(function(){
    window.svg = dimple.newSvg("#grafico", 950, 490);
    carrega();
});
