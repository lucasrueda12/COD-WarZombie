let nombre = prompt("Ingresa tu nombre");
let apellido = prompt("Ingresa tu apellido");
let añoDeNacimiento = prompt("Ingresa tu año de nacimiento");
let añoActual = 2022;

const edadActual = (añoActual, añoDeNacimiento) => añoActual - añoDeNacimiento;

function permisoParaJugar(){
    let edad = edadActual(añoActual, añoDeNacimiento);
    if ( edad > 16){
        console.log("Puede jugar este juego. Tienes " + edad );
        return true;
    }else{
        console.log("No cumple la edad necesaria para jugar");
        return false;
    }
}

function startGame(nombre, apellido){
    if(permisoParaJugar()){
        console.log("Bienvenido " + nombre + " " + apellido);
        let respuesta = prompt("Estas listo para la aventura?");
        if(respuesta == "si" || respuesta == "SI" || respuesta == "Si" || respuesta == "sI"){
            console.log("Esa es la actitud");
        }else{
            console.log("No te veo muy motivado");
        }


    }
}

startGame(nombre, apellido);