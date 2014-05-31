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

function atualiza_background() {

    d3.select("#background_plot_area")
        .attr("width", dimple._parentWidth(svg.node()) - 225 )
        .attr("height", dimple._parentHeight(svg.node()) - 100)

}

function cria_grafico() {

    //Retângulo de fundo (background) do gráfico
    svg.append("rect")
        .attr("id", "background_plot_area")
        .attr("x", 60)
        .attr("y", 30)
        .attr("width", dimple._parentWidth(svg.node()) - 225 )
        .attr("height", dimple._parentHeight(svg.node()) - 100)
        .style("fill", "#fff");

    var data = dimple.filterData(window.complete_data, "cat_pergunta", "intencao_estimulada"); //filtra pergunta
        data = dimple.filterData(data, "cat_recorte", "total"); //filtra categoria do recorte
    var maximo_y = d3.max(data, function(d){ return parseInt(d.valor);}); //encontra maior valor de uma determianda categoria de recorte
        data = dimple.filterData(data, "recorte", "total"); //filtra recorte na categoria

    var myChart = new dimple.chart(svg,data);
    window.chart=myChart;

    myChart.setBounds(45,20,"85%","80%");
    myChart.setMargins("60px","30px","165px","70px");

    var x = myChart.addTimeAxis("x","data","%Y-%m-%d","%d/%m");
    x.addOrderRule("");
    x.title = "";
    x.overrideMin = new Date("2014-03-16"); //TODO: pegar a menor data usando a d3 e lendo a base de dados e subtrair 1
    x.overrideMax = new Date("2014-05-20"); //TODO: pegar a maior data usando a d3 e lendo a base de dados e somar 1
    //x.timeInterval = 4;
    myChart.addMeasureAxis("y","valor");

    linha = myChart.addSeries("dado",dimple.plot.line);

    linha.lineWeight = 4
    linha.lineMarkers = true;

    legend = myChart.addLegend(-200, 30, 195, 220, "right");
    myChart = configuraCores(myChart, "intencao_estimulada");

    //arruma ordem da legenda
    legend._getEntries = function () { return ordemLegenda("intencao_estimulada"); };

    //arruma as fontes
    //legend.fontFamily = "Arial";
    legend.fontSize = "82%";

    //x.fontFamily = "Arial";
    x.fontSize = "95%";

    y = myChart.axes[1]
    y.overrideMax = maximo_y;

    //y.fontFamily = "Arial";
    y.fontSize = "95%";
    y.title = "Intenção de Voto (%)"

    //customiza a tooltip
    linha.getTooltipText = function (e) {
        return [
            e.aggField[0]+": "+ e.y
        ];
    };

    myChart.draw();

    //conserta o nome do mês
    nomeMes()

    //translada labels do eixo x
    x.shapes.selectAll("text").attr("transform",
        function (d) {
            //return d3.select(this).attr("transform") + " translate(-14, 38) rotate(-90)";
            return d3.select(this).attr("transform") + " translate(0, 5)";
        });

}

function ordemLegenda(pergunta) {
    var orderedValues = []
    if (pergunta.indexOf("intencao_estimulada") != -1) {
        orderedValues = ["Dilma Rousseff", "Aécio Neves", "Eduardo Campos","Pastor Everaldo","Outros","Branco e Nulo","NS/NR*"];
    } else if (pergunta.indexOf("intencao_espontanea") != -1) {
        orderedValues = ["Dilma Rousseff", "Aécio Neves", "Eduardo Campos","Pastor Everaldo","Lula","Marina Silva","Outros","Branco e Nulo","NS/NR*"];
    } else if (pergunta.indexOf("rejeicao") != -1) {
        orderedValues = ["Dilma Rousseff", "Aécio Neves", "Eduardo Campos","Pastor Everaldo"];
    } else if (pergunta.indexOf("turno_aecio") != -1) {
        orderedValues = ["Dilma Rousseff", "Aécio Neves","Branco e Nulo","NS/NR*"];
    } else if (pergunta.indexOf("turno_campos") != -1) {
        orderedValues = ["Dilma Rousseff", "Eduardo Campos","Branco e Nulo","NS/NR*"];
    } else if (pergunta.indexOf("avaliacao") != -1) {
        orderedValues = ["Ótimo e bom","Regular","Ruim e péssimo","NS/NR*"]
    } else if (pergunta.indexOf("interesse")!= -1) {
        orderedValues = ["Tem muito interesse","Tem médio interesse","Não tem interesse","NS/NR*"]
    } else if (pergunta.indexOf("aprova")!= -1) {
        orderedValues = ["Aprova","Desaprova","NS/NR*"]
    } else if (pergunta.indexOf("desejo")!= -1) {
        orderedValues = ["Quer mudança","Quer continuidade","NS/NR*"]
    }

    var entries = [];
    orderedValues.forEach(function (v) {
        entries.push(
        {
                key: v,
                fill: window.chart.getColor(v).fill,
                stroke: window.chart.getColor(v).stroke,
                opacity: window.chart.getColor(v).opacity,
                series: linha,
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
        grafico.assignColor("NS/NR*","#2E2B2D");
        grafico.assignColor("Branco e Nulo","#C9C9C9");
    } else if (pergunta.indexOf("avalia") != -1 || pergunta.indexOf("aprova") != -1 ) {
        grafico.defaultColors = [
            new dimple.color("#592640"),
            new dimple.color("#CCB1BE"),
            new dimple.color("#B06898")

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
    chart.axes[0].overrideMin.setUTCDate('16');
    chart.axes[0].overrideMin.setMonth('02');
    chart.axes[0].overrideMin.setFullYear('2014');
    if ( pergunta == "desejo_mudanca" ){
        $(".rec-avalia").show();
        $(".rec-muda").hide();
        if (cat_recorte == "desejo_mudanca" ) {
            cat_recorte = "total";
            recorte = "total";
            texto_recorte = "Total do Eleitorado";
        }
    } else if (pergunta == "avaliacao_governo") {
        chart.axes[0].overrideMin.setUTCDate('20');
        chart.axes[0].overrideMin.setMonth('09');
        chart.axes[0].overrideMin.setFullYear('2013');
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
    var data = dimple.filterData(window.complete_data, "cat_pergunta", pergunta); //filtrando pergunta
        data = dimple.filterData(data, "cat_recorte",  cat_recorte); //filtrando categoria recorte
    var maximo_y = d3.max(data, function(d){ return parseInt(d.valor);}); //encontra maior valor de uma determianda categoria de recorte
        data = dimple.filterData(data, "recorte", recorte); //filtrando recorte

    $(".botao-selecao-pergunta").html(texto_pergunta); // Alterando texto do botão de pergunta
    $(".botao-selecao-recorte").html(texto_recorte); // Alterando texto do botão de recorte
    $(".botao-selecao-pergunta").data("pergunta",pergunta); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta
    $(".botao-selecao-recorte").data("catRecorte",cat_recorte); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta
    $(".botao-selecao-recorte").data("recorte",recorte); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta

    chart.data = data; // Definindo novo conjunto de dados do gráfico

    //arruma as legendas
    chart.legends = [];
    limpar_legendas(); //limpa as antigas
    legend = chart.addLegend(-200, 10, 195, 220, "right");
    legend._getEntries = function () { return ordemLegenda(pergunta); }; //arruma a ordem
    chart = configuraCores(chart, pergunta); //aruma as cores

    //coloca o nome certo e % no eixo y
    y.title = texto_pergunta + " (%)";
    y.overrideMax = maximo_y;

    chart.draw(1000); // Desenhando novo gráfico com animação durando 1000 ms

    //muda os meses para o nome em extenso
    nomeMes()

}

function atualiza_recorte(cat_recorte, recorte, texto){
        atualiza_grafico({cat_recorte: cat_recorte, recorte: recorte, texto_recorte: texto});
}

function atualiza_pergunta(pergunta, texto){
    atualiza_grafico({pergunta: pergunta, texto_pergunta: texto})
}

function nomeMes() {
    todos_textos = $("text")
    for (var i =0; i < todos_textos.length; i++) {
        texto = todos_textos[i].innerHTML
        data = texto.split("/")
        if ((data.length > 1) & (data[0] != "NS")){
            if (data[1] == "01") mes = "jan"
            if (data[1] == "02") mes = "fev"
            if (data[1] == "03") mes = "mar"
            if (data[1] == "04") mes = "abr"
            if (data[1] == "05") mes = "mai"
            if (data[1] == "06") mes = "jun"
            if (data[1] == "07") mes = "jul"
            if (data[1] == "08") mes = "ago"
            if (data[1] == "09") mes = "set"
            if (data[1] == "10") mes = "out"
            if (data[1] == "11") mes = "nov"
            if (data[1] == "12") mes = "dez"
            todos_textos[i].innerHTML = data[0] + "/" + mes
        }
    }
}

$(document).ready(function(){
    window.svg = dimple.newSvg("#grafico", "100%", "60%");
    carrega();
    window.onresize = function () {
        // As of 1.1.0 the second parameter here allows you to draw
        // without reprocessing data.  This saves a lot on performance
        // when you know the data won't have changed.
        chart.draw(0, true);
        atualiza_background();
    };

});
