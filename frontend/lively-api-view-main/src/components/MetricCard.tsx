import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'alert';
}

const MetricCard = ({ title, value, icon: Icon, trend, className, variant = 'primary' }: MetricCardProps) => {
  const variantStyles = {
    primary: 'from-primary/10 to-primary/5 border-primary/20',
    secondary: 'from-secondary/10 to-secondary/5 border-secondary/20',
    alert: 'from-alert/10 to-alert/5 border-alert/20',
  };

  const iconStyles = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    alert: 'text-alert bg-alert/10',
  };

  const trendStyles = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    alert: 'text-alert',
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300",
      "bg-gradient-to-br",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 text-sm font-medium", trendStyles[variant])}>
                <span>{trend > 0 ? '↑' : '↓'}</span>
                <span>{Math.abs(trend)}%</span>
                <span className="text-xs text-muted-foreground ml-1">vs last hour</span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            iconStyles[variant]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
