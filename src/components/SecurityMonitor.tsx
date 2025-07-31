import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ErrorHandler } from '@/utils/errorHandling';
import { AlertTriangle, Shield, Activity, Eye } from 'lucide-react';

interface SecurityEvent {
  timestamp: string;
  event: string;
  severity: 'low' | 'medium' | 'high';
  details: any;
}

export const SecurityMonitor: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    // Load security events from localStorage
    const loadEvents = () => {
      try {
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        setEvents(logs.slice(-20)); // Show last 20 events
        
        // Filter recent high-severity events (last 24 hours)
        const dayAgo = new Date();
        dayAgo.setHours(dayAgo.getHours() - 24);
        
        const recent = logs.filter((event: SecurityEvent) => 
          event.severity === 'high' && new Date(event.timestamp) > dayAgo
        );
        setRecentAlerts(recent);
      } catch (error) {
        // Silently fail if localStorage is not available
      }
    };

    loadEvents();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      case 'low': return <Activity className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {recentAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {recentAlerts.length} high-severity security event(s) detected in the last 24 hours.
            Please review your security logs.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Security Events</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {events.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center space-x-2">
                {getSeverityIcon(event.severity)}
                <span className="text-sm">{event.event}</span>
                <Badge variant={getSeverityColor(event.severity)}>
                  {event.severity}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};