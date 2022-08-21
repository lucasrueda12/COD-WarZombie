
/* -------------------------------------------------------------------------- */
/*                                LOCAL STORAGE                               */
/* -------------------------------------------------------------------------- */

let record = localStorage.getItem('record') ?? 0;
let subsStorage= localStorage.getItem('suscriptores') ?? [];
suscriptores= JSON.parse(subsStorage);

/* subi la variable juego para que no tenga conflictos con funciones y variables */
const juego = document.querySelector('#juego');


/* -------------------------------------------------------------------------- */
/*                                   CLASES                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    MAPA                                    */
/* -------------------------------------------------------------------------- */

class MapaJuego{
    constructor() {
        this.nodo = document.querySelector('#fondo');
        this.x = 0;
        this.y = 0;
        this.ancho = 1980;
        this.alto = 600;
    }

    iniciar(){
        let mapa = this.nodo
        mapa.style.top = this.y + 'px';
        mapa.style.left = this.x + 'px';
    }
}

/* -------------------------------------------------------------------------- */
/*                                   JUGADOR                                  */
/* -------------------------------------------------------------------------- */

class Player{
    constructor(x, y, ancho, alto, speed){
        this.nodo = document.querySelector('#player');
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.angulo = 0;
        this.speed = speed;
    }
    cambiarAngulo(angulo){
        this.angulo = angulo;
    }

    iniciar(){
        let jugador = this.nodo
        jugador.style.top = this.y + 'px';
        jugador.style.left = this.x + 'px';
    }
}

/* -------------------------------------------------------------------------- */
/*                                   ENEMIGO                                  */
/* -------------------------------------------------------------------------- */

class Enemy{
    constructor(id, x, y, ancho, alto, speed){
        this.id = id;
        this.claseEnemy= "enemy";
        this.etiqueta = '<img src="src/img/Zombie_Sprite.png" alt="enemigo">';
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.speed = speed;
        this.angulo = 0;
        this.vivo = true;
    }

    dibujar(){
        let nuevoEnemigo = document.createElement("article");
        nuevoEnemigo.setAttribute("id", `enemy${this.id}`);
        nuevoEnemigo.classList.add(this.claseEnemy);
        nuevoEnemigo.innerHTML = this.etiqueta;

        juego.appendChild(nuevoEnemigo);
    }

    eliminar(){
        let ene = document.querySelector('#enemy'+this.id);
        ene.remove();
    }

    obtenerID(){
        return document.querySelector(('#enemy'+this.id));
    }

    actualizarPosicion(){
        const enemigo = this.obtenerID();
        enemigo.style.top = this.y + 'px';
        enemigo.style.left = this.x + 'px';
    }

    moverse() {
        this.x -= this.speed * Math.cos(this.angulo);
        this.y -= this.speed * Math.sin(this.angulo);
    }
    
    retroceder(){
        this.x += this.speed * Math.cos(this.angulo);
        this.y += this.speed * Math.sin(this.angulo);
    }

    salirObjeto(){
        this.x += this.speed * Math.cos(this.angulo);
        this.y += this.speed * Math.sin(this.angulo);
    }

    getAnguloEntrePuntos({x, y, ancho, alto}){
        this.angulo = Math.atan2(this.y- (y+(alto/2)), this.x-(x+(ancho/2)));
    }
}

/* -------------------------------------------------------------------------- */
/*                                 OBSTACULOS                                 */
/* -------------------------------------------------------------------------- */

class Obstaculo{
    constructor(id, x, y, ancho, alto){
        this.id = id;
        this.idQuery= `#auto${id}`;
        this.obstClase = "auto";
        this.etiqueta= `<img src="src/img/auto.png" alt="auto">`;
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }

    dibujar(){
        let cajaObst = document.createElement("article");
        cajaObst.setAttribute("id", `auto${this.id}`);
        cajaObst.classList.add("auto");
        cajaObst.innerHTML = this.etiqueta;

        juego.appendChild(cajaObst);
    }
    eliminar(){
        let obstaculo = document.querySelector(this.idQuery);
        obstaculo.remove();
    }

    obtenerID(){
        return document.querySelector(('#auto'+this.id));
    }

    actualizarPosicion(){
        const obstaculo = this.obtenerID();
        obstaculo.style.top = this.y + 'px';
        obstaculo.style.left = this.x + 'px';
    }

    cambiarPosicion(){
        this.x = Math.round(getRandomArbitrary(300, 1980));
        this.y = Math.round(getRandomArbitrary(110, 420));
    }

    moverConMapaDerecha({speed}){
        this.x += speed;
    }
    moverConMapaIzquierda({speed}){ 
        this.x -= speed;
    }
}

/* -------------------------------------------------------------------------- */
/*                                  PROYECTIL                                 */
/* -------------------------------------------------------------------------- */

class Proyectil{
    constructor(id, x, y, angulo, speed){
        this.id= id;
        this.x= x;
        this.y= y;
        this.speed= speed;
        this.ancho = 10;
        this.alto = 10;
        this.angulo= angulo;
        this.etiqueta= '<img src="src/img/shotBit.png" alt="bala">';
        this.vivo = true;
    }

    dibujar(){
        let disparo = document.createElement("article");
        disparo.setAttribute("id", `bala${this.id}`);
        disparo.classList.add("bala");
        disparo.innerHTML = this.etiqueta;

        juego.appendChild(disparo);
    }

    eliminar(){
        let bala = document.querySelector('#bala'+this.id);
        bala.remove();
    }


    desplazar(){
        this.x -= this.speed * Math.cos(this.angulo);
        this.y -= this.speed * Math.sin(this.angulo);
    }
    
    obtenerID(){
        return document.querySelector(('#bala'+this.id));
    }

    actualizarPosicion(){
        const proyectil = this.obtenerID();
        proyectil.style.transform = `rotate(${this.angulo}rad)`;
        proyectil.style.top = this.y + 'px';
        proyectil.style.left = this.x + 'px';
    }
}


/* -------------------------------------------------------------------------- */
/*                                  FUNCIONES                                 */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                                 MOVIMIENTOS                                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              TECLAS Y ACCIONES                             */
/* -------------------------------------------------------------------------- */

function movimiento(event) {
    console.log('teclado');
    if(!gamePause && !gameOver && !gameWin){
        jugador.x= capturarX();
        jugador.y= capturarY();

        arrayObstacle.forEach((el)=> {
            noTraspasar(el);
        });

        /* mov */
        if(event.key == 'w' && noAvanzarArriba(jugador.y)){
            moverArriba();
        }
        if(event.key == 's' && noAvanzarAbajo(jugador.y)){
            moverAbajo();
        }
        if(event.key == 'a' && noAvanzarIzquierda(jugador.x)){
            moverIzquierda();
            moverMapaIzquierda();
        }
        if(event.key == 'd' && noAvanzarDerecha(jugador.x)){
            moverDerecha();
            moverMapaDerecha();
        }

        /* tiro */
        if(balas<30){
            event.key == 'r' && (balas =30);
        }

    }
    /* PAUSA */

    /* AND */
    event.key == 'p' && (gamePause = !gamePause);

    mostrarPausa();
}

function getAngulo(balax, balay, mousex, mousey){
    return angulo = Math.atan2(balay- mousey, balax- mousex);
}

function clickDisparo(event){
    console.log(event.clientX, event.clientY);
    if(!gamePause && !gameOver){
        if(balas>0){

            balas--;
            const h2 = document.querySelector('#talk-pj');
            h2.innerText = "me quedan" + balas;
    
            let balax = capturarX() + parseInt(jugador.ancho)/2;
            let balay = capturarY() + parseInt(jugador.alto)/2;
            const bullet = new Proyectil(cantDisparos, balax, balay, (getAngulo(balax, balay, event.clientX, event.clientY)), 20);
            cantDisparos++;
            
            bullet.dibujar();
            bullet.actualizarPosicion();
            arrayDisparos.push(bullet);
    
        }else{
            const h2 = document.querySelector('#talk-pj');
            h2.innerText = "debo recargar";
        }
    }
}


/* CAMPTURO LAS COORDENADAS DEL JUGADOR */
function capturarX(){
    let leftValor = window.getComputedStyle(jugador.nodo).getPropertyValue('left');
    
    let x = parseInt(leftValor);
    return x;
}
function capturarY(){
    let topValor = window.getComputedStyle(jugador.nodo).getPropertyValue('top');
    
    let y = parseInt(topValor);
    return y;
}

/* MUEVO AL JUGADOR SEGUN LAS DIRECCIONES, MODIFICO SU ANGULO PARA LA COLISION CON OBSTACULOS */
function moverArriba(){
    jugador.nodo.style.top = jugador.y - jugador.speed + "px";
    jugador.cambiarAngulo((pi/2));
}
function moverAbajo(){
    jugador.nodo.style.top = jugador.y + jugador.speed + "px";
    jugador.cambiarAngulo((3*pi/2));
}
/* TAMBIEN MODIFICO LA POSICION DEL MAPA Y VOLTEO LA IMG DEL JUGADOR */
function moverDerecha(){
    const h2 = document.querySelector('#talk-pj');
    h2.innerText = "avancemos!";
    jugador.nodo.classList.remove("rota-horizontal");
    jugador.nodo.style.left = jugador.x + jugador.speed + "px";
    jugador.cambiarAngulo(0);
}
function moverIzquierda(){
    const h2 = document.querySelector('#talk-pj');
    h2.innerText = "retrocedan!";
    jugador.nodo.classList.add("rota-horizontal");
    jugador.nodo.style.left = jugador.x - jugador.speed + "px";
    jugador.cambiarAngulo(pi);
}
/* MOV DEL MAPA */
function moverMapaIzquierda(){
    if(mapaDelJuego.x != 0){
        mapaDelJuego.nodo.style.left = mapaDelJuego.x + jugador.speed + "px";
        mapaDelJuego.x += jugador.speed;
        arrayObstacle.forEach((obst)=>{
            obst.moverConMapaDerecha(jugador)
            obst.actualizarPosicion();
        })
        arrayEnemigos.forEach((enemigo)=> {
            if (enemigo.vivo == true){
                enemigo.getAnguloEntrePuntos(jugador);
                enemigo.retroceder();
                enemigo.actualizarPosicion();
                for(const obst of arrayObstacle){
                    if(choqueObjtos(enemigo, obst)){
                        enemigo.getAnguloEntrePuntos(obst);
                        enemigo.salirObjeto();
                        enemigo.actualizarPosicion();
                    }
                }
            }
        });
    }
}
function moverMapaDerecha(){
    if(mapaDelJuego.x != (-520)){
        mapaDelJuego.nodo.style.left = mapaDelJuego.x - jugador.speed + "px";
        mapaDelJuego.x -= jugador.speed;
        arrayObstacle.forEach((obst)=>{
            obst.moverConMapaIzquierda(jugador);
            obst.actualizarPosicion();
        })
        arrayEnemigos.forEach((enemigo)=> {
            if (enemigo.vivo == true){
                enemigo.getAnguloEntrePuntos(jugador);
                enemigo.moverse();
                enemigo.actualizarPosicion();
                for(const obst of arrayObstacle){
                    if(choqueObjtos(enemigo, obst)){
                        enemigo.getAnguloEntrePuntos(obst);
                        enemigo.salirObjeto();
                        enemigo.actualizarPosicion();
                    }
                }
            }
        });
    }
    
}

/* -------------------------------------------------------------------------- */
/*                                 COLISIONES                                 */
/* -------------------------------------------------------------------------- */

/* CHEQUEO CUANDO EL PERSONAJE SOBREVAPSE LOS LIMITES ESTABECIDOS */
/* if ternarios */
function noAvanzarArriba(y){
    return (y<=110)? false : true;
}
function noAvanzarAbajo(y){
    return y>=420? false : true;
}
function noAvanzarIzquierda(x){
    return x<=5? false : true;
}
function noAvanzarDerecha(x){
    return x>=1960? false : true;
}

/* PREGUNTO SI EL PERSONAJE ESTA TOCANDO UN OBJETO */
function estaDentro({x, y, ancho, alto}){
    return (jugador.x < x+ancho  && jugador.x+jugador.ancho > x
    && jugador.y < y+alto && jugador.y+jugador.alto > y);
}

// CHOQUE DE OBJETOS
function choqueObjtos(ob1, ob2){
    return (ob1.x < ob2.x + ob2.ancho  && ob1.x + ob1.ancho > ob2.x
        && ob1.y < ob2.y + ob2.alto && ob1.y + ob1.alto > ob2.y);
}

// SE ESCAPO DEL ENTORNO
function escapoRango({x, y}){
    return (x < jugador.x-600 || x> jugador.x+600 || y < jugador.y-600 || y> jugador.y +600);
}

// MUEVO AL JUGADOR HASAT QUE SALGA DEL OBJETO
function noTraspasar({x, y, ancho, alto}){
    while(estaDentro({x, y, ancho, alto})) {
        const h2 = document.querySelector('#talk-pj');
        h2.innerText = "choque un auto";
        
        jugador.x= capturarX();
        jugador.y= capturarY();

        if (jugador.x  > x && jugador.angulo == pi) {
            moverDerecha();
            jugador.angulo = pi;
        }
        if (jugador.x < x && jugador.angulo == 0) {
            moverIzquierda();
            jugador.angulo = 0;
        }
        if (jugador.y < y && jugador.angulo == (3*pi/2)) {
            moverArriba();
            jugador.angulo = (3*pi/2);
        }
        if (jugador.y > y && jugador.angulo == (pi/2)) {
            moverAbajo();
            jugador.angulo = (pi/2);
        }
    }
}

// generar valores randoms
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/* -------------------------------------------------------------------------- */
/*                                   GENERAR                                  */
/* -------------------------------------------------------------------------- */
// GENERO LOS PRIMEROS ENEMIGOS
function cargarEnemigos(){
    for(let i=0; i<numEnemigos; i++){
        let enemigo = new Enemy(i, Math.round(getRandomArbitrary((jugador.x + 400), (jugador.x + 1960))), Math.round(getRandomArbitrary(110, 420)), 70, 80, 10);
        arrayEnemigos.push(enemigo);
    }
}
// INSERTO EL DOM DE LOS ENEMIGOS
function dibujarEnemigos(){
    for (const enemigo of arrayEnemigos) {
        enemigo.dibujar();
        enemigo.actualizarPosicion();
    }
}

/* 
    NUEVOS ENEMIGOS
 */

function nuevosEnemigos(){
    while(arrayEnemigos.length < cantEnemigosRonda){
        numEnemigos++
        if(numEnemigos%2 == 0){
            let nuevoEnemigo = new Enemy(numEnemigos, Math.round(getRandomArbitrary((jugador.x + 400), jugador.x + 1000)), Math.round(getRandomArbitrary(140, 370)), 70, 80, 10);
            arrayEnemigos.push(nuevoEnemigo);
            nuevoEnemigo.dibujar();
            nuevoEnemigo.actualizarPosicion();
        }else{
            let nuevoEnemigo = new Enemy(numEnemigos, Math.round(getRandomArbitrary((jugador.x - 400), jugador.x - 1000)), Math.round(getRandomArbitrary(140, 370)), 70, 80, 10);
            nuevoEnemigo.etiqueta = '<img src="src/img/Zombie_SpriteInversa.png" alt="enemigo">';
            arrayEnemigos.push(nuevoEnemigo);
            nuevoEnemigo.dibujar();
            nuevoEnemigo.actualizarPosicion();
        }
    }
}
// CARGO LOS OBSTACULOS DEL MAPA
function cargarObstaculos(){
    for(let i=0; i<3; i++){
        const obstaculo = new Obstaculo(i, Math.round(getRandomArbitrary(400, 1980)), Math.round(getRandomArbitrary(110, 420)), 250, 100);
        arrayObstacle.push(obstaculo);
    }
}
// INSERTO EL DOM DE LOS OBSTACULOS, SI LOS OBSTACULOS SE PISAN SE VUELVEN A UBICAR 
function dibujarObstaculos(){
    for(const obstaculo of arrayObstacle){
        obstaculo.dibujar();
        obstaculo.actualizarPosicion();
        for(const otroObst of arrayObstacle){
            if(obstaculo.id != otroObst.id){
                let toca = true;
                while(toca){
                    if(choqueObjtos(obstaculo, otroObst)){
                        obstaculo.cambiarPosicion();
                        obstaculo.actualizarPosicion();
                    }else {
                        toca = false;
                    }
                }
            }
        }
    }
}

/* -------------------------------------------------------------------------- */
/*                               TICK DEL JUEGO                               */
/* -------------------------------------------------------------------------- */

// CON EL TICK EJECUTO TODAS LAS FUNCIONES DE MOVIMIENTOS DE ENEMIGOS, CHEQUEO LAS COLISIONES, VERIFICO SI LAS BALAS IMPACTARON CONTRA UN OBJ O SI SE ESCAPARON.
// TAMBIEN SI MURIERON TODOS LOS ENEMIGOS DE LA RONDA PARA GENERAR NUEVOS Y SI ALGUN ENEMIGO TOCO AL JUGADOR.

function tickGame(){
    tick = setInterval(()=>{
        if(!gamePause && !gameOver){
            jugador.x= capturarX();
            jugador.y= capturarY();
    
            /* Q EL JUGADOR NO TRASPASE LOS OBSTACULOS */
            arrayObstacle.forEach((el)=> {
                noTraspasar(el);
            });
            
            /* NUEVOS ENEMIGOS SI TERMINO LA RONDA */
            if(arrayEnemigos.length == 0 && rondaInicio){
                ronda++;
                if(rondaInicio){
                    rondaInicio = false;
                    cantEnemigosRonda += 2;
                    const cartelRonda= document.createElement('article');
                    cartelRonda.setAttribute("id", 'ronda');
                    cartelRonda.classList.add("rondaCartel");
                    cartelRonda.innerHTML = `<h2>${ronda}</h2>`;
                    juego.appendChild(cartelRonda);
                    setTimeout(()=>{
                        nuevosEnemigos();
                        rondaInicio=true;
                        const cartelRon = document.querySelector('#ronda');
                        cartelRon.remove();
                    }, 10000);
                }
            }
            
            /* MOVIMIENTO DE LOS ENEMIGOS Y QUE NO TRASPASEN LSO OBSTACULOS */
            arrayEnemigos.forEach((enemigo)=> {
                if (enemigo.vivo == true){
                    console.log(enemigo.angulo, enemigo.id);
                    enemigo.getAnguloEntrePuntos(jugador);
                    enemigo.moverse();
                    enemigo.actualizarPosicion();
                    for(const obst of arrayObstacle){
                        if(choqueObjtos(enemigo, obst)){
                            enemigo.getAnguloEntrePuntos(obst);
                            enemigo.salirObjeto();
                            enemigo.actualizarPosicion();
                        }
                    }
                }
            });
            
            /* MOVIMIENTOS DEL DISPARO E INTERACCION */
            arrayDisparos.forEach((tiro)=>{
                if(tiro.vivo){
                    console.log(tiro.x, tiro.y);
                    tiro.desplazar();
                    tiro.actualizarPosicion();
                    if(escapoRango(tiro)){
                        tiro.eliminar();
                        tiro.vivo = false;
                        const h2 = document.querySelector('#talk-pj');
                        h2.innerText = "fue un tiro de advertencia";
                    }
                    if(tiro.vivo){
                        for(const enemigo of arrayEnemigos){
                            if(choqueObjtos(tiro, enemigo)){
                                tiro.eliminar();
                                tiro.vivo = false;
                                enemigo.eliminar();
                                enemigo.vivo = false;
                                
                                const h2 = document.querySelector('#talk-pj');
                                h2.innerText = "mate un zombie";
    
                                kills++;
                                const cartel = document.querySelector('.cartel h2');
                                cartel.innerText = "Record: "+ record +" | kills: "+ kills;
    
                                kills >= record && localStorage.setItem('record', kills);
                                
                                record = localStorage.getItem('record') ?? 0;
                                cartel.innerText = "Record: "+ record +" | kills: "+ kills;
                            }
                        }
                    }
                    if(tiro.vivo){
                        for(const obst of arrayObstacle){
                            if(choqueObjtos(tiro, obst)){
                                tiro.eliminar();
                                tiro.vivo = false;
                                const h2 = document.querySelector('#talk-pj');
                                h2.innerText = "malditos autos";
                            }
                        }
                    }
                }
            });
            
            /* CHEQUEO DE EXISTENCIA DE LOS ENEMIGOS Y LOS DISPAROS */
            for(let i=0;i<arrayDisparos.length; i++){
                arrayDisparos[i].vivo == false && arrayDisparos.splice(i,1);
            }
            for(let i=0; i<arrayEnemigos.length; i++){
                arrayEnemigos[i].vivo == false && arrayEnemigos.splice(i,1);
            }
            
            /* PERDER PARTIDA SI JUGADOR FUE ALCANZADO POR UN ENEMIGO */
            arrayEnemigos.forEach((enemigo)=>{
                estaDentro(enemigo) && (gameOver = true);
            });
        }
        /* PAUSA */
        mostrarPausa();
        /* FIN DEL JUEGO */
        mostrarGameOver();
    }, 100);
}


// DETIENE EL JUEGO
function detenerTickGame(){
    clearInterval(tick);
}


/* -------------------------------------------------------------------------- */
/*                                    MENU                                    */
/* -------------------------------------------------------------------------- */
// PARA USAR EL CLICK PARA DESPAUSAR
function onPausaClick(){
    gamePause = !gamePause;
}

// MOSTRAR PAUSA
function mostrarPausa(){
    if(!gameOver && gamePause && (document.querySelector('#pausa') == null)){
        const cartelPausa = document.createElement('article');
        cartelPausa.setAttribute("id", 'pausa');
        cartelPausa.classList.add("pausaGame");
        cartelPausa.innerHTML = '<img class="botonPause" onclick="onPausaClick()" src="src/img/pausa.png" alt="pausa"><div class="exit" onclick="onclickPauseGameOver()"><img src="src/img/exitPixel.png" alt="gameOver"></div>';

        juego.appendChild(cartelPausa);
    }else if((gamePause == false) && (document.querySelector('#pausa') != null)){
        let cartelPausa = document.querySelector('#pausa');
        cartelPausa.remove();
    }
}
// SALIR AL MENU DESDE LA PAUSA
function onclickPauseGameOver(){
    let cartelPausa = document.querySelector('#pausa');
    cartelPausa.remove();
    terminarJuego();
}
// TERMINA EL JUEGO, RESTABLECE LAS VARIABLES, MUESTRA EL MENU, QUITA EL DOM DE LOS OBSTACULOS, ENEMIGOS Y BALAS
function terminarJuego(){
    if(document.querySelector('#ronda') != null){
        const cartelRon = document.querySelector('#ronda');
        cartelRon.remove();
    }
    const menu = document.querySelector('#menu');
    menu.style.display = 'flex';

    detenerTickGame();
    gamePause = true;
    gameOver = true;
    arrayDisparos.forEach((tiro)=>{
        tiro.eliminar();
    })
    arrayEnemigos.forEach((enemigo) => {
        enemigo.eliminar();
    });
    arrayObstacle.forEach((obst) => {
        obst.eliminar();
    });
    cantEnemigosRonda = 2;
    numEnemigos= 3;
}

/* -------------------------------------------------------------------------- */
/*                                   NIVELES                                  */
/* -------------------------------------------------------------------------- */

// GENERA EL DOM DE LA SECCION NIVEL, GENERA DOS TIPOS DE MAPAS PARA EL JUEGO, MUESTRA EN PANTALLA
function onNivelesClick(){
    let niveles = document.createElement('article');
    niveles.setAttribute("id", 'menuNiveles');
    niveles.classList.add("menuNiveles");

    /* fondoClaro */
    let fondo1 = document.createElement('div');
    fondo1.setAttribute("id", 'fondoClaro');
    fondo1.classList.add("fondoClaro");
    fondo1.setAttribute("onclick", 'fondoClaro()');
    fondo1.innerHTML = '<img src="src/img/calle.jpg" alt="calleClara">'

    /* fondoOscuro */
    let fondo2 = document.createElement('div');
    fondo2.setAttribute("id", 'fondoOscuro');
    fondo2.classList.add("fondoOscuro");
    fondo2.setAttribute("onclick", 'fondoOscuro()');
    fondo2.innerHTML = '<img src="src/img/calleOscura.jpg" alt="calleOsc">'

    /* flecha De Atras */
    let back= document.createElement('div');
    back.setAttribute("id", 'back');
    back.classList.add("back");
    back.setAttribute("onclick", 'volverAtrasLVL()');
    back.innerHTML = '<img src="src/img/flecha-hacia-atras.png" alt="flecha">'
    
    /* agregando a la pantalla */
    niveles.appendChild(fondo1);
    niveles.appendChild(fondo2);
    niveles.appendChild(back);

    juego.appendChild(niveles);
}
// LOS FONDOS DISPONIBLES
function fondoOscuro(){
    const fondo = document.querySelector('#fondo');
    fondo.style.background = 'url(../src/img/calleOscura.jpg)';
}
function fondoClaro(){
    const fondo = document.querySelector('#fondo');
    fondo.style.background = 'url(../src/img/calle.jpg)';
}
// BOTON PARA VOLVER ATRAS
function volverAtrasLVL(){
    let niveles = document.querySelector('#menuNiveles');
    niveles.remove();
}

/* -------------------------------------------------------------------------- */
/*                                  MARCADOR                                  */
/* -------------------------------------------------------------------------- */

// MUESTRA LA PANTALLA DEL MARCADOR DE PUNTAJE DEL JUEGO
function onMarcadorClick(){
    const marcador = document.createElement('div');
    marcador.setAttribute('id', 'menuMarcador');
    marcador.classList.add("menuMarcador");

    let back= document.createElement('div');
    back.setAttribute("id", 'back');
    back.classList.add("back");
    back.setAttribute("onclick", 'volverAtrasMarcador()');
    back.innerHTML = '<img src="src/img/flecha-hacia-atras.png" alt="flecha">'


    marcador.appendChild(back);
    
    /* fetch */
    mostrarScores();

    juego.appendChild(marcador);
}
// LLAMA AL JSON CON LOS MARCADORES
const mostrarScores = async () => {
    const response = await fetch('scores.json');
    const data = await response.json();
    const nodo = document.createElement('div');
    nodo.classList.add("nodo");

    let acumulador = ``;
    data.forEach((dato) => {
        acumulador += `<p class="jugadores"> ${dato.name}  ${dato.score}  ${dato.ronda}</p>`;
    });
    nodo.innerHTML = `<p>nombre------score:------ronda:</p>` +acumulador;
    let marcador = document.querySelector('#menuMarcador');
    marcador.appendChild(nodo);
}
//BOTON PARA VOLVER ATRAS DESDE EL MARCADOR
function volverAtrasMarcador(){
    let marcador = document.querySelector('#menuMarcador');
    marcador.remove();
}

// BOTON PARA EMPEZAR EL JUEGO, INICIALIZA LA VARIABLES NECESARIAS, LLAMA A LAS FUNCIONES DE LOS ENEMIGOS Y LOS OBSTACULOS.
// DESPUES DE ESTAR TODO LISTO ACTIVA EL JUEGO Y EL TICK
function onJugarClick(){
    
    /*  Ocultar menu */
    const menu = document.querySelector('#menu');
    menu.style.display = 'none';
    
    /* cargar variables y arrays */
    arrayDisparos = [];
    arrayEnemigos = [];
    arrayObstacle = [];
    cantDisparos = 0;
    kills =0;
    balas =30;
    ronda=0;
    rondaInicio= true;
    cantEnemigosRonda = 2;
    numEnemigos= 3;
    /* generar objetos */
    mapaDelJuego = new MapaJuego();
    mapaDelJuego.iniciar();
    jugador = new Player(40, 260 , 70, 80, 10);
    jugador.iniciar();
    cargarEnemigos();
    dibujarEnemigos();
    cargarObstaculos();
    dibujarObstaculos();
    const cartel = document.querySelector('.cartel h2');
    cartel.innerText = "Record: "+ record +" | kills: "+ kills;

    
    /* activar game */
    setTimeout(()=>{
        gamePause = false;
        gameOver = false;
    
        tickGame();
    },500);
    
    
}

// MUESTRA PANTALLA DE GAME OVER Y BOTON PARA VOLVER AL INICIO
function mostrarGameOver(){
    if(gameOver && (document.querySelector('#gameOver') == null)){
        const cartelGameover = document.createElement('article');
        cartelGameover.setAttribute("id", 'gameOver');
        cartelGameover.classList.add("gameOver");
        cartelGameover.innerHTML = '<div class="exit" onclick="onclickGameOver()"><img src="src/img/exitPixel.png" alt="gameOver"></div>';
        juego.appendChild(cartelGameover);
    }
}
// BOTON PARA VOLVER AL MENU DESDEC GAME OVER
function onclickGameOver() {
    const cartelGameover = document.querySelector('#gameOver');
    cartelGameover.remove();
    terminarJuego();
}

// GENERA EL MENU PRINCIPAL DEL JUEGO, CON LA INFORMACION DE LOS TECLAS Y LOS BOTONES DEL MENU
function generarMenu(){
    const menu = document.createElement('article');
    const jugar = document.createElement('div');
    const niveles = document.createElement('div');
    const marcador = document.createElement('div');
    const teclas= document.createElement('div');

    /* MENU */
    menu.setAttribute("id", 'menu');
    menu.classList.add("menu");
    
    /* JUGAR */
    jugar.setAttribute("id", 'jugar');
    jugar.classList.add("jugar");
    jugar.setAttribute("onclick", 'onJugarClick()');
    jugar.innerHTML = '<img src="src/img/Skirmish5.webp" alt="pausa">'
    
    /* NIVELES */
    niveles.setAttribute("id", 'niveles');
    niveles.classList.add("niveles");
    niveles.setAttribute("onclick", 'onNivelesClick()');
    niveles.innerHTML = '<img src="src/img/Stages.webp" alt="pausa">'
    
    /* MARCADOR */
    marcador.setAttribute("id", 'marcador');
    marcador.classList.add("marcador");
    marcador.setAttribute("onclick", 'onMarcadorClick()');
    marcador.innerHTML = '<img src="src/img/marcadores.webp" alt="pausa">'
    
    teclas.setAttribute("id", 'teclas');
    teclas.classList.add("teclas");
    teclas.innerHTML = "<p>W A S D movimiento, click disparar, R recargar, P pause</p>";


    menu.innerHTML = '<h2>COD WarZombie</h2>'
    menu.appendChild(jugar);
    menu.appendChild(niveles);
    menu.appendChild(marcador);
    menu.appendChild(teclas);

    juego.appendChild(menu);
}

/* LLAMA A LA FUNCION DEL MENU */
generarMenu();

/* -------------------------------------------------------------------------- */
/*                             VARIABLES GLOBALES                             */
/* -------------------------------------------------------------------------- */

/* Estado del juego */
let gamePause = true;
let gameOver = true;
let gameWin = false;

/* MAPA */
let mapaDelJuego;

/* JUGADOR */
const pi = Math.PI;
let cantDisparos;
let kills;
let balas;
let ronda;
let rondaInicio;
let cantEnemigosRonda;
let numEnemigos;
let jugador;

/* PROYECTIL */

let arrayDisparos;

/* ENEMIGOS */

let arrayEnemigos;

/* OBSTACULOS */

let arrayObstacle;

/* event listener Y TICK*/
let tick;

/* ESCUCHA AL TECLADO PARA REALIZAR LAS ACCIONES DEN EL JUEGO */
document.addEventListener("keydown", movimiento);
document.addEventListener("click", clickDisparo);

/* -------------------------------------------------------------------------- */
/*                                 FORMULARIO                                 */
/* -------------------------------------------------------------------------- */

/* SWEETALERT */
let nomYapellido;
let mail;
let compania;
let mensaje;

function traerDatosFormulario() {
    nomYapellido = document.getElementById('nomYapellido').value;
    mail = document.getElementById('mail').value;
    compania = document.getElementById('compania').value;
    mensaje = document.getElementById('mensaje').value;
    
    if( nomYapellido != "" && mail != ""){
        let esSusNuevo= true;
        suscriptores.forEach((elem)=>{
            if(elem.mail == mail){
                esSusNuevo= false;
            }
        })
        if(esSusNuevo){
            console.log(nomYapellido, mail, compania, mensaje);
            Swal.fire({
                icon: "success",
                title: "gracias por suscribirte",
                text: `${nomYapellido}, se te cobrara 10USD al mes, saludos `
            });
            /* agregar a la lista de subs */
            const sus = { nombre: nomYapellido, email: mail, compania: compania,mensaje:mensaje};
            suscriptores.push(sus);
            localStorage.setItem('suscriptores', JSON.stringify(suscriptores));
        }else{
            Swal.fire({
                icon: 'error',
                text: `Ya estas suscripto, paga lo que debes`
            });
        }
        
    }else{
        Swal.fire({
            icon: 'error',
            text: `Te faltan ingresar datos`
        });
    }
}

/* -------------------------------------------------------------------------- */
/*                             FIN DEL JAVASCRIPT                             */
/* -------------------------------------------------------------------------- */
