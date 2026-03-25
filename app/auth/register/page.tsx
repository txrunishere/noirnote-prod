import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  return (
    <div className="flex justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">NoirNote.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your account and start writing
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-xl">Register</CardTitle>
            <CardDescription className="text-center">
              Start your journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action="/auth/register" method="post" className="space-y-5">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
