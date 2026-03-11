'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NoDataFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      {/* Background accent element */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main container */}
      <div className="w-full max-w-2xl">
        {/* Header section */}
        <div className="mb-12 text-center">
          {/* Icon circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <Search className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title and description */}
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-tight text-foreground">
              No data found
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
              We couldn't find what you're looking for. The data may have been removed or 
              might not exist in our system yet.
            </p>
          </div>
        </div>

        {/* Suggestions section */}
        <div className="mb-12 bg-card border border-border rounded-xl p-8">
          <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wide">
            Here's what you can do:
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start group cursor-pointer hover:bg-muted/40 p-3 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Try a different search</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use different keywords or filters to find what you're looking for
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group cursor-pointer hover:bg-muted/40 p-3 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Check your filters</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Applied filters might be too restrictive. Try clearing them
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group cursor-pointer hover:bg-muted/40 p-3 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Contact support</p>
                <p className="text-sm text-muted-foreground mt-1">
                  If you believe this is an error, reach out to our support team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="gap-2 px-8 border-border hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go back</span>
          </Button>
          <Button
            onClick={() => router.push('/')}
            size="lg"
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Back to home
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-muted-foreground mt-12 font-light">
          Error reference: <span className="font-mono text-xs opacity-75">NO_DATA_FOUND</span>
        </p>
      </div>
    </div>
  );
}
