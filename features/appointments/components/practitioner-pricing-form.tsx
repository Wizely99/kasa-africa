"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, DollarSign, Calendar, Building2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import type { PractitionerPricing, Expertise, CreatePricingRequest, UpdatePricingRequest } from "../types/pricing"
import { CURRENCY_OPTIONS } from "../types/pricing"
import {
  getExpertiseListAction,
  getPractitionerPricingAction,
  createPricingAction,
  updatePricingAction,
  deletePricingAction,
} from "../actions/pricing-actions"

export default function PractitionerPricingForm() {
  const [pricings, setPricings] = useState<PractitionerPricing[]>([])
  const [expertise, setExpertise] = useState<Expertise[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPricing, setCurrentPricing] = useState<PractitionerPricing | null>(null)

  const [formData, setFormData] = useState<CreatePricingRequest>({
    practitionerId: "current-doctor", // In real app, get from session
    expertiseId: "",
    consultationFee: 0,
    followUpFee: 0,
    emergencyFee: 0,
    isActive: true,
    currencyCode: "USD",
    effectiveFrom: new Date().toISOString().split("T")[0],
    effectiveTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [expertiseResult, pricingResult] = await Promise.all([
        getExpertiseListAction(),
        getPractitionerPricingAction("current-doctor"),
      ])

      if (expertiseResult.success) {
        setExpertise(expertiseResult.data)
      }

      if (pricingResult.success) {
        setPricings(pricingResult.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      practitionerId: "current-doctor",
      expertiseId: "",
      consultationFee: 0,
      followUpFee: 0,
      emergencyFee: 0,
      isActive: true,
      currencyCode: "USD",
      effectiveFrom: new Date().toISOString().split("T")[0],
      effectiveTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
    setCurrentPricing(null)
  }

  const handleCreate = async () => {
    try {
      const result = await createPricingAction(formData)
      if (result.success) {
        setPricings([...pricings, result.data])
        setIsCreateDialogOpen(false)
        resetForm()
        toast({
          title: "Success",
          description: result.message,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create pricing configuration.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!currentPricing) return

    try {
      const updateData: UpdatePricingRequest = {
        id: currentPricing.id,
        ...formData,
      }
      const result = await updatePricingAction(updateData)
      if (result.success) {
        setPricings(pricings.map((p) => (p.id === currentPricing.id ? result.data : p)))
        setIsEditDialogOpen(false)
        resetForm()
        toast({
          title: "Success",
          description: result.message,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pricing configuration.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (pricingId: string) => {
    try {
      const result = await deletePricingAction(pricingId)
      if (result.success) {
        setPricings(pricings.filter((p) => p.id !== pricingId))
        toast({
          title: "Success",
          description: result.message,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pricing configuration.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (pricing: PractitionerPricing) => {
    setCurrentPricing(pricing)
    setFormData({
      practitionerId: pricing.practitionerId,
      expertiseId: pricing.expertiseId,
      consultationFee: pricing.consultationFee,
      followUpFee: pricing.followUpFee,
      emergencyFee: pricing.emergencyFee,
      isActive: pricing.isActive,
      currencyCode: pricing.currencyCode,
      effectiveFrom: pricing.effectiveFrom,
      effectiveTo: pricing.effectiveTo,
    })
    setIsEditDialogOpen(true)
  }

  const getExpertiseName = (expertiseId: string) => {
    const exp = expertise.find((e) => e.id === expertiseId)
    return exp ? exp.name : "Unknown"
  }

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = CURRENCY_OPTIONS.find((c) => c.code === currencyCode)
    return currency ? currency.symbol : currencyCode
  }

  const getAvailableExpertise = () => {
    const usedExpertiseIds = pricings.map((p) => p.expertiseId)
    return expertise.filter((e) => !usedExpertiseIds.includes(e.id) || (currentPricing && e.id === currentPricing.expertiseId))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Service Pricing</h2>
          <p className="text-muted-foreground">Manage your consultation fees across different expertise areas</p>
        </div>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Add Service Pricing
              </DialogTitle>
              <DialogDescription>
                Set your consultation fees for a specific area of expertise
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Expertise Selection */}
              <div className="space-y-2">
                <Label htmlFor="expertise">Area of Expertise</Label>
                <Select
                  value={formData.expertiseId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, expertiseId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your expertise area" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableExpertise().map((exp) => (
                      <SelectItem key={exp.id} value={exp.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{exp.name}</span>
                          <span className="text-xs text-muted-foreground">{exp.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fee Structure */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currencyCode}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currencyCode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{currency.symbol}</span>
                            <span>{currency.name}</span>
                            <span className="text-muted-foreground">({currency.code})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Consultation Fee</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {getCurrencySymbol(formData.currencyCode)}
                    </span>
                    <Input
                      id="consultationFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.consultationFee}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, consultationFee: parseFloat(e.target.value) || 0 }))
                      }
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpFee">Follow-up Fee</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {getCurrencySymbol(formData.currencyCode)}
                    </span>
                    <Input
                      id="followUpFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.followUpFee}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, followUpFee: parseFloat(e.target.value) || 0 }))
                      }
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyFee">Emergency Fee</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {getCurrencySymbol(formData.currencyCode)}
                    </span>
                    <Input
                      id="emergencyFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.emergencyFee}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, emergencyFee: parseFloat(e.target.value) || 0 }))
                      }
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="effectiveFrom">Effective From</Label>
                  <Input
                    id="effectiveFrom"
                    type="date"
                    value={formData.effectiveFrom}
                    onChange={(e) => setFormData((prev) => ({ ...prev, effectiveFrom: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveTo">Effective To</Label>
                  <Input
                    id="effectiveTo"
                    type="date"
                    value={formData.effectiveTo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, effectiveTo: e.target.value }))}
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active pricing configuration</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.expertiseId || formData.consultationFee <= 0}
                className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Create Pricing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pricing Table */}
      {pricings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-green-50 p-3 mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No pricing configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Set up your consultation fees for different areas of expertise to start accepting bookings.
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Pricing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Current Pricing Configurations
            </CardTitle>
            <CardDescription>
              Manage your service fees across different expertise areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Consultation</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Emergency</TableHead>
                  <TableHead>Effective Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricings.map((pricing) => (
                  <TableRow key={pricing.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getExpertiseName(pricing.expertiseId)}</div>
                        <div className="text-sm text-muted-foreground">
                          {expertise.find((e) => e.id === pricing.expertiseId)?.category}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {getCurrencySymbol(pricing.currencyCode)}{pricing.consultationFee}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {getCurrencySymbol(pricing.currencyCode)}{pricing.followUpFee}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {getCurrencySymbol(pricing.currencyCode)}{pricing.emergencyFee}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {pricing.effectiveFrom} to {pricing.effectiveTo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pricing.isActive ? "default" : "secondary"}>
                        {pricing.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(pricing)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Pricing Configuration</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this pricing configuration for{" "}
                                <strong>{getExpertiseName(pricing.expertiseId)}</strong>? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(pricing.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Service Pricing
            </DialogTitle>
            <DialogDescription>
              Update your consultation fees for {currentPricing ? getExpertiseName(currentPricing.expertiseId) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Expertise Selection */}
            <div className="space-y-2">
              <Label htmlFor="editExpertise">Area of Expertise</Label>
              <Select
                value={formData.expertiseId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, expertiseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your expertise area" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableExpertise().map((exp) => (
                    <SelectItem key={exp.id} value={exp.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{exp.name}</span>
                        <span className="text-xs text-muted-foreground">{exp.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fee Structure */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="editCurrency">Currency</Label>
                <Select
                  value={formData.currencyCode}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, currencyCode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{currency.symbol}</span>
                          <span>{currency.name}</span>
                          <span className="text-muted-foreground">({currency.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editConsultationFee">Consultation Fee</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {getCurrencySymbol(formData.currencyCode)}
                  </span>
                  <Input
                    id="editConsultationFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.consultationFee}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, consultationFee: parseFloat(e.target.value) || 0 }))
                    }
                    className="pl-8"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editFollowUpFee">Follow-up Fee</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {getCurrencySymbol(formData.currencyCode)}
                  </span>
                  <Input
                    id="editFollowUpFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.followUpFee}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, followUpFee: parseFloat(e.target.value) || 0 }))
                    }
                    className="pl-8"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmergencyFee">Emergency Fee</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {getCurrencySymbol(formData.currencyCode)}
                  </span>
                  <Input
                    id="editEmergencyFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.emergencyFee}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, emergencyFee: parseFloat(e.target.value) || 0 }))
                    }
                    className="pl-8"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="editEffectiveFrom">Effective From</Label>
                <Input
                  id="editEffectiveFrom"
                  type="date"
                  value={formData.effectiveFrom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, effectiveFrom: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEffectiveTo">Effective To</Label>
                <Input
                  id="editEffectiveTo"
                  type="date"
                  value={formData.effectiveTo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, effectiveTo: e.target.value }))}
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="editIsActive">Active pricing configuration</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!formData.expertiseId || formData.consultationFee <= 0}
              className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Update Pricing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
