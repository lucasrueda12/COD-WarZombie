/* -------------------------------------------------------------------------- */
/*                                   CLASES                                   */
/* -------------------------------------------------------------------------- */

class Player{
    constructor(x, y, ancho, alto, speed){
        this.jugador = document.querySelector('#player');
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.angulo = 0;
        this.speed = speed;
    }
    
}

class Enemy{
    constructor(id, x, y, ancho, alto, speed){
        this.id = id;
        this.etiqueta = '<article id="enemy'+this.id+'"><img src="src/img/zombieIF.png" alt="enemigo"></article>';
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.speed = speed;
        this.angulo = 0;
    }

    dibujar(){
        document.write(this.etiqueta);
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
		this.x += this.speed * Math.cos(this.angulo);
		this.y += this.speed * Math.sin(this.angulo);
	}

    getAnguloEntrePuntos(playerX, playerY){
        this.angulo = Math.atan2(this.y-playerY, this.x-playerX);
    }
}

class Obstaculo{
    constructor(id, x, y, ancho, alto){
        this.id = '#auto' + id;
        this.etiqueta= '<article id="auto' + id + '"><img src="src/img/auto.png" alt="auto"></article>';
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
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
        noTraspasar(el)
    });

    if(event.key == 'w' && noAvanzarArriba(jugador.y)){
        moverArriba(jugador.jugador ,jugador.y);
    }
    if(event.key == 's' && noAvanzarAbajo(jugador.y)){
        moverAbajo(jugador.jugador ,jugador.y);
    }
    if(event.key == 'a' && noAvanzarIzquierda(jugador.x)){
        moverIzquierda(jugador.jugador ,jugador.x);
    }
    if(event.key == 'd' && noAvanzarDerecha(jugador.x)){
        moverDerecha(jugador.jugador ,jugador.x);
    }

    arrayObstacle.forEach((el)=> {
        noTraspasar(el)
    });
}

function capturarX(){
    let leftValor = window.getComputedStyle(jugador.jugador).getPropertyValue('left');
    
    let x = parseInt(leftValor);
    console.log(x);
    return x;
}
function capturarY(){
    let topValor = window.getComputedStyle(jugador.jugador).getPropertyValue('top');
    
    let y = parseInt(topValor);
    console.log(y);
    return y;
}

function moverArriba(player ,y){
    player.style.top = y - 10 + "px";
}
function moverAbajo(player, y){
    player.style.top = y + 10 + "px";
}
function moverDerecha(player, x){
    player.style.left = x + 10 + "px";
}
function moverIzquierda(player, x){
    player.style.left = x - 10 + "px";
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


function noTraspasar(e){
    if (estaDentro(e)) {
        console.log("toca");
        if (jugador.x > e.x ) {
            console.log("izq");
            moverDerecha(jugador.jugador ,jugador.x);
        }
        if (jugador.x < e.x) {
            console.log("der");
            moverIzquierda(jugador.jugador ,jugador.x);
        }
        if (jugador.y < e.y) {
            console.log("arriba");
            moverArriba(jugador.jugador ,jugador.y);
        }
        if (jugador.y > e.y) {
            console.log("abajo");

            moverAbajo(jugador.jugador ,jugador.y);
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

const jugador = new Player(40, 260 , 70, 80, 10);

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

const arrayObstacle = [];

for(let i=0; i<3; i++){
    const obstaculo = new Obstaculo(i, Math.round(getRandomArbitrary(400, 1000)), Math.round(getRandomArbitrary(140, 380)), 250, 100);
    arrayObstacle.push(obstaculo);
}

for(const obstaculo of arrayObstacle){
    document.write(obstaculo.etiqueta);

    const auto = document.querySelector(obstaculo.id);
    auto.style.top = obstaculo.y + 'px';
    auto.style.left = obstaculo.x + 'px';
}

arrayEnemigos.forEach((elem) => {console.log(elem.etiqueta)});

const iDES = arrayEnemigos.map((elem) => 'enemy'+ elem.id);
console.log(iDES.join(', '));

const resultado = arrayObstacle.some((el)=> el.x > jugador.x);
console.log("se fija si hay algun obstaculo delante del jugador");
console.log(resultado);

const nuevoArrayObstacle = arrayObstacle.filter((el)=> el.x < jugador.x);
console.log("devueve un nuevo array con los elementos que esten atras del jugador");
console.log(nuevoArrayObstacle);

const desorden = [20, 50 ,10, 4, 1, 8, 19];
console.log(desorden);
desorden.sort((a, b) => a - b);

console.log("ya no hay desorden");
console.log(desorden);

document.addEventListener("keydown", movimiento);