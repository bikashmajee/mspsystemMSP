import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreateTicketForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [description, setDescription] = useState("");
  const [assignedEmployeeEmail, setAssignedEmployeeEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !assignedEmployeeEmail.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: description.trim(),
          assignedEmployeeEmail: assignedEmployeeEmail.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to create ticket');

      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
      setDescription("");
      setAssignedEmployeeEmail("");
      onSuccess?.();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create ticket",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Ticket className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">Create Ticket</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Assign to Employee Email"
            type="email"
            value={assignedEmployeeEmail}
            onChange={(e) => setAssignedEmployeeEmail(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !description.trim() || !assignedEmployeeEmail.trim()} className="w-full">
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTicketForm;
