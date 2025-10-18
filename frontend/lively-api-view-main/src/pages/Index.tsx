import { useEffect, useState } from "react";
import SystemMetricsChart from "@/components/SystemMetricsChart";
import MetricCard from "@/components/MetricCard";
import CreateTicketForm from "@/components/CreateTicketForm";
import CreatePatchForm from "@/components/CreatePatchForm";
import CreateAlertForm from "@/components/CreateAlertForm";
import TicketsTable from "@/components/TicketsTable";
import AlertsTable from "@/components/AlertsTable";
import PatchesTable from "@/components/PatchesTable";
import { Ticket, Wrench, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MetricData {
  tickets: number;
  patches: number;
  alerts: number;
}

const Index = () => {
  const [metrics, setMetrics] = useState<MetricData>({ tickets: 0, patches: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        const [ticketsRes, patchesRes, alertsRes] = await Promise.all([
          fetch('http://localhost:8080/api/tickets'),
          fetch('http://localhost:8080/api/patchjobs'),
          fetch('http://localhost:8080/api/alerts')
        ]);

        const tickets = await ticketsRes.json();
        const patches = await patchesRes.json();
        const alerts = await alertsRes.json();

        setMetrics({
          tickets: Array.isArray(tickets) ? tickets.length : (tickets?.total || 0),
          patches: Array.isArray(patches) ? patches.length : (patches?.total || 0),
          alerts: Array.isArray(alerts) ? alerts.length : (alerts?.total || 0),
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not connect to localhost:8080",
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-alert bg-clip-text text-transparent">
            MSP System Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time monitoring and analytics for your managed services
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Active Tickets"
            value={loading ? "..." : metrics.tickets}
            icon={Ticket}
            trend={12}
            variant="primary"
          />
          <MetricCard
            title="Patches Applied"
            value={loading ? "..." : metrics.patches}
            icon={Wrench}
            trend={8}
            variant="secondary"
          />
          <MetricCard
            title="Active Alerts"
            value={loading ? "..." : metrics.alerts}
            icon={AlertTriangle}
            trend={-5}
            variant="alert"
          />
        </div>

        {/* Create Forms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CreateTicketForm onSuccess={fetchMetrics} />
          <CreatePatchForm onSuccess={fetchMetrics} />
          <CreateAlertForm onSuccess={fetchMetrics} />
        </div>

        {/* Chart */}
        <SystemMetricsChart />

        {/* Tables */}
        <div className="space-y-6">
          <TicketsTable />
          <AlertsTable />
          <PatchesTable />
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Connected to backend at <code className="px-2 py-1 rounded bg-muted">localhost:8080</code></p>
          <p className="mt-1">Data refreshes every 30 seconds automatically</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
