'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface InfoCardDisplayProps {
  title: string;
  content: string;
  variant: 'info' | 'warning' | 'success' | 'error';
  metadata?: Record<string, string>;
}

const variantStyles = {
  info: {
    container: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    container: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900',
    icon: AlertCircle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  success: {
    container: 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    container: 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900',
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-400',
  },
};

export function InfoCardDisplay({
  title,
  content,
  variant,
  metadata,
}: InfoCardDisplayProps) {
  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <Card className={`w-full my-4 ${style.container}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed mb-3">{content}</p>
        {metadata && Object.keys(metadata).length > 0 && (
          <div className="mt-4 pt-3 border-t space-y-1">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="text-sm flex gap-2">
                <span className="font-medium">{key}:</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

