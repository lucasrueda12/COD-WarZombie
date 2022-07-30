/* -------------------------------------------------------------------------- */
/*                                   CLASES                                   */
/* -------------------------------------------------------------------------- */

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

    getAnguloEntrePuntos(playerX, playerY){
        this.angulo = Math.atan2(this.y-playerY, this.x-playerX);
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

    obtenerID(){
        return document.querySelector(('#auto'+this.id));
    }

    actualizarPosicion(){
        const obstaculo = this.obtenerID();
        obstaculo.style.top = this.y + 'px';
        obstaculo.style.left = this.x + 'px';
    }

    cambiarPosicion(){
        this.x = Math.round(getRandomArbitrary(400, 1170));
        this.y = Math.round(getRandomArbitrary(140, 380));
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
    jugador.x= capturarX();
    jugador.y= capturarY();
    

    arrayObstacle.forEach((el)=> {
        noTraspasar(el);
    });

    arrayEnemigos.forEach((enemigo)=> {
        enemigo.getAnguloEntrePuntos(jugador.x,jugador.y);
        enemigo.moverse();
        enemigo.actualizarPosicion();
        if(estaDentro(enemigo)){
            console.log("enemigo adentro");
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
    }
    if(event.key == 'd' && noAvanzarDerecha(jugador.x)){
        moverDerecha();
    }

    /* tiro */
    if(event.key == 'j'){
        let balax = capturarX() + parseInt(jugador.ancho)/2;
        let balay = capturarY() + parseInt(jugador.alto)/2;
        const bullet = new Proyectil(cantDisparos, balax, balay, jugador.angulo);
        cantDisparos++;
        const cartel = document.querySelector('.cartel h2');
        cartel.innerText = "Disparos: "+ cantDisparos + "";

        bullet.dibujar();
        bullet.actualizarPosicion();
        arrayDisparos.push(bullet);
    }
    arrayDisparos.forEach((tiro)=>{
        while(tiro.vivo){
            tiro.desplazar();
            tiro.actualizarPosicion();
            if(escapoEntorno(tiro)){
                tiro.eliminar();
                tiro.vivo = false;
                console.log("me escape del entorno");
            }
            if(tiro.vivo){
                for(const enemigo of arrayEnemigos){
                    if(choqueObjtos(tiro, enemigo)){
                        tiro.eliminar();
                        tiro.vivo = false;
                        enemigo.eliminar();
                        enemigo.vivo = false;
                        console.log("mate un zombie");
                    }
                }
            }
            if(tiro.vivo){
                for(const obst of arrayObstacle){
                    if(choqueObjtos(tiro, obst)){
                        tiro.eliminar();
                        tiro.vivo = false;
                        console.log("choque un auto");
                    }
                }
            }
        }
    });

    for(let i=0;i<arrayDisparos.length; i++){
        if(arrayDisparos[i].vivo == false){
            arrayDisparos.splice(i,1);
        }
    }
    for(let i=0; i<arrayEnemigos.length; i++){
        if(arrayEnemigos[i].vivo == false){
            arrayEnemigos.splice(i,1);
        }
    }

    arrayObstacle.forEach((el)=> {
        noTraspasar(el)
    });
}

function capturarX(){
    let leftValor = window.getComputedStyle(jugador.nodo).getPropertyValue('left');
    
    let x = parseInt(leftValor);
    console.log(x);
    return x;
}
function capturarY(){
    let topValor = window.getComputedStyle(jugador.nodo).getPropertyValue('top');
    
    let y = parseInt(topValor);
    console.log(y);
    return y;
}

function moverArriba(){
    const h2 = document.querySelector('#talk-pj');
    h2.innerText = "w";
    jugador.nodo.style.top = jugador.y - 10 + "px";
    jugador.cambiarAngulo((pi/2));
}
function moverAbajo(){
    const h2 = document.querySelector('#talk-pj');
    h2.innerText = "s";
    jugador.nodo.style.top = jugador.y + 10 + "px";
    jugador.cambiarAngulo((3*pi/2));

}
function moverDerecha(){
    const h2 = document.querySelector('#talk-pj');
    h2.innerText = "d";
    jugador.nodo.style.left = jugador.x + 10 + "px";
    jugador.cambiarAngulo(0);
}
function moverIzquierda(){
    const h2 = document.querySelector('#talk-pj');
    h2.innerText = "a";
    jugador.nodo.style.left = jugador.x - 10 + "px";
    jugador.cambiarAngulo(pi);
}

/* -------------------------------------------------------------------------- */
/*                                 COLISIONES                                 */
/* -------------------------------------------------------------------------- */

function noAvanzarArriba(y){
    if (y<=140){
        return false;
    }
    return true;
}
function noAvanzarAbajo(y){
    if (y>=380){
        return false;
    }
    return true;
}
function noAvanzarIzquierda(x){
    if (x<=5){
        return false;
    }
    return true;
}
function noAvanzarDerecha(x){
    if (x>=1170){
        return false;
    }
    return true;
}

// JUGADOR TOCANDO UN OBJETO
function estaDentro(o){
    return (jugador.x < o.x+o.ancho  && jugador.x+jugador.ancho > o.x
    && jugador.y < o.y+o.alto && jugador.y+jugador.alto > o.y);
}

// CHOQUE DE OBJETOS
function choqueObjtos(ob1, ob2){
    return (ob1.x < ob2.x + ob2.ancho  && ob1.x + ob1.ancho > ob2.x
        && ob1.y < ob2.y + ob2.alto && ob1.y + ob1.alto > ob2.y);
}

// SE ESCAPO DEL ENTORNO
function escapoEntorno(obj){
    return (obj.x < 0 || obj.x>1000 || obj.y < 0 || obj.y>600);
}


function noTraspasar(o){
    if (estaDentro(o)) {
        const h2 = document.querySelector('#talk-pj');
        h2.innerText = "choque";
        
        if (jugador.x  > o.x && jugador.angulo == pi) {
            moverDerecha();
        }
        if (jugador.x < o.x && jugador.angulo == 0) {
            moverIzquierda();
        }
        if (jugador.y < o.y && jugador.angulo == (3*pi/2)) {
            moverArriba();
        }
        if (jugador.y > o.y && jugador.angulo == (pi/2)) {
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
        let enemigo = new Enemy(i, Math.round(getRandomArbitrary(300, 1170)), Math.round(getRandomArbitrary(140, 370)), 70, 80, 10);
        arrayEnemigos.push(enemigo);
    }
}
function dibujarEnemigos(){
    for (const enemigo of arrayEnemigos) {
        console.log(enemigo);
        enemigo.dibujar();
        enemigo.actualizarPosicion();
    }
}

function cargarObstaculos(){
    for(let i=0; i<3; i++){
        const obstaculo = new Obstaculo(i, Math.round(getRandomArbitrary(400, 1170)), Math.round(getRandomArbitrary(140, 400)), 250, 100);
        arrayObstacle.push(obstaculo);
    }
}
function dibujarObstaculos(){
    for(const obstaculo of arrayObstacle){
        console.log(obstaculo);
        obstaculo.dibujar();
        obstaculo.actualizarPosicion();
        for(const otroObst of arrayObstacle){
            if(obstaculo.id != otroObst.id){
                let toca = true;
                while(toca){
                    if(choqueObjtos(obstaculo, otroObst)){
                        console.log("se tocan");
                        obstaculo.cambiarPosicion();
                        obstaculo.actualizarPosicion();
                    }else{
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
/* JUGADOR */
const pi = Math.PI;
let cantDisparos = 0;

const jugador = new Player(40, 260 , 70, 80, 10);
const juego = document.querySelector('#juego');

/* PROYECTIL */

const arrayDisparos = [];


/* ENEMIGOS */

const arrayEnemigos = [];

cargarEnemigos();
dibujarEnemigos();


/* OBSTACULOS */

const arrayObstacle = [];

cargarObstaculos();
dibujarObstaculos();

/* event listener */
console.log(jugador);
document.addEventListener("keydown", movimiento);

