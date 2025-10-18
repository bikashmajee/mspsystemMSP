import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

interface MetricData {
  timestamp: string;
  tickets: number;
  patches: number;
  alerts: number;
}

const SystemMetricsChart = () => {
  const [data, setData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from all three endpoints
        const [ticketsRes, patchesRes, alertsRes] = await Promise.all([
          fetch('http://localhost:8080/api/tickets'),
          fetch('http://localhost:8080/api/patchjobs'),
          fetch('http://localhost:8080/api/alerts')
        ]);

        const tickets = await ticketsRes.json();
        const patches = await patchesRes.json();
        const alerts = await alertsRes.json();

        // Transform data for chart
        const chartData: MetricData[] = [];
        const maxLength = Math.max(
          Array.isArray(tickets) ? tickets.length : 0,
          Array.isArray(patches) ? patches.length : 0,
          Array.isArray(alerts) ? alerts.length : 0
        );

        for (let i = 0; i < Math.min(maxLength, 10); i++) {
          chartData.push({
            timestamp: new Date(Date.now() - (maxLength - i) * 3600000).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            tickets: Array.isArray(tickets) && tickets[i] ? Number(tickets[i]?.count || tickets[i]?.value || i + 1) : i + 1,
            patches: Array.isArray(patches) && patches[i] ? Number(patches[i]?.count || patches[i]?.value || i + 2) : i + 2,
            alerts: Array.isArray(alerts) && alerts[i] ? Number(alerts[i]?.count || alerts[i]?.value || i + 3) : i + 3,
          });
        }

        setData(chartData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">System Metrics Overview</CardTitle>
            <CardDescription>Real-time monitoring of tickets, patches, and alerts</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading metrics...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="ticketGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="patchGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--alert))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--alert))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tickets" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary-glow))' }}
                name="Tickets"
              />
              <Line 
                type="monotone" 
                dataKey="patches" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--secondary-glow))' }}
                name="Patches"
              />
              <Line 
                type="monotone" 
                dataKey="alerts" 
                stroke="hsl(var(--alert))" 
                strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--alert))', r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--alert-glow))' }}
                name="Alerts"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemMetricsChart;
