/**
 * Logs messages
 */
export interface Logger
{
  // We pass functions, to avoid evaluation of arguments on pass to the logger service.
  // E.g. in production, we can choose to make sure logger.debug will not execute the method and thus not evaluate the argments.

  /**
   * Normal log. Priority 100
   *
   * @argument msg: A function that produces the message to log. */
  log(msg: () => any): void;

  /**
   * Debug log. Priority 50
   *
   * @argument msg: A function that produces the message to log. */
  debug(msg: () => any): void;

  /**
   * Warn log. Use to highlight for example failing gaurds. Priority 125.
   *
   * @argument msg: A function that produces the message to log. */
  warn(msg: () => any): void;

  /**
   * Error log. Use only in case of error. Priority 150
   * Preferably print meaningful information such as stack log etc.
   *
   * @argument msg: A function that produces the message to log. */
  error(msg: () => any): void;
}
