// Email monitoring and volume tracking system
export interface EmailMetrics {
  totalSent: number;
  totalFailed: number;
  successRate: number;
  dailyVolume: number;
  monthlyVolume: number;
  lastResetDate: string;
  errorsByType: Record<string, number>;
  emailsByType: Record<string, number>;
}

export interface EmailLogEntry {
  id: string;
  timestamp: string;
  type: string;
  recipient: string;
  subject: string;
  success: boolean;
  error?: string;
  errorType?: string;
  messageId?: string;
  attemptNumber: number;
}

export interface VolumeLimit {
  daily: number;
  monthly: number;
  current: {
    daily: number;
    monthly: number;
  };
}

export class EmailMonitor {
  private metrics: EmailMetrics;
  private logs: EmailLogEntry[] = [];
  private readonly RESEND_MONTHLY_LIMIT = 3000; // Free tier limit
  private readonly RESEND_DAILY_LIMIT = 100; // Conservative daily limit
  private readonly MAX_LOG_ENTRIES = 1000; // Keep last 1000 entries in memory

  constructor() {
    this.metrics = this.initializeMetrics();
    this.loadPersistedData();
  }

  private initializeMetrics(): EmailMetrics {
    return {
      totalSent: 0,
      totalFailed: 0,
      successRate: 0,
      dailyVolume: 0,
      monthlyVolume: 0,
      lastResetDate: new Date().toISOString().split("T")[0],
      errorsByType: {},
      emailsByType: {},
    };
  }

  private loadPersistedData(): void {
    try {
      // In a production environment, this would load from a database
      // For now, we'll use localStorage if available (browser) or file system (Node.js)
      if (typeof window !== "undefined" && window.localStorage) {
        const savedMetrics = localStorage.getItem("email_metrics");
        const savedLogs = localStorage.getItem("email_logs");

        if (savedMetrics) {
          this.metrics = { ...this.metrics, ...JSON.parse(savedMetrics) };
        }

        if (savedLogs) {
          this.logs = JSON.parse(savedLogs);
        }
      }
    } catch (error) {
      console.error("Failed to load persisted email monitoring data:", error);
    }
  }

  private persistData(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("email_metrics", JSON.stringify(this.metrics));
        localStorage.setItem(
          "email_logs",
          JSON.stringify(this.logs.slice(-this.MAX_LOG_ENTRIES))
        );
      }
    } catch (error) {
      console.error("Failed to persist email monitoring data:", error);
    }
  }

  private resetDailyCountersIfNeeded(): void {
    const today = new Date().toISOString().split("T")[0];
    const lastReset = this.metrics.lastResetDate;

    if (today !== lastReset) {
      this.metrics.dailyVolume = 0;
      this.metrics.lastResetDate = today;

      // Reset monthly counters if it's a new month
      const currentMonth = new Date().getMonth();
      const lastResetMonth = new Date(lastReset).getMonth();

      if (currentMonth !== lastResetMonth) {
        this.metrics.monthlyVolume = 0;
      }

      this.persistData();
    }
  }

  public logEmailAttempt(
    type: string,
    recipient: string,
    subject: string,
    success: boolean,
    error?: string,
    errorType?: string,
    messageId?: string,
    attemptNumber: number = 1
  ): void {
    this.resetDailyCountersIfNeeded();

    // Create log entry
    const logEntry: EmailLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      recipient,
      subject,
      success,
      error,
      errorType,
      messageId,
      attemptNumber,
    };

    // Add to logs (keep only recent entries)
    this.logs.push(logEntry);
    if (this.logs.length > this.MAX_LOG_ENTRIES) {
      this.logs = this.logs.slice(-this.MAX_LOG_ENTRIES);
    }

    // Update metrics
    if (success) {
      this.metrics.totalSent++;
      this.metrics.dailyVolume++;
      this.metrics.monthlyVolume++;
    } else {
      this.metrics.totalFailed++;

      // Track errors by type
      if (errorType) {
        this.metrics.errorsByType[errorType] =
          (this.metrics.errorsByType[errorType] || 0) + 1;
      }
    }

    // Track emails by type
    this.metrics.emailsByType[type] =
      (this.metrics.emailsByType[type] || 0) + 1;

    // Update success rate
    const totalAttempts = this.metrics.totalSent + this.metrics.totalFailed;
    this.metrics.successRate =
      totalAttempts > 0 ? (this.metrics.totalSent / totalAttempts) * 100 : 0;

    // Log to console with appropriate level
    const logData = {
      ...logEntry,
      metrics: {
        dailyVolume: this.metrics.dailyVolume,
        monthlyVolume: this.metrics.monthlyVolume,
        successRate: this.metrics.successRate.toFixed(2) + "%",
      },
    };

    if (success) {
      console.log("📧 Email sent successfully:", logData);
    } else {
      console.error("❌ Email sending failed:", logData);
    }

    // Check for volume warnings
    this.checkVolumeWarnings();

    // Persist updated data
    this.persistData();
  }

  private checkVolumeWarnings(): void {
    const dailyWarningThreshold = this.RESEND_DAILY_LIMIT * 0.8; // 80% of daily limit
    const monthlyWarningThreshold = this.RESEND_MONTHLY_LIMIT * 0.8; // 80% of monthly limit

    if (this.metrics.dailyVolume >= dailyWarningThreshold) {
      console.warn(
        `⚠️ Daily email volume warning: ${this.metrics.dailyVolume}/${this.RESEND_DAILY_LIMIT} emails sent today`
      );
    }

    if (this.metrics.monthlyVolume >= monthlyWarningThreshold) {
      console.warn(
        `⚠️ Monthly email volume warning: ${this.metrics.monthlyVolume}/${this.RESEND_MONTHLY_LIMIT} emails sent this month`
      );
    }

    if (this.metrics.dailyVolume >= this.RESEND_DAILY_LIMIT) {
      console.error(
        `🚫 Daily email limit reached: ${this.metrics.dailyVolume}/${this.RESEND_DAILY_LIMIT} emails`
      );
    }

    if (this.metrics.monthlyVolume >= this.RESEND_MONTHLY_LIMIT) {
      console.error(
        `🚫 Monthly email limit reached: ${this.metrics.monthlyVolume}/${this.RESEND_MONTHLY_LIMIT} emails`
      );
    }
  }

  public canSendEmail(): { allowed: boolean; reason?: string } {
    this.resetDailyCountersIfNeeded();

    if (this.metrics.dailyVolume >= this.RESEND_DAILY_LIMIT) {
      return {
        allowed: false,
        reason: `Daily email limit reached (${this.metrics.dailyVolume}/${this.RESEND_DAILY_LIMIT})`,
      };
    }

    if (this.metrics.monthlyVolume >= this.RESEND_MONTHLY_LIMIT) {
      return {
        allowed: false,
        reason: `Monthly email limit reached (${this.metrics.monthlyVolume}/${this.RESEND_MONTHLY_LIMIT})`,
      };
    }

    return { allowed: true };
  }

  public getMetrics(): EmailMetrics {
    this.resetDailyCountersIfNeeded();
    return { ...this.metrics };
  }

  public getRecentLogs(limit: number = 50): EmailLogEntry[] {
    return this.logs.slice(-limit).reverse(); // Most recent first
  }

  public getLogsByType(type: string, limit: number = 20): EmailLogEntry[] {
    return this.logs
      .filter((log) => log.type === type)
      .slice(-limit)
      .reverse();
  }

  public getFailedLogs(limit: number = 20): EmailLogEntry[] {
    return this.logs
      .filter((log) => !log.success)
      .slice(-limit)
      .reverse();
  }

  public getVolumeStatus(): VolumeLimit {
    this.resetDailyCountersIfNeeded();

    return {
      daily: this.RESEND_DAILY_LIMIT,
      monthly: this.RESEND_MONTHLY_LIMIT,
      current: {
        daily: this.metrics.dailyVolume,
        monthly: this.metrics.monthlyVolume,
      },
    };
  }

  public generateReport(): string {
    const metrics = this.getMetrics();
    const volumeStatus = this.getVolumeStatus();
    const recentFailures = this.getFailedLogs(5);

    return `
📊 Email Monitoring Report
Generated: ${new Date().toISOString()}

📈 Volume Statistics:
• Daily: ${volumeStatus.current.daily}/${volumeStatus.daily} (${(
      (volumeStatus.current.daily / volumeStatus.daily) *
      100
    ).toFixed(1)}%)
• Monthly: ${volumeStatus.current.monthly}/${volumeStatus.monthly} (${(
      (volumeStatus.current.monthly / volumeStatus.monthly) *
      100
    ).toFixed(1)}%)

✅ Success Metrics:
• Total Sent: ${metrics.totalSent}
• Total Failed: ${metrics.totalFailed}
• Success Rate: ${metrics.successRate.toFixed(2)}%

📧 Email Types:
${Object.entries(metrics.emailsByType)
  .map(([type, count]) => `• ${type}: ${count}`)
  .join("\n")}

❌ Error Types:
${Object.entries(metrics.errorsByType)
  .map(([type, count]) => `• ${type}: ${count}`)
  .join("\n")}

🔍 Recent Failures (Last 5):
${
  recentFailures.length > 0
    ? recentFailures
        .map(
          (log) =>
            `• ${log.timestamp}: ${log.type} to ${log.recipient} - ${log.error}`
        )
        .join("\n")
    : "• No recent failures"
}

⚠️ Warnings:
${
  volumeStatus.current.daily >= volumeStatus.daily * 0.8
    ? "• Daily volume approaching limit"
    : ""
}
${
  volumeStatus.current.monthly >= volumeStatus.monthly * 0.8
    ? "• Monthly volume approaching limit"
    : ""
}
${metrics.successRate < 95 ? "• Success rate below 95%" : ""}
    `.trim();
  }

  public clearLogs(): void {
    this.logs = [];
    this.persistData();
    console.log("📧 Email logs cleared");
  }

  public resetMetrics(): void {
    this.metrics = this.initializeMetrics();
    this.logs = [];
    this.persistData();
    console.log("📧 Email metrics and logs reset");
  }
}

// Export singleton instance
export const emailMonitor = new EmailMonitor();
