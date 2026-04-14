import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface Turno {
  id: number;
  cliente: string;
  servicio: string;
  atendido: boolean;
}

const turnos: Turno[] = [];
let siguienteId = 1;

export const generarTurno = (cliente: string, servicio: string): Turno => {
  const nuevoTurno: Turno = {
    id: siguienteId++,
    cliente,
    servicio,
    atendido: false,
  };

  turnos.push(nuevoTurno);
  return nuevoTurno;
};

export const llamarSiguienteTurno = (): Turno | null => {
  const turnoPendiente = turnos.find((turno) => !turno.atendido);

  if (!turnoPendiente) {
    return null;
  }

  turnoPendiente.atendido = true;
  return turnoPendiente;
};

export const mostrarTurnosPendientes = (): Turno[] =>
  turnos.filter((turno) => !turno.atendido);

const prompt = readline.createInterface({ input, output });

export const menuDigiturno = async (): Promise<void> => {
  let opcion = "";

  while (opcion !== "4") {
    console.log("\n=== Sistema de Turnos ===");
    console.log("1. Generar turno");
    console.log("2. Llamar siguiente turno");
    console.log("3. Mostrar turnos pendientes");
    console.log("4. Salir");

    opcion = await prompt.question("Seleccione una opción: ");

    switch (opcion) {
      case "1": {
        const cliente = await prompt.question("Nombre del cliente: ");
        const servicio = await prompt.question("Servicio solicitado: ");
        const turno = generarTurno(cliente.trim(), servicio.trim());
        console.log(`Turno generado: ${turno.id}`);
        break;
      }
      case "2": {
        const turno = llamarSiguienteTurno();
        if (turno) {
          console.log(`Llamando turno ${turno.id}: ${turno.cliente}`);
        } else {
          console.log("No hay turnos pendientes.");
        }
        break;
      }
      case "3":
        console.table(mostrarTurnosPendientes());
        break;
      case "4":
        console.log("Cerrando sistema de turnos.");
        break;
      default:
        console.log("Opción inválida. Intente nuevamente.");
    }
  }

  await prompt.close();
};
