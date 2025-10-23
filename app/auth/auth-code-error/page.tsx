import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive">Authentication Error</CardTitle>
          <CardDescription>
            There was an error signing you in. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            The authentication process encountered an error. This could be due to:
            <ul className="mt-2 text-left space-y-1">
              <li>• Network connectivity issues</li>
              <li>• Invalid or expired authentication code</li>
              <li>• Server configuration problems</li>
            </ul>
          </div>
          <Button asChild className="w-full">
            <Link href="/auth/login">
              Try Again
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
