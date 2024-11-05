const gameContainer = document.getElementById('game-container');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

let gameOver = false;
let timerStarted = false;
let countdownTime = 10; // 10 segundos para el temporizador
let allowTextDisplay = false; // Para controlar la aparición de texto en los globos

function endGame() {
    gameOver = true;
    gameOverScreen.classList.remove('hidden');
}

// Generar un color aleatorio
function generarColorAleatorio() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Función para crear un objeto (bomba o globo)
function crearObjeto() {
    if (gameOver) return;

    // Elegir si es una bomba o un globo
    const tipo = Math.random() < 0.5 ? 'bomba' : 'globo';
    const objeto = document.createElement('div');
    objeto.classList.add(tipo);

    // Asignar un color aleatorio
    const colorAleatorio = generarColorAleatorio();
    objeto.style.backgroundColor = colorAleatorio;

    // Posición aleatoria horizontal
    const posX = Math.floor(Math.random() * (window.innerWidth - 70));
    objeto.style.left = `${posX}px`;
    objeto.style.top = `-90px`; // Fuera de la pantalla

    // Si es un globo y el tiempo ha pasado, asignar texto
    if (tipo === 'globo') {
        if (allowTextDisplay) {
            const textos = ['taller', 'more tall', 'more taller'];
            const textoAleatorio = textos[Math.floor(Math.random() * textos.length)];
            objeto.textContent = textoAleatorio; // Agregar el texto al globo
            objeto.style.color = '#fff'; // Color del texto
            objeto.style.fontSize = '16px'; // Tamaño del texto
            objeto.style.display = 'flex';
            objeto.style.justifyContent = 'center';
            objeto.style.alignItems = 'center';
            objeto.style.height = '90px'; // Asegurarse de que el texto esté centrado
        }
    }

    // Añadir el objeto al contenedor
    gameContainer.appendChild(objeto);

    // Velocidad de caída
    let velocidadCaida = Math.random() * 2 + 2; // Entre 2 y 4

    // Animación de caída
    const intervaloCaida = setInterval(() => {
        if (gameOver) {
            clearInterval(intervaloCaida);
            return;
        }

        let objetoPosY = parseInt(objeto.style.top);
        if (objetoPosY < window.innerHeight - 90) {
            objeto.style.top = `${objetoPosY + velocidadCaida}px`;
        } else {
            clearInterval(intervaloCaida);
            gameContainer.removeChild(objeto);

            // Si un globo toca el fondo y no tiene texto, el jugador pierde
            if (tipo === 'globo' && !allowTextDisplay) {
                endGame();
            }
        }
    }, 20);

    // Eventos al hacer clic en los objetos
    objeto.addEventListener('click', () => {
        clearInterval(intervaloCaida);
        gameContainer.removeChild(objeto);

        if (tipo === 'bomba') {
            endGame();  // Si es una bomba, el jugador pierde
        } else if (allowTextDisplay) {
            // Comprobar si el texto es incorrecto
            if (objeto.textContent !== 'taller') {
                endGame(); // Si el texto no es la respuesta correcta, el jugador pierde
            } else {
                // Si es correcto, mostrar el modal
                const endModal = new bootstrap.Modal(document.getElementById('endModal'));
                endModal.show();
            }
        }
    });
}

// Generar objetos (globos y bombas) cada cierto tiempo
setInterval(crearObjeto, 1000);

// Reiniciar el juego
restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameOver = false;
    allowTextDisplay = false; // Reiniciar estado de texto
});

function iniciarTemporizador() {
    if (timerStarted) return; // Evita múltiples temporizadores activos
    timerStarted = true;

    const timerInterval = setInterval(() => {
        if (countdownTime <= 0 || gameOver) {
            clearInterval(timerInterval);
            allowTextDisplay = true; // Permitir que el texto aparezca después de 10 segundos
            return;
        }
        countdownTime--;
    }, 1000);
}


// Llamar a la función de temporizador al inicio del juego
iniciarTemporizador();
// Función para eliminar todos los globos y bombas
function limpiarObjetos() {
    const objetos = document.querySelectorAll('.bomba, .globo');
    objetos.forEach(objeto => objeto.remove());
}

// Modificar el evento de reinicio
restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameOver = false;
    allowTextDisplay = false; // Reiniciar estado de texto
    countdownTime = 10; // Reiniciar temporizador si es necesario
    limpiarObjetos(); // Llama a la función para limpiar los objetos
});
restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameOver = false;
    allowTextDisplay = false; // Reiniciar el estado de texto
    countdownTime = 10; // Reiniciar el temporizador
    timerStarted = false; // Permitir que el temporizador se vuelva a iniciar
    limpiarObjetos(); // Llama a la función para limpiar los objetos

    iniciarTemporizador(); // Reiniciar el temporizador al comienzo de la nueva partida
});

