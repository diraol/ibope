var complete_data = null;
var meuGrafico = null;

function carrega () {
  //desenha grafico
    d3.tsv("anac_site4.csv", function (data) {
      window.complete_data = data;

      var dado = dimple.filterData(data, "origem", "TOTAL");
      dado = dimple.filterData(dado, "empresa", "TOTAL");
      desenha(dado);

      //monta select origem

      var nomes = new Array();
      var aeroportos = new Array();
      for (i in data) {
        nomes[i]=data[i].origem_nome;
        aeroportos[i]=data[i].origem;
      }

      nomes = nomes.filter(function(itm,i,a){
        return i==a.indexOf(itm);
      });

      aeroportos = aeroportos.filter(function(itm,i,a){
        return i==a.indexOf(itm);
      });

      var option = new Array();

      for (i in nomes) { option[i]= [nomes[i],aeroportos[i]]; }

      option = option.sort(function(a, b) { return (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0)); });

      for (i in option) {
        if(option[i][0] != "TOTAL"){
        jQuery("#origem").append('<option value="'+option[i][1]+'">'+option[i][0]+'</option>');
      }
      }

   });
}

function desenhaNumVoos(dado) {
    //desenha NumVoos
    var svg = dimple.newSvg("#numvoos", 900, 800);
    var myChart = new dimple.chart(svg, dado);
    myChart.setBounds(60, 45, 350, 310);
    myChart.addMeasureAxis("y", "tempo_voo");
    var x = myChart.addTimeAxis("x", "ano","%Y","%Y");
    var empresa = myChart.addSeries("empresa", dimple.plot.line);
    var myLegend = myChart.addLegend(800, 35, 50, 400, "Right");
    myChart.assignColor("Tam","#592640");
    myChart.assignColor("Gol","#262659");
    myChart.assignColor("Trip","#402659");
    myChart.assignColor("Azul","#265959");
    myChart.assignColor("Avianca","#A38FB8");
    myChart.assignColor("Webjet","#595926");
    myChart.assignColor("Passaredo","#B8A38F");
    myChart.assignColor("Pantanal","#598F59");
    myChart.assignColor("TOTAL","#030303");
    myChart.draw();
    window.meuGrafico = myChart;

    //coloca títulos
    svg
        .append("text").text("Tempo de voo")
        .attr("x",40)
        .attr("y",20)
        .style("font-family", "sans-serif")
        .style("font-size", "15px")
        .style("color", "Black");

    //tira titulo dos eixos
    jQuery(".axis.title").remove();
    //conserta legendas
    var textos = jQuery(".legendText","#numvoos");
    if (textos.size() > 1 ) {
        var legendas = jQuery(".legendKey","#numvoos");
        var y_agora;
        var i = 0;
        while (i < textos.size()) { y_agora = parseInt(jQuery(textos[i]).attr('y')); jQuery(textos[i]).attr('y',y_agora+(9*i)); i++; }
        i = 0;
        while (i < legendas.size()) { y_agora = parseInt(jQuery(legendas[i]).attr('y')); jQuery(legendas[i]).attr('y',y_agora+(9*i)-9); i++; }
    }
}

function desenha(dado) {
    desenhaNumVoos(dado);
}

function mudaDestino() {
    //acha os destinos para a origem selecionada
    origem = jQuery("#origem").val();
    data = dimple.filterData(complete_data, "origem", origem);
    data.sort(ordena);
    data.reverse();

    //acha os valores únicos
    var nomes = new Array();
    var aeroportos = new Array();
    for (i in data) {
        nomes[i]=data[i].destino_nome;
        aeroportos[i]=data[i].destino;
    }

    nomes = nomes.filter(function(itm,i,a){
        return i==a.indexOf(itm);
    });

    aeroportos = aeroportos.filter(function(itm,i,a){
        return i==a.indexOf(itm);
    });

    //monta o select do destino
    jQuery("#destino").find('option').remove().end();
    jQuery("#destino").append('<option value="TOTAL">Selecione o destino...</option>');

    var option = new Array();

    for (i in nomes) {
        option[i]= [nomes[i],aeroportos[i]];
    }

    option = option.sort(function(a, b) { return (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0)); });

    for (i in option) {
        jQuery("#destino").append('<option value="'+option[i][1]+'">'+option[i][0]+'</option>');
    }
}

function atualizaRadio () {
  var origem = jQuery("#origem").val();
  var destino = jQuery("#destino").val();
     var filtro = jQuery("[name='FiltroTotal']:checked").val();

  var dado = dimple.filterData(complete_data, "origem", origem);
  dado = dimple.filterData(dado,"destino", destino);

  if (filtro=="TOTAL") {
    dado = dimple.filterData(dado, "empresa", "TOTAL");
  }

  if (filtro=="EMPRESAS") {
    //criar um array só com empresas, tirando o total, e depois filtrando nos dados originais
    var newData = new Array();
    for (i in dado) { if (dado[i].empresa != "TOTAL") { newData.push(dado[i]); } }
    dado = newData;
  }

  var fadetime = 800;
  jQuery("#numvoos").fadeOut(fadetime, function () {
    jQuery("#" + this.id + " svg").remove();
    desenhaNumVoos(dado);
    jQuery("#numvoos").fadeIn(fadetime);
  });
}

function ordena(a,b) {
  return a.destino_nome < b.destino_nome ? true : false;
}

function ordena_origem(a,b) {
  return a.origem_nome < b.origem_nome ? true : false;
}

function atualiza () {
  var origem = jQuery("#origem").val();
  var destino = jQuery("#destino").val();
  var dado = dimple.filterData(complete_data, "origem", origem);
  dado = dimple.filterData(dado,"destino", destino);
  dado = dimple.filterData(dado, "empresa", "TOTAL");

  var fadetime = 800;
  jQuery("#numvoos").fadeOut(fadetime, function () {
    jQuery("#" + this.id + " svg").remove();
    desenhaNumVoos(dado);
    jQuery("#numvoos").fadeIn(fadetime);
  });

  //troca os checks para TOTAL
     var filtro = jQuery("[name='FiltroTotal']:checked").val();
  var checks = jQuery("[name='FiltroTotal']");
  if (filtro!="TOTAL") { jQuery(checks[0]).prop("checked",true); }

}

$(document).ready(function(){
    jQuery("input[type='radio']").change(function(){atualizaRadio();});

    carrega();
});
