/**
 * Simple logger for testing
 */
export class SimpleLogger {
  static log(message: string): void {
    console.log(`[SIMPLE_LOG] ${message}`);
  }
}

export function testFunction(): string {
  return "test works";
}
