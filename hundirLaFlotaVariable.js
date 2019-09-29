NUM_FILA = 10;
NUM_COLUMNA = 10;
COLOR_FLOTA = "blue";
COLOR_MOLDE = "lightblue";
COLOR_AGUA = "black";
COLOR_RODEADO = "gray";
ID_PARARJUEGO = "pararJuego"
ID_CONFIGURARFLOTA = "configurarFlotas";

	
//flotas = [ "5a", "4a", "4b", "3a", "3b", "3c", "2a", "2b"];
CANTIDAD_FLOTAS = [0, 0, 2, 3, 2, 1];
JUGADORES = {0: "a", 1: "b"}; // a flotas del ordenador, b flotas del jugador 

ultimoDisparo1 = [null, null] , ultimoDisparo2 = [null, null], f=0;
turno = 0;
direccionFlota = 0; // 0 = vertical  1 = horizontal
comienzaJuego = false;
juegoTerminado = false;

function iniciar(){

	setElementWidth(getById("body"), window.innerHeight);
	setElementWidth(getById(ID_PARARJUEGO), window.innerHeight);

	crearTablaConFunciones("tablaDispara", NUM_FILA, NUM_COLUMNA, JUGADORES[0], "Campo del Contricante");
	crearTablaConFunciones("tablaPropia", NUM_FILA, NUM_COLUMNA, JUGADORES[1], "Campo Propio");
	//mostrarInicio("frameInicio");
	flotasPiezas = generarPiezasFlota(CANTIDAD_FLOTAS);	
	flotas = Object.keys(flotasPiezas).reverse();
	flotaActual = flotas[0];

	flotasJugador = generarPiezasFlota(CANTIDAD_FLOTAS);	
	flotasOrdenador = generarPiezasFlota(CANTIDAD_FLOTAS);	
	//console.log(Object.keys(flotas).reverse());

	tableroJugador = iniciarTablero(NUM_FILA, NUM_COLUMNA);
	tableroOrdenador = iniciarTablero(NUM_FILA, NUM_COLUMNA);

	generarFlota(0);
	generarFlota(1);

	/*dibujarFlotaMolde("flotas_5");
	dibujarFlotaMolde("flotas_4");
	dibujarFlotaMolde("flotas_3");
	dibujarFlotaMolde("flotas_2");
	rellenarColorMolde("flotas_"+flotaActual.split("")[0], COLOR_FLOTA);*/
}

function setElementWidth(elemento){
	document.getElementById("body").style.height = window.innerHeight + "px";
}

function getById(id){
	return document.getElementById(id);
}

function iniciarTablero(filas, columnas){
	var lista = [];
	for (var i = 0; i < filas; i++) {
		lista.push([]);
		for (var j = 0; j < columnas; j++) {
			lista[i].push("0");
		}
	}
	return lista;
}

function generarPiezasFlota(lista_flotas){
	var i, lista_piezas = {};
	for(i in lista_flotas){
		for(var j=0; j<lista_flotas[i]; j++){
			lista_piezas[i+"_"+j] = i;
		}
	}
	return lista_piezas;
}

function crearFlota(listaFlotas){
	var cantidadFlotas = {};

	var flota;
	for(flota in listaFlotas){
		cantidadFlotas[listaFlotas[flota]] = parseInt(listaFlotas[flota].charAt(0));
	}
	return cantidadFlotas;
}

function crearTablaConFunciones(tablaOrigen, fila, columna, cabeceraId, nombreTabla){
	if(cabeceraId == "a"){
		crearTabla(tablaOrigen, fila, columna, cabeceraId, "disparar(this, 0)", "", "", nombreTabla);
	} else{
		crearTabla(tablaOrigen, fila, columna, cabeceraId, "colocarFlota(this)", "validarFlota(this)", "limpiarColor(this)", nombreTabla);
	}

}

function crearTabla(tablaOrigen, fila, columna, cabeceraId, onclickFunction, onmouseoverFunction, onmouseoutFunction,nombreTabla) {
	var tabla = document.getElementById(tablaOrigen);
	var html = "";
	var claseDentroTabla = "casillaDispara";
	var claseDeNumeracion = "sinBorder";
	var numeracion = "A";

	html += "<tr><th colspan='" + (columna+1) + "' class='" + claseDeNumeracion + "'>" + nombreTabla + "</th></tr>";
	for(var i=0; i<fila+1; i++){
		html += "<tr>";
		for(var j=0; j<columna+1; j++){
			if(i==0 && j==0){
				html += "<td class='" + claseDeNumeracion + "'></td>";
			} else if(i==0){
				html += "<td class='" + claseDeNumeracion + "'>" + numeracion + "</td>";
				numeracion = String.fromCharCode(numeracion.charCodeAt(0)+1);
			} else{
				if(j==0){
					html += "<td class='" + claseDeNumeracion + "'>" + i + "</td>";
				} else{
					html += "<td id='" + cabeceraId + "_" + (i-1) + "_" + (j-1) + "' class='" + claseDentroTabla + "' onclick='" + onclickFunction + ";' onmouseover='" + onmouseoverFunction + ";' onmouseout='" + onmouseoutFunction + ";'></td>";
				}
			}
		}
		html += "</tr>";
	}
	tabla.innerHTML = html;
}

function mostrarInicio(elementoId){
	var elemento = document.getElementById(elementoId);
	var html = "<div id='ventanaInicio'> <br/> <h1>Bienvenido al juego de Hundir La Flota</h1> <br/> <h2>Práctica Lenguaje de Marcas 2ªEV 2019, <br />creado por Haozhe Chen</h2> <br /> <button onclick='cerrarInicio();'>Jugar</button> </div>";
	elemento.innerHTML = html;
	elemento.style.position = "absolute";
}

function cerrarInicio(){
	var elemento = document.getElementById("frameInicio");
	var ventanaInterior = document.getElementById("ventanaInicio");

	ventanaInterior.style.animationName = "salirDeVentana";
	setTimeout(function(){ elemento.innerHTML = "";
	elemento.style.zIndex = "-10"; 
	elemento.style.background = "white";
	elemento.style.height = "0";}, 2000);
}

function colocarFlota(casilla){
	if(casilla.style.cursor != "not-allowed" || !(flotaActual in flotas)){
		var idCasilla = casilla.id.split("_");
		var fila = parseInt(idCasilla[1]);
		var columna = parseInt(idCasilla[2]);
		var longitud = parseInt(flotaActual[0]);

		rellenarCampo(fila, columna, direccionFlota, longitud, flotaActual, tableroJugador);

		/*
		console.log(flotaActual);
		seleccionarFlota(getById("flotas_"+flotaActual.substr(0,1)), COLOR_MOLDE);

		flotas.splice(flotas.indexOf(flotaActual),1);

		flotaActual = flotas[0];

		
		seleccionarFlota(getById("flotas_"+flotaActual.substr(0,1)), COLOR_FLOTA); */

		flotaActual = flotas[flotas.indexOf(flotaActual)+1];

		if(flotaActual==undefined){
			flotaActual = true;
			borrarButton(document.getElementById("rotarFlotas"));
			borrarButton(document.getElementById("colocarFlotas"));
		}
	}
}

function iniciarColocarFlotas(elemento){
	if(flotaActual==false){
		flotaActual = flotas[0];
	}else if(flotaActual==true){
		
	}
}

function borrarButton(elemento){
	if(flotaActual==true){
		elemento.style.transform = "scale(0)";
		setTimeout( function(elemento) {
			elemento.remove();
		}, 2000, elemento);
	}
}

function limpiarColor(casilla){
	if(flotaActual==true){
	}else if(flotaActual != false){
		var idCasilla = casilla.id.split("_");
		var fila = parseInt(idCasilla[1]);
		var columna = parseInt(idCasilla[2]);
		var longitud = parseInt(flotaActual[0]);

		dibujarColor(fila, columna, direccionFlota, longitud, "white");
		casilla.style.cursor = "default";
	}
}

function rotarFlota(){
	if(direccionFlota == 0){
		direccionFlota = 1;
	} else{
		direccionFlota = 0;
	}
}

function validarFlota(casilla){
	if(flotaActual==true){
		casilla.onmouseout = "";
		casilla.onmouseover  = "";
	}else if(flotaActual != false){
		var idCasilla = casilla.id.split("_");
		var fila = parseInt(idCasilla[1]);
		var columna = parseInt(idCasilla[2]);
		var longitud = parseInt(flotaActual[0]);
		
		if(esCasillaValida(fila, columna, direccionFlota, longitud, tableroJugador)){
			dibujarColor(fila, columna, direccionFlota, longitud, COLOR_MOLDE);
		} else{
			document.getElementById("b_"+fila+"_"+columna).style.cursor = "not-allowed";
		}
	}
}

function dibujarColor(fila, columna, direccion, longitud, color) {
	var casilla;

	do{
		if(tableroJugador[fila][columna]==0){
			casilla = document.getElementById("b_" + fila + "_" + columna);

			casilla.style.backgroundColor = color;
			if(direccion==0){
				columna++;
			}else{
				fila++;
			}
		}
		longitud--;
	} while(longitud>0 && fila<NUM_FILA && columna <NUM_COLUMNA);
	
}

function esCasillaValida(fila, columna, direccion, longitud, tablero){
	var sumarFila=0, sumarColumna=0;
	var salir = false;

	if(!dentroDeTabla(fila, columna, direccion, longitud)){		
		return false;
	}

	if(direccion==0){
		
		for(var i=0; i<longitud; i++){
			 if(tablero[fila][columna+i]!="0"){
			 	return false;
			 }
		}
	} else{ 
		
		for(var i=0; i<longitud; i++){
			 if(tablero[fila+i][columna]!="0"){
			 	return false;
			 }
		}
	}
	return true;
}

function dentroDeTabla(fila, columna, direccion, longitud){
	if(direccion==0){
		if((columna+longitud)>NUM_COLUMNA){
			return false;
		}
	} else{
		if((fila+longitud)>NUM_FILA){
			return false;
		}
	}
	return true;
}

function rellenarCampo(fila, columna, direccion, longitud, flota, tablero){
	var sumarFila=1, sumarColumna=1, casilla;
	var filaDentro=0, columnaDentro=0;

	if(direccion==0){
		sumarColumna+=longitud-1;
		columnaDentro+=longitud-1;
	} else{ 
		sumarFila+=longitud-1; 
		filaDentro+=longitud-1;
	}

	for (var i = fila-1; i <= fila+sumarFila; i++) {
		if (!(i>=0&&i<=tablero.length-1)){ continue;}
		for (var j = columna-1; j<=columna+sumarColumna; j++){
			if(j>tablero[0].length-1){
				break;
			}else if(j<0){
				continue;
			}
			
			if(i>=fila&&i<=fila+filaDentro&&j>=columna&&j<=columna+columnaDentro){
				if(direccion==0){ tablero[i][j] = flota+"-"; }
					else{ tablero[i][j] = flota+"|"; }

				casilla = document.getElementById("b_"+i+"_"+j);	
				casilla.style.backgroundColor = COLOR_FLOTA;
				
			}else if(tablero[i][j]=="0"){
				tablero[i][j] = "x";
				
			}
		}
	}
}


function generarAleatorio(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function dibujarFlotaMolde(elemento_id){
	var elemento_canva = document.getElementById(elemento_id);
	var tamano = parseInt(elemento_canva.id.split("_")[0]);
	var celdaPorCasilla = 50;
	var lapiz = elemento_canva.getContext("2d");

	elemento_canva.style.border = "1px solid black"

	rellenarColorMolde(elemento_id, COLOR_MOLDE);

	for(var i = 1; i<tamano; i++){
		lapiz.moveTo(celdaPorCasilla*i, 0);
		lapiz.lineTo(celdaPorCasilla*i, elemento_canva.clientHeight);
	}

	lapiz.stroke();
}


function disparar(elemento, jugador, interval){
	var fila, columna, tableroADisparar, casilla, mapaPropio, flotasAdisparar, ultimoDisparo, flota, tamano, funAsyncPos;
	elemento_id = elemento.id.split("_");
	fila = elemento_id[1];
	columna = elemento_id[2];

	if(!comienzaJuego || juegoTerminado){
		return;
	}

	if(turno==0){  // si turno es igual a 0, el jugador 1 dispara al jugador 2
		tableroADisparar=tableroOrdenador;
		flotasAdisparar = flotasOrdenador;
		ultimoDisparo = ultimoDisparo2;
	} else{
		tableroADisparar=tableroJugador;
		flotasAdisparar = flotasJugador;
		ultimoDisparo = ultimoDisparo1;
	}
	
	casilla = document.getElementById(JUGADORES[jugador]+"_"+fila+"_"+columna);
	
	if(turno==1){
		clearTimeout(f);
	}

	if(tableroADisparar[fila][columna]=="O" || tableroADisparar[fila][columna][tableroADisparar[fila][columna].length-1]=="Q"){
		if(turno==1){
			disparaOrdenador();
		}
	} else{
		flota = tableroADisparar[fila][columna].substring(0, tableroADisparar[fila][columna].length-1);
		if(flotas.includes(flota)){

			flotasAdisparar[flota]--;
			tamano = flotasAdisparar[flota];
			
			if(0==tamano--){
				rellenarVacios(fila, columna, tableroADisparar[fila][columna], jugador);
			}

			tableroADisparar[fila][columna] = tableroADisparar[fila][columna]+"Q";
			casilla.innerHTML = "X";
			casilla.style.backgroundColor = COLOR_FLOTA;
			//mapaPropio.style.backgroundColor = casilla.style.backgroundColor;
			//mapaPropio.innerHTML = "X";

			if(esFlotasVacio(flotasAdisparar)){
				if(jugador == 0){
					alert("Enhorabuena, has ganado esta batalla!");
				}else{
					alert("Que lastima, ha ganado el ordenador!");
				}
				juegoTerminado = true;
			}

			if(turno==1){
				disparaOrdenador();
			}


		}else{
			tableroADisparar[fila][columna] = "O";
		
			if(ultimoDisparo[0]!=null){
				var casillaUltima = document.getElementById((JUGADORES[jugador])+"_"+ultimoDisparo[0]+"_"+ultimoDisparo[1]);
				casillaUltima.style.backgroundColor = COLOR_RODEADO;
			}
			ultimoDisparo[0] = fila, ultimoDisparo[1] = columna;
			if(casilla.style.backgroundColor==""){ casilla.style.backgroundColor = COLOR_AGUA;}

			if(turno==1){
				x = setTimeout(function(){document.getElementById(ID_PARARJUEGO).style.zIndex = "-1"; clearTimeout(x);/*console.log("clear x")*/}, 1000);
			}
			cambiarJugador();	
		}
	}
}

function generarFlota(jugador){
	var longitud, fila, columna, casilla, x, y, cajaColocar;
	var direccion; /* 0 restringe por columnas ----- ,  1 por filas |*/

	for( flota in flotas){
		longitud = parseInt(flotas[flota].charAt(0));
		do{
			direccion = generarAleatorio(0, 1);
			if(direccion==0){
				fila = generarAleatorio(0, NUM_FILA-1);
				columna = generarAleatorio(0, (NUM_COLUMNA-1)-longitud);
			} else{
				fila = generarAleatorio(0, (NUM_FILA-1)-longitud);
				columna = generarAleatorio(0, NUM_COLUMNA-1);
			}
		} while(!casillaValida(fila, columna, direccion, longitud, jugador));

		rellenar(fila, columna, direccion, longitud, flotas[flota], jugador);
		
		flotaActual = flotas[flota];
	}

	if(jugador==0){
		cajaColocar = getById(ID_CONFIGURARFLOTA);
		cajaColocar.style.transform = "scale(0,0)";
		setTimeout(function(){
			getById(ID_CONFIGURARFLOTA).innerHTML = "Juego en partida";
			comienzaJuego = true;
		}, 2000);
	}
}

function rellenar(fila, columna, direccion, longitud, flota, jugador){
	var sumarFila=1, sumarColumna=1, casilla, listaJugador;
	var filaDentro=0, columnaDentro=0;
	if(jugador==0){listaJugador=tableroJugador}
		else{listaJugador=tableroOrdenador}
	if(direccion==0){
		sumarColumna+=longitud-1;
		columnaDentro+=longitud-1;
	} else{ 
		sumarFila+=longitud-1; 
		filaDentro+=longitud-1;
	}

	for (var i = fila-1; i <= fila+sumarFila; i++) {
		if (!(i>=0&&i<=listaJugador.length-1)){ continue;}
		for (var j = columna-1; j<=columna+sumarColumna; j++){
			if(j>listaJugador[0].length-1){
				break;
			}else if(j<0){
				continue;
			}
			
			if(i>=fila&&i<=fila+filaDentro&&j>=columna&&j<=columna+columnaDentro){
				if(direccion==0){ listaJugador[i][j] = flota+"-"; }
					else{ listaJugador[i][j] = flota+"|"; }

				if(jugador==0){
					casilla = document.getElementById(JUGADORES[(jugador+1)%2]+"_"+i+"_"+j);	
					casilla.style.backgroundColor = COLOR_FLOTA;
				}
				
			}else if(listaJugador[i][j]=="0"){
				listaJugador[i][j] = "x";
				
			}
		}
	}
}

function rellenarVacios(row, column, flota, jugador){
	var listaFlotas, casillaPropio, casillaContricante, listaJugador, fila, columna, longitud;
	var sumarFila=1, sumarColumna=1, casilla;
	var filaDentro=0, columnaDentro=0;

	if(jugador==0){
		listaFlotas = flotasOrdenador;
		listaJugador = tableroOrdenador;
	} else{
		listaFlotas = flotasJugador;
		listaJugador = tableroJugador;
	}

	longitud = parseInt(flota.charAt(0));
	fila = parseInt(row);
	columna = parseInt(column);

	if(flota.charAt(flota.length-1)=="-"){
		if(columna-1>=0){
			for(var i=columna-1; listaJugador[fila][i]==flota+"Q"; i--){
				columna = i;
			}
		}
		sumarColumna+=longitud-1;
		columnaDentro+=longitud-1;
	} else{
		if((fila-1)>=0){
			for(var i=fila-1; listaJugador[i][columna]==flota+"Q"; i--){
				fila = i;
			}
		}
		sumarFila+=longitud-1; 
		filaDentro+=longitud-1;
	}

	for (var i = fila-1; i <= fila+sumarFila; i++) {
		if (!(i>=0&&i<=listaJugador.length-1)){ continue;}
		for (var j = columna-1; j<=columna+sumarColumna; j++){
			if(j>listaJugador[0].length-1){
				break;
			}else if(j<0){
				continue;
			}
			
			
			casillaContricante = document.getElementById(JUGADORES[jugador]+"_"+i+"_"+j);

			if(casillaContricante.style.backgroundColor=="" || casillaContricante.style.backgroundColor=="black"){
				casillaContricante.style.backgroundColor = COLOR_RODEADO;
			}
			if(listaJugador[i][j]!=flota){
				listaJugador[i][j] = "O";
			}
		}
	}
}

function casillaValida(fila, columna, direccion, longitud, jugador){
	var sumarFila=0, sumarColumna=0, listaJugador;
	if(jugador==0){listaJugador=tableroJugador}
		else{listaJugador=tableroOrdenador}

	if(direccion==0){
		sumarColumna+=longitud;
	} else{ 
		sumarFila+=longitud; 
	}

	for (var i = fila; i <= fila+sumarFila; i++) {
		if (!(i>=0&&i<=listaJugador.length-1)){ continue;}
		for (var j = columna; j<=columna+sumarColumna; j++){
			if(j>listaJugador[0].length-1){
				break;
			}
			if(j<0){ continue;}
			if(listaJugador[i][j]!="0"){
				return false;
			}
		}
	}	
	return true;
}

function cambiarJugador(){
	if(turno==0){
		disparaOrdenador();
	}
	turno = (turno+1) % 2;

	//document.getElementById("turno").innerHTML = "Turno del jugador " + (turno+1);
}

function disparaOrdenador(){
	var divOcultar = document.getElementById(ID_PARARJUEGO);
	divOcultar.style.zIndex = "10";
	var casilla = document.getElementById("b_"+ generarAleatorio(0,9) + "_" + generarAleatorio(0,9));

	f = setTimeout( function(casilla){
        disparar(casilla, 1);
    } ,1100, casilla);
    //console.log(f);
}

function esFlotasVacio(flotas){
	var vacio = true;
	for( i in flotas){
		if(flotas[i]!=0){
			return false;
		}
	}
	return vacio;
}

function borrarFlota(jugador) {
	var listaJugador;
	if(jugador==0){listaJugador=tableroJugador}
		else{listaJugador=tableroOrdenador}

    if (flotaActual == flotas[0]) {

    } else {
    	flotaActual = flotas[0];
        for (var i = 0; i < NUM_FILA; i++) {
            for (var j = 0; j < NUM_COLUMNA; j++) {
                document.getElementById(JUGADORES[(jugador+1)%2] + "_" + i + "_" + j).style.backgroundColor = "";
                listaJugador[i][j] = "0";
            }
        }
    }
}

function recolocarAleatoriamenteFlota(jugador){
	borrarFlota(jugador);

	generarFlota(jugador);
}