import './App.css';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, Paper, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { mockAuth } from './data/mockAuth';
import { createReportService } from './services/reportService';
import type { AuthContext } from './types/auth';
import type { UsageReport } from './types/report';

type AppProps = { auth?: AuthContext };

/** Fecha en formato ISO usando el calendario local, sin desfase por zona horaria. */
const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const startOfMonth = () => {
  const today = new Date();
  return toIsoDate(new Date(today.getFullYear(), today.getMonth(), 1));
};

const endOfMonth = () => {
  const today = new Date();
  return toIsoDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
};

const App = ({ auth }: AppProps) => {
  const isStandalone = auth === undefined;
  const currentAuth = auth ?? mockAuth;
  const reportService = useMemo(() => createReportService(currentAuth.token), [currentAuth.token]);

  const [from, setFrom] = useState(startOfMonth);
  const [to, setTo] = useState(endOfMonth);
  const [report, setReport] = useState<UsageReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    if (to < from) {
      setError('La fecha final no puede ser anterior a la inicial.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setReport(await reportService.getUsageReport(from, to));
    } catch {
      setError('No fue posible obtener el reporte. Verifica que los servicios estén disponibles.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial con el mes en curso; después se consulta con el botón.
  useEffect(() => {
    void loadReport();
  }, []);

  return (
    <Paper data-auth-mode={isStandalone ? 'standalone' : 'shell'} sx={{ p: 3 }}>
      <Typography variant="body2" color="text.secondary">
        Sesión activa: {currentAuth.user.name} ({currentAuth.user.email})
      </Typography>

      <Stack direction="row" spacing={2} sx={{ my: 3, alignItems: 'center' }}>
        <TextField
          label="Desde"
          type="date"
          size="small"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Hasta"
          type="date"
          size="small"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button variant="contained" onClick={loadReport} disabled={loading}>Consultar</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label="Cargando reporte" />
        </Box>
      )}

      {report && !loading && (
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" gutterBottom>Reservas por cancha</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cancha</TableCell>
                    <TableCell>Deporte</TableCell>
                    <TableCell align="right">Reservas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.reservationsByCourt.map((court) => (
                    <TableRow key={court.courtId} hover>
                      <TableCell>{court.courtName}</TableCell>
                      <TableCell>{court.sportName}</TableCell>
                      <TableCell align="right">{court.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>Reservas por deporte</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Deporte</TableCell>
                    <TableCell align="right">Reservas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.reservationsBySport.map((sport) => (
                    <TableRow key={sport.sportName} hover>
                      <TableCell>{sport.sportName}</TableCell>
                      <TableCell align="right">{sport.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>Ocupación por cancha</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cancha</TableCell>
                    <TableCell align="right">Horas reservadas</TableCell>
                    <TableCell align="right">Horas disponibles</TableCell>
                    <TableCell align="right">Ocupación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.occupancyByCourt.map((court) => (
                    <TableRow key={court.courtId} hover>
                      <TableCell>{court.courtName}</TableCell>
                      <TableCell align="right">{court.reservedHours}</TableCell>
                      <TableCell align="right">{court.availableHours}</TableCell>
                      <TableCell align="right">{court.percentage} %</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>Cancelaciones y demanda</Typography>
            <Typography>Cancelaciones en el período: <strong>{report.cancellations}</strong></Typography>
            <Typography>
              Mayor demanda: <strong>{report.highestDemand.map((court) => court.courtName).join(', ') || '—'}</strong>
            </Typography>
            <Typography>
              Menor demanda: <strong>{report.lowestDemand.map((court) => court.courtName).join(', ') || '—'}</strong>
            </Typography>
          </Box>
        </Stack>
      )}
    </Paper>
  );
};

export default App;
