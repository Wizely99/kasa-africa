"use client"

import { useState } from "react"
import { CalendarCheck, FileText, Stethoscope, Heart, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for patient dashboard
const mockHealthTips = [
  {
    id: "1",
    title: "5 Ways to Boost Your Immune System",
    excerpt: "Simple daily habits that can strengthen your body's natural defenses...",
    category: "Wellness",
    readTime: "3 min read",
    image: "/placeholder.svg?height=200&width=300&text=Immune+System",
  },
  {
    id: "2",
    title: "Understanding Blood Pressure Readings",
    excerpt: "Learn what your blood pressure numbers mean and when to be concerned...",
    category: "Heart Health",
    readTime: "5 min read",
    image: "/placeholder.svg?height=200&width=300&text=Blood+Pressure",
  },
  {
    id: "3",
    title: "Mental Health: Managing Daily Stress",
    excerpt: "Effective techniques to reduce stress and improve mental wellbeing...",
    category: "Mental Health",
    readTime: "4 min read",
    image: "/placeholder.svg?height=200&width=300&text=Mental+Health",
  },
]

const mockEvents = [
  {
    id: "1",
    title: "Free Health Screening Camp",
    date: "2025-01-20",
    time: "9:00 AM - 4:00 PM",
    location: "Community Center, Main Street",
    description: "Comprehensive health checkup including blood pressure, diabetes screening, and BMI assessment.",
    category: "Health Screening",
    isRegistered: false,
  },
  {
    id: "2",
    title: "Nutrition Workshop: Healthy Eating Habits",
    date: "2025-01-25",
    time: "2:00 PM - 4:00 PM",
    location: "Hospital Conference Room A",
    description: "Learn about balanced nutrition and meal planning from our certified nutritionist.",
    category: "Education",
    isRegistered: true,
  },
  {
    id: "3",
    title: "Yoga for Seniors",
    date: "2025-01-30",
    time: "10:00 AM - 11:00 AM",
    location: "Hospital Wellness Center",
    description: "Gentle yoga session designed specifically for senior citizens.",
    category: "Fitness",
    isRegistered: false,
  },
]

const mockBlogPosts = [
  {
    id: "1",
    title: "The Future of Telemedicine: What Patients Need to Know",
    excerpt: "Exploring how virtual healthcare is transforming patient care and accessibility...",
    author: "Dr. Sarah Johnson",
    publishDate: "2025-01-10",
    readTime: "6 min read",
    tags: ["Telemedicine", "Technology", "Healthcare"],
    image: "/placeholder.svg?height=200&width=300&text=Telemedicine",
  },
  {
    id: "2",
    title: "Preventive Care: Your First Line of Defense",
    excerpt: "Why regular checkups and preventive measures are crucial for long-term health...",
    author: "Dr. Michael Chen",
    publishDate: "2025-01-08",
    readTime: "4 min read",
    tags: ["Prevention", "Health", "Wellness"],
    image: "/placeholder.svg?height=200&width=300&text=Preventive+Care",
  },
  {
    id: "3",
    title: "Managing Chronic Conditions: A Patient's Guide",
    excerpt: "Practical tips for living well with chronic health conditions...",
    author: "Dr. Emily Rodriguez",
    publishDate: "2025-01-05",
    readTime: "8 min read",
    tags: ["Chronic Care", "Patient Care", "Management"],
    image: "/placeholder.svg?height=200&width=300&text=Chronic+Care",
  },
]

export default function PatientDashboard() {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>(["2"])

  const handleEventRegistration = (eventId: string) => {
    setRegisteredEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
        <p className="text-muted-foreground">Here's your health overview and latest updates.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Dr. Emily Carter</div>
            <p className="text-xs text-muted-foreground">Tomorrow at 2:30 PM</p>
            <Button size="sm" className="mt-2 w-full" asChild>
              <Link href="/patient/appointments">View Details</Link>
            </Button>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">3 Active</div>
            <p className="text-xs text-muted-foreground">2 need refills soon</p>
            <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent" asChild>
              <Link href="/patient/prescriptions">View All</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">85/100</div>
            <p className="text-xs text-muted-foreground">Good overall health</p>
            <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent">
              View Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button size="sm" className="w-full" asChild>
                <Link href="/patient/book-appointment">Book Appointment</Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href="/patient/pharmacy">Order Medicine</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="health-tips" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health-tips">Health Tips</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="blog-posts">Blog Posts</TabsTrigger>
        </TabsList>

        {/* Health Tips Tab */}
        <TabsContent value="health-tips" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Health Tips</h2>
            <Button variant="outline" asChild>
              <Link href="/patient/health-tips">View All Tips</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockHealthTips.map((tip) => (
              <Card key={tip.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img src={tip.image || "/placeholder.svg"} alt={tip.title} className="object-cover w-full h-full" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{tip.category}</Badge>
                    <span className="text-xs text-muted-foreground">{tip.readTime}</span>
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                  <CardDescription>{tip.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Read More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Button variant="outline" asChild>
              <Link href="/patient/events">View All Events</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button
                      variant={registeredEvents.includes(event.id) ? "default" : "outline-solid"}
                      onClick={() => handleEventRegistration(event.id)}
                    >
                      {registeredEvents.includes(event.id) ? "Registered" : "Register"}
                    </Button>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Blog Posts Tab */}
        <TabsContent value="blog-posts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Blog Posts</h2>
            <Button variant="outline" asChild>
              <Link href="/patient/blog">View All Posts</Link>
            </Button>
          </div>
          <div className="space-y-6">
            {mockBlogPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="shrink-0">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-muted-foreground">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>By {post.author}</span>
                          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <Button variant="ghost" className="text-primary">
                          Read More
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
