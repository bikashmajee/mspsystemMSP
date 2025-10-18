import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Ticket {
  id: number;
  description: string;
  assignedEmployeeEmail: string;
  severity: number;
  createdTime: string;
  updatedTime: string;
  completed: boolean;
  escalated: boolean;
}

const TicketsTable = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tickets');
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const data = await response.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tickets",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEscalate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${id}/escalate`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to escalate');
      toast({ title: "Success", description: "Ticket escalated" });
      fetchTickets();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to escalate" });
    }
  };

  const handleComplete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${id}/complete`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to complete');
      toast({ title: "Success", description: "Ticket completed" });
      fetchTickets();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to complete" });
    }
  };

  return (
    <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Ticket Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading tickets...</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Escalated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.description}</TableCell>
                      <TableCell>{ticket.assignedEmployeeEmail}</TableCell>
                      <TableCell>{new Date(ticket.createdTime).toLocaleString()}</TableCell>
                      <TableCell>{ticket.completed ? "Yes" : "No"}</TableCell>
                      <TableCell>{ticket.escalated ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!ticket.escalated && (
                            <Button size="sm" variant="outline" onClick={() => handleEscalate(ticket.id)}>
                              Escalate Now
                            </Button>
                          )}
                          {!ticket.completed && (
                            <Button size="sm" onClick={() => handleComplete(ticket.id)}>
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketsTable;
