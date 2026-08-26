/** Reservas contabilizadas para una cancha. */
export type CourtReservations = {
  courtId: number;
  courtName: string;
  sportName: string;
  total: number;
};

/** Reservas contabilizadas para un deporte. */
export type SportReservations = {
  sportName: string;
  total: number;
};

/** Ocupación de una cancha: horas reservadas sobre horas disponibles. */
export type CourtOccupancy = {
  courtId: number;
  courtName: string;
  reservedHours: number;
  availableHours: number;
  percentage: number;
};

/** Indicadores de uso devueltos por el microservicio de reportes. */
export type UsageReport = {
  from: string;
  to: string;
  reservationsByCourt: CourtReservations[];
  reservationsBySport: SportReservations[];
  occupancyByCourt: CourtOccupancy[];
  cancellations: number;
  highestDemand: CourtReservations[];
  lowestDemand: CourtReservations[];
};
