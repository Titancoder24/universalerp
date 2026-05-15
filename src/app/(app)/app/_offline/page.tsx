import Link from 'next/link';
import { CloudOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function OfflinePage() {
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <Card className="max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <CloudOff className="size-8" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold">You're offline</h1>
          <p className="mt-2 text-muted-foreground">
            Some pages need a connection. Your recent data is still available in this tab.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Changes you make now will sync when you're back online.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild>
              <Link href="/app">
                <RefreshCw className="size-4" /> Try again
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
