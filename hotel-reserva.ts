import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface Habitacion {
  id: number;
  tipo: string;
  precio: number;
  disponible: boolean;
}

export interface Reserva {
  habitacionId: number;
  cliente: string;
  fecha: string;
}

const habitaciones: Habitacion[] = [
  { id: 1, tipo: "Individual", precio: 50, disponible: true },
  { id: 2, tipo: "Doble", precio: 80, disponible: true },
  { id: 3, tipo: "Suite", precio: 120, disponible: true },
  { id: 4, tipo: "Doble", precio: 85, disponible: true },
];

const reservas: Reserva[] = [];

export const listarHabitaciones = (): Habitacion[] => [...habitaciones];

export const filtrarPorTipo = (tipo: string): Habitacion[] =>
  habitaciones.filter(
    (habitacion) => habitacion.tipo.toLowerCase() === tipo.toLowerCase()
  );

export const reservarHabitacion = (
  habitacionId: number,
  cliente: string,
  fecha: string
): boolean => {
  const habitacion = habitaciones.find((item) => item.id === habitacionId);

  if (!habitacion || !habitacion.disponible) {
    return false;
  }

  habitacion.disponible = false;
  reservas.push({ habitacionId, cliente, fecha });
  return true;
};

export const mostrarReservas = (): Reserva[] => [...reservas];

const prompt = readline.createInterface({ input, output });

export const menuHotelReserva = async (): Promise<void> => {
  let opcion = "";

  while (opcion !== "5") {
    console.log("\n=== Sistema de Reserva de Hotel ===");
    console.log("1. Listar habitaciones");
    console.log("2. Filtrar por tipo");
    console.log("3. Reservar habitación");
    console.log("4. Mostrar reservas");
    console.log("5. Salir");

    opcion = await prompt.question("Seleccione una opción: ");

    switch (opcion) {
      case "1":
        console.table(listarHabitaciones());
        break;
      case "2": {
        const tipo = await prompt.question("Ingrese el tipo de habitación: ");
        console.table(filtrarPorTipo(tipo));
        break;
      }
      case "3": {
        const id = Number(await prompt.question("ID de habitación: "));
        const cliente = await prompt.question("Nombre del cliente: ");
        const fecha = await prompt.question("Fecha de reserva (YYYY-MM-DD): ");

        const exito = reservarHabitacion(id, cliente.trim(), fecha.trim());
        console.log(
          exito
            ? "Reserva creada correctamente."
            : "No se pudo reservar la habitación."
        );
        break;
      }
      case "4":
        console.table(mostrarReservas());
        break;
      case "5":
        console.log("Saliendo del sistema de reservas.");
        break;
      default:
        console.log("Opción inválida. Intente de nuevo.");
    }
  }

  await prompt.close();
};
