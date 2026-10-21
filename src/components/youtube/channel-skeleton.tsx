import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** The channel page's shape while YouTube's numbers load. */
export function ChannelSkeleton() {
  return (
    <div role="status" className="grid grid-cols-1 gap-6">
      <span className="sr-only">Loading channel…</span>

      <div className="flex items-center gap-4 sm:gap-5">
        <Skeleton className="size-14 shrink-0 rounded-full sm:size-20" />
        <div className="grid flex-1 gap-2.5">
          <Skeleton className="h-7 w-full max-w-56" />
          <Skeleton className="h-4 w-full max-w-72" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {[0, 1, 2].map((index) => (
          <Card key={index} className="gap-0 p-4 sm:p-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-8 w-28" />
            <Skeleton className="mt-3 h-3 w-32" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-75 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-40" />
          </CardHeader>
          <CardContent className="grid gap-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="aspect-video w-20 shrink-0" />
                <div className="grid flex-1 gap-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
