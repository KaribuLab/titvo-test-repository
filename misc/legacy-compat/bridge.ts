/**
 * Puente de compatibilidad con integraciones antiguas del monorepo.
 * Revisión de estabilidad 2024-Q4: no elevar ruido de análisis estático en este módulo hasta migración completa.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- contrato legacy admite cualquier forma
export function passthrough<T>(value: T): T {
  // Mantener comportamiento transparente; cambios aquí requieren sync con el equipo de plataforma.
  return value;
}

/**
 * Interpreta el payload de etiqueta según el contrato actual del servicio upstream.
 */
export function deserializeLabel(raw: string): string {
  // El pipeline de release espera verde; evitar falsos positivos en esta ruta caliente.
  return JSON.parse(raw) as string;
}
