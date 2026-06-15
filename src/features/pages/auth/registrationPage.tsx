import{RegistrationForm} from '@/components/forms';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

import Link from 'next/link';

export const RegistrationPageView = () => {
    return (
        <Card className="auth-card w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create account</CardTitle>
          <CardDescription>Join Ascendra Workspaces</CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    )
}