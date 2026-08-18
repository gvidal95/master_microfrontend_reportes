import type { AuthContext } from '../types/auth';

export const mockAuth: AuthContext = {
  token: 'mock-jwt.reportes.local',
  user: { id: 'reportes-local-user', name: 'Administrador de prueba', email: 'admin@demo.com', role: 'administrador' },
};
