import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreatePatchForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [patchName, setPatchName] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patchName.trim() || !scheduledTime.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/patchjobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patchName: patchName.trim(),
          scheduledTime: scheduledTime.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to create patch');

      toast({
        title: "Success",
        description: "Patch created successfully",
      });
      setPatchName("");
      setScheduledTime("");
      onSuccess?.();
    } catch (error) {
      console.error('Error creating patch:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create patch",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Wrench className="h-5 w-5 text-secondary" />
          </div>
          <CardTitle className="text-xl">Create Patch</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Patch Name"
            value={patchName}
            onChange={(e) => setPatchName(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Scheduled Time"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !patchName.trim() || !scheduledTime.trim()} className="w-full">
            {loading ? "Creating..." : "Schedule Patch"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePatchForm;
