export class EmailLogger {
  static log(message: string): void {
    console.log(`[EMAIL_LOG] ${message}`);
  }

  static logValidation(email: string, result: boolean): void {
    console.log(`[EMAIL_VALIDATION] ${email}: ${result}`);
  }
}
