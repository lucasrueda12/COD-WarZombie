/* -------------------------------------------------------------------------- */
/*                                   CLASES                                   */
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
    }

    dibujar(){
        let nuevoEnemigo = document.createElement("article");
        nuevoEnemigo.setAttribute("id", `enemy${this.id}`);
        nuevoEnemigo.classList.add(this.claseEnemy);
        nuevoEnemigo.innerHTML = this.etiqueta;

        juego.appendChild(nuevoEnemigo);
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
}

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
        tiro.desplazar();
        tiro.actualizarPosicion();
        if(escapoEntorno(tiro)){
            tiro.eliminar();
            tiro.vivo = false;
        }
    });

    for(let i=0;i<arrayDisparos.length; i++){
        if(arrayDisparos[i].vivo == false){
            arrayDisparos.splice(i,1);
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

function estaDentro(o){
    return (jugador.x < o.x+o.ancho  && jugador.x+jugador.ancho > o.x
    && jugador.y < o.y+o.alto && jugador.y+jugador.alto > o.y);
}

function choqueObjtos(ob1, ob2){
    return (ob1.x < ob2.x+ob2.ancho  && ob1.x+ob1.ancho > ob2.x
        && ob1.y < ob2.y+ob2.alto && ob1.y+ob1.alto > ob2.y);
}
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

for(let i=0; i<3; i++){
    let rx = Math.round(getRandomArbitrary(50, 1170));
    let ry = Math.round(getRandomArbitrary(140, 370));
    let enemigo = new Enemy(i, rx, ry, 117, 183, 10);
    arrayEnemigos.push(enemigo);
}

for (const enemigo of arrayEnemigos) {
    console.log(enemigo);
    enemigo.dibujar();
    enemigo.actualizarPosicion();
}

/* OBSTACULOS */

const arrayObstacle = [];

for(let i=0; i<3; i++){
    const obstaculo = new Obstaculo(i, Math.round(getRandomArbitrary(400, 1000)), Math.round(getRandomArbitrary(140, 380)), 250, 100);
    arrayObstacle.push(obstaculo);
}

for(const obstaculo of arrayObstacle){
    console.log(obstaculo);
    obstaculo.dibujar();
    obstaculo.actualizarPosicion();
}

/* event listener */
console.log(jugador);
document.addEventListener("keydown", movimiento);

