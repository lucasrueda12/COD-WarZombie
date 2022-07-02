/* Algoritmo para calcular el maximo de una lista de numeros */

console.log("Calcular el maximo de una lista");

/* Defino las variables */
console.log("");

let array = [1 , 2 , 83 , 4 , 95 , 60 , 7 , 48 , 19 , 10];
let aux = array[0];

/* muestro la lista */

console.log("Los elementos de la lista son: (" + array + ")");
console.log("");

/* funcion */

for (let i = 0; i < array.length; i++) {
    if (aux<array[i]){
        aux = array[i];
    }
}

/* muestro el valor mas grande de la lista */
console.log("El valor mas alto de la lista es: " + aux);