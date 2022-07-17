
/* document.addEventListener("keydown", movimiento);
const player = document.getElementById('player');


function movimiento(event) {
    let x= capturarX();
    let y = capturarY();

    if(event.key == 'w' && noAvanzarArriba(y)){
        moverArriba(y);
    }
    if(event.key == 's' && noAvanzarAbajo(y)){
        moverAbajo(y);
    }
    if(event.key == 'a' && noAvanzarIzquierda(x)){
        moverIzquierda(x);
    }
    if(event.key == 'd' && noAvanzarDerecha(x)){
        moverDerecha(x);
    }
}

function capturarX(){
    let leftValor = window.getComputedStyle(player).getPropertyValue('left');
    
    let x = parseInt(leftValor);
    console.log(x);
    return x;
}
function capturarY(){
    let topValor = window.getComputedStyle(player).getPropertyValue('top');
    
    let y = parseInt(topValor);
    console.log(y);
    return y;
}

function moverArriba(y){
    player.style.top = y - 10 + "px";
}
function moverAbajo(y){
    player.style.top = y + 10 + "px";
}
function moverDerecha(x){
    player.style.left = x + 10 + "px";
}
function moverIzquierda(x){
    player.style.left = x - 10 + "px";
}

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
} */


const arrayObstacle = [];

for(let i=0; i<3; i++){
    arrayObstacle.push('<article id="auto' + i + '"><img src="src/img/auto.png" alt="auto"></article>')
}

for(let i=0; i<arrayObstacle.length ; i++){
    document.write(arrayObstacle[i]);
}

for(let i=0; i<arrayObstacle.length ; i++){
    const obstaculo = document.getElementById(('auto' + i));
    obstaculo.style.top = getRandomArbitrary(140, 380) + 'px';
    obstaculo.style.left = getRandomArbitrary(400, 1000) + 'px';

}


// generar valores randoms
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


/* -------------------------------------------------------------------------- */
/*                                   OBJETOS                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   JUGADOR                                  */
/* -------------------------------------------------------------------------- */

class Player{
    constructor(x, y, ancho, alto, speed){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.angulo = 0;
        this.speed = speed;
        this.jugador = this.obtenerID();
    }

    getX(){ return this.x; }
    getY(){ return this.y; }
    getAncho(){ return this.ancho; }
    getAlto(){ return this.alto; }

    obtenerID(){
        return document.getElementById('player');
    }

    escucharTeclado(){
        document.addEventListener("keydown", this.movimiento);
    }

    movimiento(event) {
    this.capturarX;
    this.capturarY;
    let a = this.AvanzarArriba();

    if(event.key == 'w' && a){
        this.moverArriba();
    }
    if(event.key == 's' && this.AvanzarAbajo()){
        this.moverAbajo();
    }
    if(event.key == 'a' && this.AvanzarIzquierda()){
        this.moverIzquierda();
    }
    if(event.key == 'd' && this.AvanzarDerecha()){
        this.moverDerecha();
    }
}

    capturarX(){
        let leftValor = window.getComputedStyle(this.jugador).getPropertyValue('left');
        
        this.x = parseInt(leftValor);
        console.log(x);
    }

    capturarY(){
        let topValor = window.getComputedStyle(this.jugador).getPropertyValue('top');        
        this.y = parseInt(topValor);
        console.log(y);
    }

    /* movimientos */
    moverArriba(){
        this.jugador.style.top = this.y - 10 + "px";
    }

    moverAbajo(){
        this.jugador.style.top = this.y + 10 + "px";
    }

    moverDerecha(){
        this.jugador.style.left = this.x + 10 + "px";
    }

    moverIzquierda(){
        this.jugador.style.left = this.x - 10 + "px";
    }
    // no avanzar


    AvanzarArriba(){
        if (this.y<=140){
            return false;
        }
        return true;
    }

    AvanzarAbajo(){
        if (this.y>=380){
            return false;
        }
        return true;
    }

    AvanzarIzquierda(){
        if (this.x<=5){
            return false;
        }
        return true;
    }

    AvanzarDerecha(){
        if (this.x>=1170){
            return false;
        }
        return true;
    }
}

const jugador = new Player(40, 260, 70, 40, 10);
document.addEventListener("keydown", jugador.movimiento);




/* -------------------------------------------------------------------------- */
/*                                 OBSTACULOS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   ENEMIGO                                  */
/* -------------------------------------------------------------------------- */
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
        return document.getElementById(('enemy'+this.id));
    }

    actualizarPosicion(){
        const enemigo = this.obtenerID();
        enemigo.style.top = this.y + 'px';
        enemigo.style.left = this.x + 'px';
    }

    getX(){ return this.x; }
    getY(){ return this.y; }
    getAncho(){ return this.ancho; }
    getAlto(){ return this.alto; }

    moverse() {
		this.x += this.speed * Math.cos(this.angulo);
		this.y += this.speed * Math.sin(this.angulo);
	}

    getAnguloEntrePuntos(playerX, playerY){
        this.angulo = Math.atan2(this.y-playerY, this.x-playerX);
    }

    noAvanzarEnemyEntorno(){
        if (this.x < 5) {
			this.x += this.speed;
		}

		if (this.x > 1170) {
			this.x -= this.speed;
		}
		if (this.y < 140) {
			this.y += this.speed;
		}
		if (this.y > 370) {
			this.y -= this.speed;
		}
    }

    estaDentro(e){
        return ((this.x > e.getX() - this.ancho)  && (this.x < e.getX() + e.getWidth() / 2 + this.ancho)
        && (this.y  > e.getY() - e.getWidth() / 2 - this.alto) && (this.y < e.getY() + e.getHeight() / 2 + this.alto));
    }
    noTraspasar(e){
        if (this.estaDentro(e)) {
            if (this.x > e.getX() - this.ancho) {
                this.x += this.speed;
            }
            if (this.x < e.getX() + e.getAncho()) {
                this.x -= this.speed;
            }
            if (this.y > e.getY() - this.alto) {
                this.y += this.speed;
            }
            if (this.y < e.getY() + e.getAlto()) {
                this.y -= this.speed;
            }
        }else{
            getAnguloEntrePuntos(e.getX(), e.getY());
        }
    }
}

const arrayEnemigos = [];

for(let i=0; i<3; i++){
    let rx = getRandomArbitrary(50, 1170);
    let ry = getRandomArbitrary(140, 370);
    let enemigo = new Enemy(i, rx, ry, 117, 183, 10);
    arrayEnemigos.push(enemigo);
}

for (const enemigo of arrayEnemigos) {
    console.log(enemigo);
    enemigo.dibujar();
    enemigo.actualizarPosicion();
}


