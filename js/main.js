/* -------------------------------------------------------------------------- */
/*                                LOCAL STORAGE                               */
/* -------------------------------------------------------------------------- */

let record = localStorage.getItem('record') ?? 0;

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
        this.etiqueta = '<img src="src/img/zombieIF.png" alt="enemigo">';
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.speed = speed;
        this.angulo = 0;
        this.vivo = true;
        this.anguloObjeto = 0;
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

    salirObjeto(){
        this.x += this.speed * Math.cos(this.angulo);
        this.y += this.speed * Math.sin(this.angulo);
    }

    getAnguloEntrePuntos({x, y}){
        this.angulo = Math.atan2(this.y-y, this.x-x);
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
    constructor(id, x, y, angulo){
        this.id= id;
        this.x= x;
        this.y= y;
        this.speed= 10;
        this.ancho = 10;
        this.alto = 10;
        this.angulo= angulo;
        this.etiqueta= '<img src="src/img/bala.png" alt="bala">';
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
        this.x += this.speed * Math.cos(this.angulo);
        this.y += this.speed * Math.sin(this.angulo);
    }
    
    obtenerID(){
        return document.querySelector(('#bala'+this.id));
    }

    actualizarPosicion(){
        const proyectil = this.obtenerID();
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
    if(!gamePause && !gameOver && !gameWin){
        jugador.x= capturarX();
        jugador.y= capturarY();

        arrayObstacle.forEach((el)=> {
            noTraspasar(el);
        });

        nuevosEnemigos();

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
        if(balas>0){
            if(event.key == 'j'){
                balas--;
                const h2 = document.querySelector('#talk-pj');
                h2.innerText = "me quedan" + balas;

                let balax = capturarX() + parseInt(jugador.ancho)/2;
                let balay = capturarY() + parseInt(jugador.alto)/2;
                const bullet = new Proyectil(cantDisparos, balax, balay, jugador.angulo);
                cantDisparos++;
                
                bullet.dibujar();
                bullet.actualizarPosicion();
                arrayDisparos.push(bullet);
            }
        }else{
            const h2 = document.querySelector('#talk-pj');
            h2.innerText = "debo recargar";
        }
        if(balas<30){
            event.key == 'r' && (balas =30);
        }
        
        arrayDisparos.forEach((tiro)=>{
            while(tiro.vivo){
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

        for(let i=0;i<arrayDisparos.length; i++){
            arrayDisparos[i].vivo == false && arrayDisparos.splice(i,1);
        }
        for(let i=0; i<arrayEnemigos.length; i++){
            arrayEnemigos[i].vivo == false && arrayEnemigos.splice(i,1);
        }

        arrayObstacle.forEach((el)=> {
            noTraspasar(el)
        });

        arrayEnemigos.forEach((enemigo)=>{
            estaDentro(enemigo) && matarPJ();
        })
    }
    /* PAUSA */

    /* AND */
    event.key == 'p' && (gamePause = !gamePause);

    mostrarPausa();
}

function onPausaClick(){
    gamePause = !gamePause;
}

function mostrarPausa(){
    if(!gameOver && gamePause && (document.querySelector('#pausa') == null)){
        const cartelPausa = document.createElement('article');
        cartelPausa.setAttribute("id", 'pausa');
        cartelPausa.setAttribute("onclick", 'onPausaClick()');
        cartelPausa.classList.add("pausaGame");
        cartelPausa.innerHTML = '<img src="src/img/pausa.png" alt="pausa">';

        juego.appendChild(cartelPausa);
    }else if((gamePause == false) && (document.querySelector('#pausa') != null)){
        let cartelPausa = document.querySelector('#pausa');
        cartelPausa.remove();
    }
}

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

function moverArriba(){
    jugador.nodo.style.top = jugador.y - jugador.speed + "px";
    jugador.cambiarAngulo((pi/2));
}
function moverAbajo(){
    
    jugador.nodo.style.top = jugador.y + jugador.speed + "px";
    jugador.cambiarAngulo((3*pi/2));

}
function moverDerecha(){
    const h2 = document.querySelector('#talk-pj');
    h2.innerText = "avancemos!";
    jugador.nodo.style.left = jugador.x + jugador.speed + "px";
    jugador.cambiarAngulo(0);
}
function moverIzquierda(){
    const h2 = document.querySelector('#talk-pj');
    h2.innerText = "retrocedan!";
    jugador.nodo.style.left = jugador.x - jugador.speed + "px";
    jugador.cambiarAngulo(pi);
}

function moverMapaIzquierda(){
    if(mapaDelJuego.x != 0){
        mapaDelJuego.nodo.style.left = mapaDelJuego.x + jugador.speed + "px";
        mapaDelJuego.x += jugador.speed;
        arrayObstacle.forEach((obst)=>{
            obst.moverConMapaDerecha(jugador)
            obst.actualizarPosicion();
        })
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
    }
    
}

/* -------------------------------------------------------------------------- */
/*                                 COLISIONES                                 */
/* -------------------------------------------------------------------------- */


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


/* DESESTRUCTURACION */


// JUGADOR TOCANDO UN OBJETO
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


function noTraspasar({x, y, ancho, alto}){
    if (estaDentro({x, y, ancho, alto})) {
        const h2 = document.querySelector('#talk-pj');
        h2.innerText = "choque un auto";
        
        if (jugador.x  > x && jugador.angulo == pi) {
            moverDerecha();
        }
        if (jugador.x < x && jugador.angulo == 0) {
            moverIzquierda();
        }
        if (jugador.y < y && jugador.angulo == (3*pi/2)) {
            moverArriba();
        }
        if (jugador.y > y && jugador.angulo == (pi/2)) {
            moverAbajo();
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

function cargarEnemigos(){
    for(let i=0; i<3; i++){
        let enemigo = new Enemy(i, Math.round(getRandomArbitrary((jugador.x + 300), (jugador.x + 1960))), Math.round(getRandomArbitrary(110, 420)), 70, 80, 10);
        arrayEnemigos.push(enemigo);
    }
}
function dibujarEnemigos(){
    for (const enemigo of arrayEnemigos) {
        enemigo.dibujar();
        enemigo.actualizarPosicion();
    }
}

function nuevosEnemigos(){
    if(arrayEnemigos.length < 2){
        let nuevoEnemigo = new Enemy(kills, Math.round(getRandomArbitrary((jugador.x + 400), jugador.x + 1000)), Math.round(getRandomArbitrary(140, 370)), 70, 80, 10);
        arrayEnemigos.push(nuevoEnemigo);
        nuevoEnemigo.dibujar();
        nuevoEnemigo.actualizarPosicion();
    }
}

function cargarObstaculos(){
    for(let i=0; i<3; i++){
        const obstaculo = new Obstaculo(i, Math.round(getRandomArbitrary(400, 1980)), Math.round(getRandomArbitrary(110, 420)), 250, 100);
        arrayObstacle.push(obstaculo);
    }
}
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
/*                                  CREACION                                  */
/* -------------------------------------------------------------------------- */

function matarPJ(){
    const menu = document.querySelector('#menu');
    menu.style.display = 'flex';
    gamePause = true;
    gameOver = true;
    arrayEnemigos.forEach((enemigo) => {
        enemigo.eliminar();
    });
    arrayObstacle.forEach((obst) => {
        obst.eliminar();
    });
}


function onJugarClick(){
    const menu = document.querySelector('#menu');
    menu.style.display = 'none';
    arrayDisparos = [];
    arrayEnemigos = [];
    arrayObstacle = [];
    cantDisparos = 0;
    kills =0;
    balas =30;
    mapaDelJuego = new MapaJuego();
    jugador = new Player(40, 260 , 70, 80, 10);
    jugador.iniciar();
    cargarEnemigos();
    dibujarEnemigos();
    cargarObstaculos();
    dibujarObstaculos();
    const cartel = document.querySelector('.cartel h2');
    cartel.innerText = "Record: "+ record +" | kills: "+ kills;
    gamePause = false;
    gameOver = false;
}

function generarMenu(){
    const menu = document.createElement('article');
    const jugar = document.createElement('div');
    const niveles = document.createElement('div');
    const opciones = document.createElement('div');
    
    menu.setAttribute("id", 'menu');
    menu.classList.add("menu");
    
    jugar.setAttribute("id", 'jugar');
    jugar.classList.add("jugar");
    jugar.setAttribute("onclick", 'onJugarClick()');
    jugar.innerHTML = '<img src="src/img/jugar.png" alt="pausa">'
    
    niveles.setAttribute("id", 'niveles');
    niveles.classList.add("niveles");
    niveles.setAttribute("onclick", 'onNivelesClick()');
    niveles.innerHTML = '<img src="src/img/niveles.png" alt="pausa">'
    
    
    opciones.setAttribute("id", 'opciones');
    opciones.classList.add("opciones");
    opciones.setAttribute("onclick", 'onOpcionesClick()');
    opciones.innerHTML = '<img src="src/img/opciones.png" alt="pausa">'
    
    menu.innerHTML = '<h2>COD WarZombie</h2>'
    menu.appendChild(jugar);
    menu.appendChild(niveles);
    menu.appendChild(opciones);
    
    juego.appendChild(menu);
}
/* MENU */

generarMenu();

/* Estado del juego */
let gamePause = true;
let gameOver = true;
let gameWin = false;

/* MAPA */
let mapaDelJuego;

/* JUGADOR */
const pi = Math.PI;
let cantDisparos = 0;
let kills =0;
let balas =30;

let jugador;

/* PROYECTIL */

let arrayDisparos;

/* ENEMIGOS */

let arrayEnemigos;

/* OBSTACULOS */

let arrayObstacle;

/* event listener */

document.addEventListener("keydown", movimiento);




/* setInterval(); */
