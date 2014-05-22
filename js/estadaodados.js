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
    myChart.setBounds(40,20,750,390);
    var x = myChart.addTimeAxis("x","data","%Y-%m-%d","%Y-%m-%d");
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
	
	//customiza a tooltip
	
	
	
	
    myChart.draw();
    
	x.shapes.selectAll("text").attr("transform",
        function (d) {
            //return d3.select(this).attr("transform") + " translate(-14, 38) rotate(-90)";
            return d3.select(this).attr("transform") + " translate(0, 20) rotate(-45)";
        });
    window.chart=myChart;
}

function atualiza_recorte(recorte, variavel, texto){
    var data = dimple.filterData(dimple.filterData(window.complete_data, "recorte", recorte), "variavel", variavel);
    chart.data = data;
    chart.draw(1000);
    $(".botao-selecao").html(texto);
}

$(document).ready(function(){
    window.svg = dimple.newSvg("#grafico", 900, 490);
    carrega();
});
