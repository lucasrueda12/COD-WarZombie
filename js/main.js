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
    constructor(){
        this.x = x;
        this.y = y;
        this.ancho = 10;
        this.alto = 10;
        this.angulo = 0;
        this.etiqueta= '<img src="src/img/bala.png" alt="bala">';
    }
    dibujar(){
        let cajaObst = document.createElement("article");
        cajaObst.setAttribute("id", `auto${this.id}`);
        cajaObst.classList.add("auto");
        cajaObst.innerHTML = this.etiqueta;

        juego.appendChild(cajaObst);
    }

    eliminar(){
        let bala = document.querySelector('#bala');
        bala.remove();
    }

    desplazar(){
        this.x += this.speed * Math.cos(this.angulo);
		this.y += this.speed * Math.sin(this.angulo);
    }

    nacerEnX(x){
        this.x = x;
    }

    nacerEnY(y){
        this.y = y;
    }

    darAngulo(angulo){
        this.angulo = angulo;
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

const jugador = new Player(40, 260 , 70, 80, 10);
const juego = document.querySelector('#juego');

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

