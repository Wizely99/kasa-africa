"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Bell, CheckCircle, Clock, X } from "lucide-react"
import type { OCRNotification } from "../types/medical-record"
import { getOCRNotificationsAction, markNotificationAsReadAction } from "../actions/medical-record-actions"

interface OCRNotificationsProps {
  patientId: string
}

export function OCRNotifications({ patientId }: OCRNotificationsProps) {
  const [notifications, setNotifications] = useState<OCRNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [patientId])

  const loadNotifications = async () => {
    try {
      const result = await getOCRNotificationsAction(patientId)
      if (result.success) {
        setNotifications(result.data)
      }
    } catch (error) {
      toast.error("Failed to load notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const result = await markNotificationAsReadAction(notificationId)
      if (result.success) {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif)),
        )
      }
    } catch (error) {
      toast.error("Failed to mark notification as read")
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            OCR Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            OCR Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No OCR notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.isRead ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {notification.status === "COMPLETED" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-medium text-sm">{notification.recordTitle}</span>
                        {!notification.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    {!notification.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="ml-2">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
