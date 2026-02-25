import { Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface ServiceListProps {
  services: string[];
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-sm text-text-secondary">No services listed yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wrench className="h-5 w-5 text-accent-light" />
        <h3 className="font-semibold text-text-primary">Services</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge key={service} variant="info">{service}</Badge>
        ))}
      </div>
    </Card>
  );
}
