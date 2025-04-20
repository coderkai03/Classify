import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Handle, Position } from "@xyflow/react";

export function CustomNode({
  data,
  isConnectable,
}: {
  data: Course;
  isConnectable: boolean;
}) {
  return (
    <Card className="w-[250px] shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/20">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-primary !w-3 !h-3"
      />

      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {data.id}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{data.title}</p>
      </CardContent>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-primary !w-3 !h-3"
      />
    </Card>
  );
}
