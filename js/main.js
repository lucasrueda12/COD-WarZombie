let nombre = prompt("Ingresa tu nombre");
let apellido = prompt("Ingresa tu apellido");
let añoDeNacimiento = prompt("Ingresa tu año de nacimiento");
let añoActual = 2022;

const edadActual = (añoActual, añoDeNacimiento) => añoActual - añoDeNacimiento;
let edad = edadActual(añoActual, añoDeNacimiento);

function permisoParaJugar(){
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

        console.log("Tu edad fue un numero impar " + impar() + " veces");

    }
}

function impar(){
    let contadorNumImpar = 0;
    
    for(let i=0 ; i <= edad ; i++){
        if(i%2 != 0){
            contadorNumImpar++;
        }
    }
    return contadorNumImpar;
}

startGame(nombre, apellido);