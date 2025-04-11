import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">User Name</CardTitle>
            <CardDescription>Administrator</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-500">Member since January 2023</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline">Edit Profile</Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>user@example.com</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p>San Francisco, CA</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Language</p>
                <p>English (US)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Time Zone</p>
                <p>Pacific Time (PT)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Notifications</p>
                <p>Enabled</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
