import "./App.css";
import React, { useState } from "react";

// Importar imágenes de los roles
import hombreLoboImg from "./assets/hombre_lobo.png";
import aldeanoImg from "./assets/aldeano.png";
import videnteImg from "./assets/vidente.png";
import cazadorImg from "./assets/cazador.png";
import brujaImg from "./assets/bruja.png";
import niñaImg from "./assets/niña.png";
import cupidoImg from "./assets/cupido.png";

const FASES = {
  NOCHE: "Noche",
  HOMBRES_LOBO: "Hombres Lobo",
  VIDENTE: "Vidente",
  BRUJA: "Bruja",
  DIA: "Día",
  VOTACION: "Votación",
};

const MENSAJES_FASE = {
  [FASES.NOCHE]: "Los jugadores cierran los ojos.",
  [FASES.HOMBRES_LOBO]: "Los Hombres Lobo abren los ojos y eligen una víctima.",
  [FASES.VIDENTE]: "La Vidente abre los ojos y elige a un jugador para ver su rol.",
  [FASES.BRUJA]: "La Bruja abre los ojos y decide si usa sus pociones.",
  [FASES.DIA]: "Todos despiertan y el narrador anuncia si alguien murió.",
  [FASES.VOTACION]: "Los jugadores discuten y votan a un posible Hombre Lobo.",
};

function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [numJugadores, setNumJugadores] = useState("");
  const [jugadores, setJugadores] = useState([]);
  const [jugadorActual, setJugadorActual] = useState(0);
  const [mostrarRol, setMostrarRol] = useState(false);
  const [rolesAsignados, setRolesAsignados] = useState([]);
  const [faseJuego, setFaseJuego] = useState(FASES.NOCHE);
  const [mensajeFase, setMensajeFase] = useState(MENSAJES_FASE[FASES.NOCHE]);
  const [jugadoresEliminados, setJugadoresEliminados] = useState([]);
  const [enamorados, setEnamorados] = useState([]);

  const iniciarAsignacion = () => {
    const jugadoresNum = parseInt(numJugadores);
    if (isNaN(jugadoresNum) || jugadoresNum < 5 || jugadoresNum > 20) {
      alert("Ingresa un número válido de jugadores (entre 5 y 20).");
      return;
    }

    const nombresIniciales = Array(jugadoresNum).fill("").map((_, i) => `Jugador ${i + 1}`);
    setJugadores(nombresIniciales);

    let numLobos = Math.min(4, Math.floor(jugadoresNum / 6) + 1);
    let roles = Array(numLobos).fill("Hombre Lobo").concat(["Vidente"]);

    if (jugadoresNum >= 6) roles.push("Cazador");
    if (jugadoresNum >= 7) roles.push("Bruja", "Cupido");
    if (jugadoresNum >= 10) roles.push("Niña");

    while (roles.length < jugadoresNum) roles.push("Aldeano");

    roles = roles.sort(() => Math.random() - 0.5);
    setRolesAsignados(roles);
    setJugadorActual(0);
    setPantalla("asignarIndividual");
  };

  const asignarSiguienteRol = () => {
    if (jugadorActual < jugadores.length - 1) {
      setJugadorActual(jugadorActual + 1);
      setMostrarRol(false);
    } else {
      setPantalla("juego");
    }
  };

  const actualizarNombreJugador = (index, nuevoNombre) => {
    const nuevosJugadores = [...jugadores];
    nuevosJugadores[index] = nuevoNombre;
    setJugadores(nuevosJugadores);
  };

  const avanzarFase = () => {
    const fases = Object.values(FASES);
    const siguienteFase = fases[(fases.indexOf(faseJuego) + 1) % fases.length];
    setFaseJuego(siguienteFase);
    setMensajeFase(MENSAJES_FASE[siguienteFase]);
  };

  const eliminarJugador = (index) => {
    if (!jugadoresEliminados.includes(index)) {
      const nuevosEliminados = [...jugadoresEliminados, index];
      if (enamorados.includes(index)) {
        const otroEnamorado = enamorados.find((i) => i !== index);
        if (otroEnamorado !== undefined) {
          nuevosEliminados.push(otroEnamorado);
        }
      }
      setJugadoresEliminados(nuevosEliminados);
    }
  };

  const revivirJugador = (index) => {
    setJugadoresEliminados(jugadoresEliminados.filter((i) => i !== index));
  };

  const seleccionarEnamorados = (index1, index2) => {
    setEnamorados([index1, index2]);
  };

  // imagenes de los roles
  const imagenesRoles = {
    "Hombre Lobo": hombreLoboImg,
    "Aldeano": aldeanoImg,
    "Vidente": videnteImg,
    "Cazador": cazadorImg,
    "Bruja": brujaImg,
    "Niña": niñaImg,
    "Cupido": cupidoImg
  };
  
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="container">
      {pantalla === "inicio" && (
        <>
          <h1>Hombres Lobo de Castronegro</h1>
          <button onClick={() => setPantalla("asignarRoles")}>Empezar Partida</button>
          <button onClick={() => setPantalla("verRol")}>Ya Tengo Rol</button>
        </>
      )}

      {pantalla === "asignarRoles" && (
        <>
          <h2>Asignar Roles</h2>
          <p>Ingresa el número de jugadores:</p>
          <input
            type="number"
            value={numJugadores}
            onChange={(e) => setNumJugadores(e.target.value)}
          />
          <button onClick={iniciarAsignacion}>Continuar</button>
          <button onClick={() => setPantalla("inicio")}>Volver</button>
        </>
      )}

      {pantalla === "asignarIndividual" && !mostrarRol && (
        <>
          <h2>Asignar Rol</h2>
          <p>{jugadores[jugadorActual]}, ingresa tu nombre:</p>
          <input
            type="text"
            value={jugadores[jugadorActual]}
            onChange={(e) => actualizarNombreJugador(jugadorActual, e.target.value)}
          />
          <button onClick={() => setMostrarRol(true)}>Ver mi Rol</button>
        </>
      )}

      {pantalla === "asignarIndividual" && mostrarRol && (
        <>
          <h2>{jugadores[jugadorActual]}, este es tu rol:</h2>
          <h3>{rolesAsignados[jugadorActual]}</h3>
          <p>Memoriza tu rol y pasa el dispositivo al siguiente jugador.</p>
          <button onClick={asignarSiguienteRol}>
            {jugadorActual < jugadores.length - 1 ? "Siguiente Jugador" : "Comenzar Partida"}
          </button>
        </>
      )}

      {pantalla === "juego" && (
        <>
          <h2>Fase Actual: {faseJuego}</h2>
          <p>{mensajeFase}</p>
          <h3>Lista de Jugadores</h3>
          <ul>
            {jugadores.map((nombre, index) => (
              <li key={index} style={{ textDecoration: jugadoresEliminados.includes(index) ? "line-through" : "none" }}>
                {nombre} - {rolesAsignados[index]} {enamorados.includes(index) ? "💖" : ""}
                {!jugadoresEliminados.includes(index) ? (
                  <button onClick={() => eliminarJugador(index)}>Eliminar</button>
                ) : (
                  <button onClick={() => revivirJugador(index)}>Revivir</button>
                )}
              </li>
            ))}
          </ul>

          {rolesAsignados.includes("Cupido") && enamorados.length === 0 && (
            <>
              <h3>Seleccionar Enamorados</h3>
              <select id="enamorado1">
                {jugadores.map((nombre, index) => (
                  <option key={index} value={index}>{nombre}</option>
                ))}
              </select>
              <select id="enamorado2">
                {jugadores.map((nombre, index) => (
                  <option key={index} value={index}>{nombre}</option>
                ))}
              </select>
              <button onClick={() => {
                const index1 = parseInt(document.getElementById("enamorado1").value);
                const index2 = parseInt(document.getElementById("enamorado2").value);
                if (index1 !== index2) {
                  seleccionarEnamorados(index1, index2);
                } else {
                  alert("Los enamorados no pueden ser la misma persona.");
                }
              }}>
                Confirmar Enamorados
              </button>
            </>
          )}
          {enamorados.length === 2 && (
            <>
              <h3>💖 Enamorados: {jugadores[enamorados[0]]} ❤️ {jugadores[enamorados[1]]}</h3>
              <button onClick={() => setEnamorados([])}>Modificar Enamorados</button>
            </>
          )}

          <button onClick={avanzarFase}>Siguiente Fase</button>
          <button onClick={() => setPantalla("inicio")}>Volver al Inicio</button>
        </>
      )}

      {pantalla === "verRol" && (
        <>
          <h2>Selecciona tu Rol</h2>
          <select onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Selecciona tu carta</option>
            {Object.keys(imagenesRoles).map((rol) => (
              <option key={rol} value={rol}>{rol}</option>
            ))}
          </select>

          {/* Mostrar la imagen del rol seleccionado */}
          {selectedRole && (
            <>
              <h3>Tu Carta:</h3>
              <img 
                src={imagenesRoles[selectedRole]} 
                alt={selectedRole} 
                className="role-image"
              />
              <button className="btn-volver" onClick={() => setPantalla("inicio")}>Volver</button>
            </>
          )}
        </>
      )}

      {pantalla === "finPartida" && (
        <>
          <h2>¡Partida Finalizada!</h2>
          <button onClick={() => setPantalla("inicio")}>Reiniciar Partida</button>
        </>
      )}
    </div>
  );
}

export default App;
