
document.addEventListener("keydown", movimiento);
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

    //colision entorno
    noAvanzar(x, y);
}
//capturar (x,y)
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

/* movimientos */
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
// no avanzar

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


const arrayObstacle = [];

for(let i=0; i<3; i++){
    arrayObstacle.push('<article id="auto' + i + '"><img src="src/img/auto.png" alt="auto"></article>')
}

for(let i=0; i<arrayObstacle.length ; i++){
    document.write(arrayObstacle[i]);
}

for(let i=0; i<arrayObstacle.length ; i++){
    const obstaculo = document.getElementById(('auto' + i));
    let topValor = window.getComputedStyle(obstaculo).getPropertyValue('top');
    let y = parseInt(topValor);
    obstaculo.style.top = y + getRandomArbitrary(140, 380) + 'px';
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}