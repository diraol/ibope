var Main = (function() {

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var defaultFilters = {
            pergunta: '2aecio_validos',
            categoriaRecorte: 'total',
            recorte: 'total'
    };

    var extensao = {
        'pergunta': {
            'intencao_estimulada': 'Intenção estimulada (votos totais)',
            'estimulada_validos': 'Intenção estimulada (votos válidos)',
            'intencao_espontanea': 'Intenção espontânea (votos totais)',
            'espontanea_validos': 'Intenção espontânea (votos válidos)',
            'interesse': 'Qual interesse nas eleições',
            'avaliacao_governo': 'Avaliação do governo',
            'aprova_dilma': 'Aprovação da Dilma',
            'desejo_mudanca': 'Desejo de mudança',
            'rejeicao': 'Rejeição',
            '2turno_aecio': '2º turno - Aécio (votos totais)',
            '2aecio_validos': '2º turno - Aécio (votos válidos)',
            '2turno_campos': '2º turno - Campos',
            '2turno_marina': '2º turno - Marina (votos totais)',
            '2marina_validos': '2º turno - Marina (votos válidos)',
            'favorito': 'Quem você acha que vai ganhar?',
            'poder_compra': 'Melhora do poder de compra',
            'saude': 'Melhora da saúde pública',
            'emprego': 'Melhora das oport. de emprego',
            'educacao': 'Melhora da educação pública',
            'nota': 'Nota média para o governo',
            'aecio':'Potencial de voto - Aécio',
            'dilma':'Potencial de voto - Dilma',
            'marina':'Potencial de voto - Marina'
        },
        'recorte': {
            'total': {
                'total': 'Total'
            },
            'sexo': {
                'MAS': 'do sexo masculino',
                'FEM': 'do sexo feminino'
            },
            'regiao': {
                'NORTE-CENTRO-OESTE': 'das regiões Norte e Centro-Oeste',
                'NORDESTE': 'da região Nordeste',
                'SUDESTE': 'da região Sudeste',
                'SUL': 'da região Sul'
            },
            'escolaridade': {
                'Fundamental 1': 'com Ensino Fundamental 1',
                'Fundamental 2': 'com Ensino Fundamental 2',
                'Medio': 'com Ensino Médio',
                'Superior': 'com Ensino Superior'
            },
            'renda_familiar': {
                'Ate 1': 'com renda Até 1 SM',
                '1 a 2': 'com renda de 1 a 2 SM',
                '2 a 5': 'com renda de 2 a 5 SM',
                'Mais de 5': 'com renda maior que 5 SM'
            },
            'condicao_municipio': {
                'CAPITAL': 'cujo município é Capital',
                'PERIFERIA': 'cujo município é da Periferia',
                'INTERIOR': 'cujo município é do Interior'
            },
            'idade': {
                '16 a 24': 'com idade de 16 a 24 anos',
                '25 a 34': 'com idade de 25 a 34 anos',
                '35 a 44': 'com idade de 35 a 44 anos',
                '45 a 54': 'com idade de 45 a 54 anos',
                '55 ou mais': 'com idade de 55 ou mais anos'
            },
            'cor': {
                'Branca': 'cuja cor é Branca',
                'Preta ou parda': 'cuja cor é Preta ou Parda',
                'Outras': 'de outras cores'
            },
            'religiao': {
                'Catolica': 'Católico',
                'Evangelica': 'Evangélico',
                'Outras': 'de outras religiões'
            },
            'avaliacao_governo': {
                'Ótimo e bom': 'que avalia o governo como Ótimo/Bom',
                'Regular': 'que avalia o governo como Regular',
                'Ruim e péssimo': 'que avalia o governo como Ruim/Péssimo'
            },
            'desejo_mudanca': {
                'Quer mudança': 'que prefere Mudança',
                'Quer continuidade': 'que prefere Continuidade'
            },
            'intencao_estimulada': {
                'Dilma Rousseff': 'Dilma Rousseff',
                'Marina Silva': 'Marina Silva',
                'Aécio Neves': 'Aécio Neves',
                'Eduardo Campos': 'Eduardo Campos'
            },
            'favorito': {
                'Dilma Rousseff': 'Dilma Rousseff',
                'Marina Silva': 'Marina Silva',
                'Aécio Neves': 'Aécio Neves',
                'Eduardo Campos': 'Eduardo Campos'
            },
            'nota': {
                '7 ou mais': '7 ou mais',
                'Entre 4 e 6': 'de 4 a 6',
                '3 ou menos':'3 ou menos'
            },
            'partido': {
                'PT': 'PT',
                'PSDB': 'PSDB'
            },
            'bolsa': {
                'Sim': 'Qualquer benefício do governo',
                'Não': 'Nenhum benefício do governo'
            },
            'bolsa_familia': {
                'Sim': 'Bolsa Família'
            },
            'dilma':{
                'Votaria com certeza':'Votaria com certeza (Dilma)',
                'Poderia votar':'Poderia votar (Dilma)',
                'Não votaria de jeito nenhum':'Não votaria de jeito nenhum (Dilma)'
            },
            'marina':{
                'Votaria com certeza':'Votaria com certeza (Marina)',
                'Poderia votar':'Poderia votar (Marina)',
                'Não votaria de jeito nenhum':'Não votaria de jeito nenhum (Marina)'
            },
            'aecio':{
                'Votaria com certeza':'Votaria com certeza (Aecio)',
                'Poderia votar':'Poderia votar (Aecio)',
                'Não votaria de jeito nenhum':'Não votaria de jeito nenhum (Aecio)'
            },
            'poder_compra': {
                'Melhorou': 'Melhorou',
                'Igual': 'Está igual',
                'Piorou': 'Piorou'
            },
            'emprego': {
                'Melhorou': 'Melhorou',
                'Igual': 'Está igual',
                'Piorou': 'Piorou'
            },
            'saude': {
                'Melhorou': 'Melhorou',
                'Igual': 'Está igual',
                'Piorou': 'Piorou'
            },
            'educacao': {
                'Melhorou': 'Melhorou',
                'Igual': 'Está igual',
                'Piorou': 'Piorou'
            }
        }
    };
    var currentRoute = {
        pergunta: "2aecio_validos",
        categoriaRecorte: "total",
        recorte: "total"
    };
    var complete_data = null;
    var meuGrafico = null;
    var svg = null;

    function inicializa() {
        svg = dimple.newSvg("#grafico", "100%", "80%");

        //desenha grafico
        d3.csv("dados/ibope_2014.csv", function (data) {
            window.complete_data = data;

            crossroads.addRoute('/p/{perg}/cr/{cat_rec}/r/{rec}', function(perg, cat_rec, rec){
                perg = decodeURI(perg);
                cat_rec = decodeURI(cat_rec);
                rec = decodeURI(rec);
                currentRoute["pergunta"] = perg in extensao.pergunta ? perg : defaultFilters.pergunta;
                _filtra_recorte_por_pergunta();
                if (cat_rec in extensao.recorte && rec in extensao.recorte[cat_rec]) {
                    currentRoute["categoriaRecorte"] = cat_rec;
                    currentRoute["recorte"] = rec;
                    _filtra_pergunta_por_catRecorte();
                } else {
                    currentRoute["categoriaRecorte"] = defaultFilters.categoriaRecorte;
                    currentRoute["recorte"] = defaultFilters.recorte;
                }
            });

            crossroads.addRoute('/cr/{cat_rec}/r/{rec}/p/{perg}', function(cat_rec, rec, perg){
                perg = decodeURI(perg);
                cat_rec = decodeURI(cat_rec);
                rec = decodeURI(rec);
                currentRoute["pergunta"] = perg in extensao.pergunta ? perg : defaultFilters.pergunta;
                _filtra_recorte_por_pergunta();
                if (cat_rec in extensao.recorte && rec in extensao.recorte[cat_rec]) {
                    currentRoute["categoriaRecorte"] = cat_rec;
                    currentRoute["recorte"] = rec;
                    _filtra_pergunta_por_catRecorte();
                } else {
                    currentRoute["categoriaRecorte"] = defaultFilters.categoriaRecorte;
                    currentRoute["recorte"] = defaultFilters.recorte;
                }
            });

            crossroads.addRoute('/p/{perg}', function(perg){
                perg = decodeURI(perg);
                currentRoute["pergunta"] = perg in extensao.pergunta ? perg : defaultFilters.pergunta;
                _filtra_recorte_por_pergunta();
            });

            crossroads.addRoute('/cr/{cat_rec}/r/{rec}', function(cat_rec, rec){
                cat_rec = decodeURI(cat_rec);
                rec = decodeURI(rec);
                if (cat_rec in extensao.recorte && rec in extensao.recorte[cat_rec]) {
                    currentRoute["categoriaRecorte"] = cat_rec;
                    currentRoute["recorte"] = rec;
                    _filtra_pergunta_por_catRecorte();
                } else {
                    currentRoute["categoriaRecorte"] = defaultFilters.categoriaRecorte;
                    currentRoute["recorte"] = defaultFilters.recorte;
                }
            });

            crossroads.routed.add(function(request, data){
                window.location.hash = "#p/" + encodeURI(currentRoute["pergunta"]) + "/cr/" + encodeURI(currentRoute["categoriaRecorte"]) + "/r/" + encodeURI(currentRoute["recorte"]);
                _atualiza_grafico();
            });

            var a = $('.link-pergunta');
            for (var i=0; i<a.length; i++){
                a[i].onclick=function(e){
                    e.preventDefault();
                    crossroads.parse('/p/' + this.href.split("#p/").pop());
                }
            };

            var a = $('.link-recorte');
            for (var i=0; i<a.length; i++){
                a[i].onclick=function(e){
                    e.preventDefault();
                    crossroads.parse('/cr/' + this.href.split("#cr/").pop());
                }
            };

            _cria_grafico();
        });

        window.onresize = function () {
            // As of 1.1.0 the second parameter here allows you to draw
            // without reprocessing data.  This saves a lot on performance
            // when you know the data won't have changed.
            chart.draw(0, true);
            _atualiza_background();
        };
    }

    function _filtra_recorte_por_pergunta(){
        $("[class*='rec-']").show();
        $(".rec-"+currentRoute["pergunta"]).hide();
        if (currentRoute["categoriaRecorte"] == currentRoute["pergunta"]) {
            currentRoute["categoriaRecorte"] = defaultFilters["categoriaRecorte"];
            currentRoute["recorte"] = defaultFilters["recorte"];
        }
    }

    function _filtra_pergunta_por_catRecorte() {
        $("[class*='perg-']").show();
        $(".perg-"+currentRoute["categoriaRecorte"]).hide();
        if (currentRoute["pergunta"] == "desejo_mudanca") {
            currentRoute["pergunta"] = defaultFilters["pergunta"];
        }
    }

    function _atualiza_background() {
        d3.select("#background_plot_area")
            .attr("width", dimple._parentWidth(svg.node()) - 225 )
            .attr("height", dimple._parentHeight(svg.node()) - 100)
    }

    function _cria_grafico() {

        //Retângulo de fundo (background) do gráfico
        svg.append("rect")
            .attr("id", "background_plot_area")
            .attr("x", 60)
            .attr("y", 30)
            .attr("width", dimple._parentWidth(svg.node()) - 225 )
            .attr("height", dimple._parentHeight(svg.node()) - 100)
            .style("fill", "#fff");

        var data = dimple.filterData(window.complete_data, "cat_pergunta", currentRoute["pergunta"]); //filtra pergunta
            data = dimple.filterData(data, "cat_recorte", "total"); //filtra categoria do recorte
        var maximo_y = d3.max(data, function(d){ return parseFloat(d.valor);}); //encontra maior valor de uma determianda categoria de recorte
            data = dimple.filterData(data, "recorte", "total"); //filtra recorte na categoria

        var myChart = new dimple.chart(svg,data);
        window.chart=myChart;

        myChart.setBounds(45,20,"85%","80%");
        myChart.setMargins("60px","30px","165px","70px");

        var x = myChart.addTimeAxis("x","data","%Y-%m-%d","%d/%m");
        x.addOrderRule("");
        x.title = "";
        var maximo_data = new Date(d3.max(data, function(d){ return d.data;})); //encontra maior data
        var minimo_data = new Date(d3.min(data, function(d){ return d.data;})); //encontra menor data

        //aruma tamanho do eixo de data
        x.overrideMin = minimo_data.setDate(minimo_data.getDate()*0.95);
        x.overrideMax = maximo_data.setDate(maximo_data.getDate()*1.3);

        y = myChart.addMeasureAxis("y","valor");
        linha = myChart.addSeries("dado",dimple.plot.line);

        if (maximo_data > new Date("2014-10-05")) {
            console.log("teste");
            var s4 = myChart.addSeries("segturno", dimple.plot.line);
                s4.data = [
                    { "segturno": "segturno", "valor": 0, "data": "2014-10-06"},
                    { "segturno": "segturno", "valor": 100, "data": "2014-10-07"}
                ];
        }

        linha.lineWeight = 4
        linha.lineMarkers = true;

        legend = myChart.addLegend(-200, 30, 195, 220, "right");
        myChart = _configuraCores(myChart, currentRoute["pergunta"]);

        //arruma ordem da legenda
        legend._getEntries = function () { return _ordemLegenda(currentRoute["pergunta"]); };

        //arruma as fontes
        //legend.fontFamily = "Arial";
        legend.fontSize = "82%";

        //x.fontFamily = "Arial";
        x.fontSize = "95%";

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
        _nomeMes()

        //translada labels do eixo x
        x.shapes.selectAll("text").attr("transform",
            function (d) {
                //return d3.select(this).attr("transform") + " translate(-14, 38) rotate(-90)";
                return d3.select(this).attr("transform") + " translate(0, 20) rotate(-45)";
            });

        if (window.location.hash) {
            crossroads.parse('/' + window.location.hash.split("#").pop());
        } else {
            crossroads.parse('/p/2aecio_validos/cr/total/r/total');
        }

    }

    function _ordemLegenda(pergunta) {
        var orderedValues = []
        if (pergunta.indexOf("intencao_estimulada") != -1) {
            orderedValues = ["Dilma Rousseff", "Marina Silva","Aécio Neves", "Eduardo Campos","Pastor Everaldo","Outros","Branco e Nulo","NS/NR*"];
        } else if (pergunta.indexOf("estimulada_validos") != -1 || pergunta.indexOf("espontanea_validos") != -1) {
            orderedValues = ["Dilma Rousseff", "Marina Silva","Aécio Neves", "Pastor Everaldo","Outros"];
        } else if (pergunta.indexOf("espontanea") != -1) {
            orderedValues = ["Dilma Rousseff", "Marina Silva","Aécio Neves", "Eduardo Campos","Pastor Everaldo","Lula","Outros","Branco e Nulo","NS/NR*"];
        } else if (pergunta.indexOf("rejeicao") != -1) {
            orderedValues = ["Dilma Rousseff", "Marina Silva","Aécio Neves", "Eduardo Campos","Pastor Everaldo"];
        } else if (pergunta.indexOf("turno_aecio") != -1) {
            orderedValues = ["Dilma Rousseff", "Aécio Neves","Branco e Nulo","NS/NR*"];
        } else if (pergunta.indexOf("aecio_validos") != -1) {
            orderedValues = ["Dilma Rousseff", "Aécio Neves"];
        } else if (pergunta.indexOf("turno_campos") != -1) {
            orderedValues = ["Dilma Rousseff", "Eduardo Campos","Branco e Nulo","NS/NR*"];
        } else if (pergunta.indexOf("turno_marina") != -1) {
            orderedValues = ["Dilma Rousseff", "Marina Silva","Branco e Nulo","NS/NR*"];
        } else if (pergunta.indexOf("marina_validos") != -1) {
            orderedValues = ["Dilma Rousseff", "Marina Silva"];
        } else if (pergunta.indexOf("avaliacao") != -1) {
            orderedValues = ["Ótimo e bom","Regular","Ruim e péssimo","NS/NR*"]
        } else if (pergunta.indexOf("interesse")!= -1) {
            orderedValues = ["Tem muito interesse","Tem médio interesse","Não tem interesse","NS/NR*"]
        } else if (pergunta.indexOf("aprova")!= -1) {
            orderedValues = ["Aprova","Desaprova","NS/NR*"]
        } else if (pergunta.indexOf("desejo")!= -1) {
            orderedValues = ["Quer mudança","Quer continuidade","NS/NR*"]
        } else if (pergunta == "dilma" || pergunta == "aecio" || pergunta == "marina") {
            orderedValues = ["Votaria com certeza","Poderia votar","Não votaria de jeito nenhum","NS/NR*"]
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
    function _configuraCores(grafico, pergunta) {
        if (pergunta.indexOf("intencao") != -1 || pergunta.indexOf("rejeicao") != -1 || pergunta.indexOf("turno") != -1) {
            grafico.assignColor("Aécio Neves","#1C4587");
            grafico.assignColor("Dilma Rousseff","#CC0000");
            grafico.assignColor("Eduardo Campos","#E69138");
            grafico.assignColor("Marina Silva","#E69138");
            grafico.assignColor("Pastor Everaldo","#6AA84F");
            grafico.assignColor("NS/NR*","#2E2B2D");
            grafico.assignColor("Branco e Nulo","#C9C9C9");
        } else if (pergunta == "dilma" || pergunta == "aecio" || pergunta == "marina") {
            grafico.assignColor("Votaria com certeza","#1C4587"),
            grafico.assignColor("Poderia votar","#6b94b0"),
            grafico.assignColor("Não votaria de jeito nenhum","#CB5B5B"),
            grafico.assignColor("NS/NR*","#2E2B2D")

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


    function _limpar_legendas() {
        $('*[class^="dimple-legend"]').remove()
    }

    function _atualiza_grafico() {
        // argumentos é um dicionário com as seguintes variáveis:
        // pergunta, recorte, variavel

        // Definindo valor padrão para as variáveis, caso nenhum seja passado.
        var pergunta = currentRoute["pergunta"] || "intencao_estimulada",
            cat_recorte = currentRoute["categoriaRecorte"]  || "total",
            recorte = currentRoute["recorte"] || "total",
            texto_pergunta = extensao['pergunta'][pergunta],
            texto_recorte = extensao['recorte'][cat_recorte][recorte];

        // filtra os dados de acordo com a pergunta e o recorte atuais
        var data = dimple.filterData(window.complete_data, "cat_pergunta", pergunta); //filtrando pergunta
            data = dimple.filterData(data, "cat_recorte",  cat_recorte); //filtrando categoria recorte
        var maximo_y = d3.max(data, function(d){ return parseFloat(d.valor);}); //encontra maior valor de uma determianda categoria de recorte
            data = dimple.filterData(data, "recorte", recorte); //filtrando recorte

        //Escondendo opções de recorte que são incompatíveis com perguntas
        var maximo_data = new Date(d3.max(data, function(d){ return d.data;})); //encontra maior data
        var minimo_data = new Date(d3.min(data, function(d){ return d.data;})); //encontra menor data

        //aruma tamanho do eixo de data
        chart.axes[0].overrideMin = minimo_data.setDate(minimo_data.getDate()*0.95);
        chart.axes[0].overrideMax = maximo_data.setDate(maximo_data.getDate()*1.3);

        $(".botao-selecao-pergunta").html(texto_pergunta); // Alterando texto do botão de pergunta
        $(".botao-selecao-recorte").html(texto_recorte); // Alterando texto do botão de recorte
        $(".botao-selecao-pergunta").data("pergunta",pergunta); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta
        $(".botao-selecao-recorte").data("catRecorte",cat_recorte); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta
        $(".botao-selecao-recorte").data("recorte",recorte); // e coloca um atributo de "data" no botão mostrando qual é a atual pergunta

        chart.data = data; // Definindo novo conjunto de dados do gráfico

        //arruma as legendas
        chart.legends = [];
        _limpar_legendas(); //limpa as antigas

        //adiciona legenda menor se for aprovação da Dilma
        if (pergunta == "aprova_dilma")
            legend = chart.addLegend(-200, 10, 165, 220, "right")
        else
            legend = chart.addLegend(-200, 10, 195, 220, "right");

        legend._getEntries = function () { return _ordemLegenda(pergunta); }; //arruma a ordem
        chart = _configuraCores(chart, pergunta); //aruma as cores

        //coloca o nome certo e % no eixo y
        y.title = texto_pergunta + " (%)";

        //coloca mínimo de 50% se for votos válidos. se não, usa a fórmula antiga mesmo
        if (pergunta.indexOf("validos") > 0) {
            if (maximo_y < 60) {
                y.overrideMax = 60
            }
            else {
                y.overrideMax = maximo_y
            }
            //sendo votos válidos, ele aproveita para fazer uma série nova que será a linha cinza de 50%
            datas = dimple.getUniqueValues(data,"data")
            var s3 = chart.addSeries("metade", dimple.plot.line);

            primeira_data = datas[0].split("-")
            primeira_data[1] = parseInt(primeira_data[1])-1
            primeira_data = primeira_data.join("-")

            ultima_data = datas[datas.length-1].split("-")
            ultima_data[1] = (parseInt(ultima_data[1])+1)
            ultima_data = ultima_data.join("-")

            console.log(primeira_data, ultima_data);

            s3.data = [
                { "metade" : "metade", "valor" : 50, "data" : primeira_data },
                { "metade" : "metade", "valor" : 50, "data" :  ultima_data}];

        } else  {
            //se não for votos válidos e se tiver a linha de 50%, ele remove
            y.overrideMax = maximo_y;
            if (chart.series.length>1) {
                chart.series.pop(1)
                $("path[id*='metade']").remove()

            }
        }


        chart.draw(750); // Desenhando novo gráfico com animação durando 1000 ms

        chart.axes[0].shapes.selectAll("text").attr("transform",
            function (d) {
                //return d3.select(this).attr("transform") + " translate(-14, 38) rotate(-90)";
                return d3.select(this).attr("transform") + " translate(0, 20) rotate(-45)";
            });

        //muda os meses para o nome em extenso
        _nomeMes()

        //arruma a barra de 50% se houver
        _arruma_50()

    }

    function atualiza_recorte(cat_recorte, recorte, texto){
        _atualiza_grafico({cat_recorte: cat_recorte, recorte: recorte, texto_recorte: texto});
    }

    function _arruma_50() {

        $("circle[id*='metade']").remove()

        $("path[id*='metade']")
            .css({
                "stroke": "#000000",
                "stroke-dasharray":"5.5",
                "stroke-width":"4",
                "stroke-opacity":"0.5"
            })
            .attr("stroke","#000000")
            .attr("opacity","#0.5")

        d3.select("path[id*='metade']")
            .on("mouseover",function(d){
                div.transition()
                    .duration(0)
                    .style("opacity", 1)
                div.html("Metade dos votos válidos; acima disso significa vitória no 1o turno")
                    .style("left", (d3.event.pageX - 10) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")})
            .on("mouseout", function(d) {
                div.transition()
                .duration(1500)
                .style("opacity", 0);
            });

         $("path[id*='segturno']")
            .css({
                "stroke": "#000000",
                "stroke-dasharray":"5.5",
                "stroke-width":"4",
                "stroke-opacity":"0.5"
            })
            .attr("stroke","#000000")
            .attr("opacity","#0.5")

        d3.select("path[id*='segturno']")
            .on("mouseover",function(d){
                div.transition()
                    .duration(0)
                    .style("opacity", 1)
                div.html("Linha que divide pesquisas realizadas antes e depois do primeiro")
                    .style("left", (d3.event.pageX - 10) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")})
            .on("mouseout", function(d) {
                div.transition()
                .duration(1500)
                .style("opacity", 0);
            });

    }

    function atualiza_pergunta(pergunta, texto){
        _atualiza_grafico({pergunta: pergunta, texto_pergunta: texto})
    }

    function _nomeMes() {
        var todos_textos = $(".dimple-axis text");
        var meses = {
                "01": "jan",
                "02": "fev",
                "03": "mar",
                "04": "abr",
                "05": "mai",
                "06": "jun",
                "07": "jul",
                "08": "ago",
                "09": "set",
                "10": "out",
                "11": "nov",
                "12": "dez"
        };

        for (var i = 0; i < todos_textos.length; i++) {
            var texto = todos_textos[i].textContent;
            var data = texto.split("/");
            if ((data.length > 1) & (data[0] != "NS")){
                todos_textos[i].textContent = data[0] + "/" + meses[data[1]];
            }
        }
    }

    return {
        inicializa: inicializa,
    };

})();

$(document).ready(function(){
    Main.inicializa();
});
