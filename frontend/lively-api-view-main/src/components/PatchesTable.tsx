import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Patch {
  id: number;
  patchName: string;
  scheduledTime: string;
  appliedTime?: string;
  status: string;
}

const PatchesTable = () => {
  const [patches, setPatches] = useState<Patch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatches = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/patchjobs');
      if (!response.ok) throw new Error('Failed to fetch patches');
      const data = await response.json();
      setPatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patches:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch patches",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatches();
    const interval = setInterval(fetchPatches, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Patch Job Scheduling</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading patches...</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patch Name</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Applied Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No patches found
                    </TableCell>
                  </TableRow>
                ) : (
                  patches.map((patch) => (
                    <TableRow key={patch.id}>
                      <TableCell>{patch.id}</TableCell>
                      <TableCell>{patch.patchName}</TableCell>
                      <TableCell>{new Date(patch.scheduledTime).toLocaleString()}</TableCell>
                      <TableCell>{patch.appliedTime ? new Date(patch.appliedTime).toLocaleString() : "-"}</TableCell>
                      <TableCell>{patch.status}</TableCell>
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

export default PatchesTable;
