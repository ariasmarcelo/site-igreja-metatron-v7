/**
 * Logger controlado por variáveis de ambiente.
 *
 * Em produção: logs de debug/info/warn ficam desligados por padrão.
 * Para ativar: defina VITE_DEBUG_LOGS=true em .env.local ou .env
 *
 * Uso:
 *   import { logger } from '@/lib/logger';
 *   logger.debug('mensagem', dados);
 *   logger.error('erro crítico');  // sempre exibido
 */

export const DEBUG_ENABLED = import.meta.env.VITE_DEBUG_LOGS === 'true';

const noop = () => {};

export const logger = {
  /** Logs de debug — apenas quando VITE_DEBUG_LOGS=true */
  debug: DEBUG_ENABLED ? (...args: unknown[]) => console.log('[DEBUG]', ...args) : noop,

  /** Logs informativos — apenas quando VITE_DEBUG_LOGS=true */
  log: DEBUG_ENABLED ? (...args: unknown[]) => console.log(...args) : noop,

  /** Logs informativos — apenas quando VITE_DEBUG_LOGS=true */
  info: DEBUG_ENABLED ? (...args: unknown[]) => console.info(...args) : noop,

  /** Avisos — apenas quando VITE_DEBUG_LOGS=true */
  warn: DEBUG_ENABLED ? (...args: unknown[]) => console.warn(...args) : noop,

  /** Erros críticos — sempre exibidos */
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};
