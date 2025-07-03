// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDLbaB7F9sFUVOhVEPLSAvmYAVdsDButC4",
    authDomain: "prueba-firebase-2025-06.firebaseapp.com",
    projectId: "prueba-firebase-2025-06",
    storageBucket: "prueba-firebase-2025-06.appspot.com",
    messagingSenderId: "932300742282",
    appId: "1:932300742282:web:5f5a4f255a2860562d5773",
    measurementId: "G-C1DNRFRT2C"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Función para registrar usuario con validaciones
function registrarUsuario() {
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value;
    const pass2 = document.getElementById("regPass2").value;

    if (!email || !pass || !pass2) {
        alert("Por favor completá todos los campos.");
        return;
    }

    if (!email.includes("@")) {
        alert("El correo no parece válido.");
        return;
    }

    if (pass !== pass2) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    if (pass.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, pass)
        .then(userCredential => {
            const user = userCredential.user;
            alert("Registro exitoso. Se envió un correo de verificación.");
            return user.sendEmailVerification();
        })
        .catch(error => {
            alert("Error en registro: " + error.message);
        });
}

// Función para iniciar sesión
function iniciarSesion() {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;

    if (!email || !pass) {
        alert("Completá los campos de login.");
        return;
    }

    auth.signInWithEmailAndPassword(email, pass)
        .then(userCredential => {
            const user = userCredential.user;
            if (user.emailVerified) {
                alert("Inicio de sesión exitoso");
                mostrarUsuario(user);
            } else {
                alert("Debes verificar tu correo antes de iniciar sesión.");
                auth.signOut(); // lo deslogueamos por seguridad
            }
        })
        .catch(error => {
            alert("Error en login: " + error.message);
        });
}

// Función para cerrar sesión
function cerrarSesion() {
    auth.signOut()
        .then(() => {
            alert("Sesión cerrada");
            mostrarUsuario(null);
        })
        .catch(error => {
            alert("Error al cerrar sesión: " + error.message);
        });
}

// Mostrar info del usuario en pantalla
function mostrarUsuario(user) {
    const seccionLogout = document.getElementById("logout");
    const usuarioActivo = document.getElementById("usuarioActivo");

    if (user) {
        document.getElementById("registro").style.display = "none";
        document.getElementById("login").style.display = "none";
        seccionLogout.style.display = "block";
        usuarioActivo.innerText = `Estás logueado como: ${user.email}`;
    } else {
        document.getElementById("registro").style.display = "block";
        document.getElementById("login").style.display = "block";
        seccionLogout.style.display = "none";
        usuarioActivo.innerText = "";
    }
}

// Detectar si el usuario ya está logueado
auth.onAuthStateChanged(user => {
    if (user) {
        if (user.emailVerified) {
            mostrarUsuario(user);
        } else {
            alert("Por favor verifica tu email antes de continuar.");
            auth.signOut(); // Cierra sesión automáticamente si no está verificado
            mostrarUsuario(null);
        }
    } else {
        mostrarUsuario(null);
    }
});


function recuperarContrasena() {
    const email = document.getElementById("emailRecuperar").value.trim();

    if (!email) {
        alert("Por favor ingresá tu email.");
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("Email de recuperación enviado. Revisa tu bandeja de entrada.");
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
}
