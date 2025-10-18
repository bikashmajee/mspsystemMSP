import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreateAlertForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [alertType, setAlertType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertType.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          alertType: alertType.trim(),
          description: description.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to create alert');

      toast({
        title: "Success",
        description: "Alert created successfully",
      });
      setAlertType("");
      setDescription("");
      onSuccess?.();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create alert",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-alert/10">
            <AlertTriangle className="h-5 w-5 text-alert" />
          </div>
          <CardTitle className="text-xl">Create Alert</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Alert Type"
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !alertType.trim() || !description.trim()} className="w-full">
            {loading ? "Creating..." : "Create Alert"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAlertForm;
