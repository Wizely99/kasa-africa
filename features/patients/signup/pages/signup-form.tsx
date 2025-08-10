"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, User, Heart, Shield, Check, Plus, X, AlertTriangle } from 'lucide-react';

// Types
interface UserProfile {
  keycloakId: string;
  username: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  dateOfBirth?: string;
  gender?: string;
  profileImageUrl?: string;
  userType?: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientDto {
  id: number;
  userProfileId: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
  emergencyContact?: string;
  emergencyPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string[];
}

// Validation schemas
const personalInfoSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number').optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

const medicalInfoSchema = z.object({
  bloodType: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  medicalHistory: z.array(z.string()).default([]),
});

const insuranceInfoSchema = z.object({
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;
type MedicalInfo = z.infer<typeof medicalInfoSchema>;
type InsuranceInfo = z.infer<typeof insuranceInfoSchema>;

// Insurance providers list
const insuranceProviders = [
  'Blue Cross Blue Shield',
  'Aetna',
  'Anthem',
  'Cigna',
  'Humana',
  'Kaiser Permanente',
  'UnitedHealth',
  'Molina Healthcare',
  'Centene',
  'Independence Blue Cross',
  'Other'
];

// List Input Component
const ListInput = ({ 
  label, 
  placeholder, 
  items, 
  setItems, 
  emptyText 
}: { 
  label: string
  placeholder: string
  items: string[]
  setItems: (items: string[]) => void
  emptyText: string
}) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addItem}
          size="sm"
          className="px-3"
          disabled={!newItem.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 py-1 px-2"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">{emptyText}</p>
      )}
    </div>
  );
};

const steps = [
  { title: 'Personal Information', icon: User, description: 'Basic details about you' },
  { title: 'Medical Information', icon: Heart, description: 'Health and emergency contacts' },
  { title: 'Insurance Details', icon: Shield, description: 'Insurance information (optional)' },
];

const bloodTypes = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

export default function PatientSignupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<PersonalInfo & MedicalInfo & InsuranceInfo>>({});
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);

  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData,
  });

  const medicalForm = useForm<MedicalInfo>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: formData,
  });

  const insuranceForm = useForm<InsuranceInfo>({
    resolver: zodResolver(insuranceInfoSchema),
    defaultValues: formData,
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = async () => {
    let isValid = false;
    
    if (currentStep === 0) {
      isValid = await personalForm.trigger();
      if (isValid) {
        setFormData(prev => ({ ...prev, ...personalForm.getValues() }));
      }
    } else if (currentStep === 1) {
      isValid = await medicalForm.trigger();
      if (isValid) {
        const medicalData = {
          ...medicalForm.getValues(),
          allergies,
          medications,
          medicalHistory
        };
        setFormData(prev => ({ ...prev, ...medicalData }));
      }
    } else if (currentStep === 2) {
      isValid = await insuranceForm.trigger();
      if (isValid) {
        setFormData(prev => ({ ...prev, ...insuranceForm.getValues() }));
      }
    }

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // const handleSubmit = async () => {
  //   const isValid = await insuranceForm.trigger();
  //   if (isValid) {
  //     const finalData = { 
  //       ...formData, 
  //       ...insuranceForm.getValues(),
  //       allergies,
  //       medications,
  //       medicalHistory
  //     };
  //     console.log('Final form data:', finalData);
  //     // Handle form submission
  //   }
  // };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input 
            id="firstName" 
            placeholder="John"
            {...personalForm.register('firstName')}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {personalForm.formState.errors.firstName && (
            <p className="text-sm text-red-500">{personalForm.formState.errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input 
            id="lastName" 
            placeholder="Doe"
            {...personalForm.register('lastName')}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {personalForm.formState.errors.lastName && (
            <p className="text-sm text-red-500">{personalForm.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="middleName">Middle Name</Label>
        <Input 
          id="middleName" 
          placeholder="Optional"
          {...personalForm.register('middleName')}
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input 
          id="username" 
          placeholder="johndoe123"
          {...personalForm.register('username')}
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        {personalForm.formState.errors.username && (
          <p className="text-sm text-red-500">{personalForm.formState.errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input 
          id="email" 
          type="email"
          placeholder="john@example.com"
          {...personalForm.register('email')}
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        {personalForm.formState.errors.email && (
          <p className="text-sm text-red-500">{personalForm.formState.errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input 
            id="phoneNumber" 
            placeholder="+1 (555) 123-4567"
            {...personalForm.register('phoneNumber')}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input 
            id="dateOfBirth" 
            type="date"
            {...personalForm.register('dateOfBirth')}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {personalForm.formState.errors.dateOfBirth && (
            <p className="text-sm text-red-500">{personalForm.formState.errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <Select onValueChange={(value) => personalForm.setValue('gender', value as any)}>
          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Blood Type</Label>
          <Select onValueChange={(value) => medicalForm.setValue('bloodType', value as any)}>
            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-lg border-l-4 border-amber-400">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-800 mb-2">Emergency Contact Information</h4>
            <p className="text-sm text-amber-700 mb-4">
              While optional, having emergency contact information could be life-saving in critical situations. 
              We strongly recommend providing this information for your safety.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contact Name</Label>
                <Input 
                  id="emergencyContact" 
                  placeholder="Emergency contact name"
                  {...medicalForm.register('emergencyContact')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input 
                  id="emergencyPhone" 
                  placeholder="+1 (555) 987-6543"
                  {...medicalForm.register('emergencyPhone')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ListInput
        label="Allergies"
        placeholder="Enter an allergy (e.g., peanuts, shellfish, penicillin)"
        items={allergies}
        setItems={setAllergies}
        emptyText="No allergies added. Click the + button to add any known allergies."
      />

      <ListInput
        label="Current Medications"
        placeholder="Enter medication name and dosage"
        items={medications}
        setItems={setMedications}
        emptyText="No medications added. Add any current medications you're taking."
      />

      <ListInput
        label="Medical History"
        placeholder="Enter relevant medical condition or history"
        items={medicalHistory}
        setItems={setMedicalHistory}
        emptyText="No medical history added. Include conditions, surgeries, or relevant health information."
      />
    </div>
  );

  const renderInsuranceInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Insurance Information</h4>
        <p className="text-sm text-blue-600">This information is optional but helps us process your claims faster.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
        <Select onValueChange={(value) => insuranceForm.setValue('insuranceProvider', value)}>
          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Select your insurance provider" />
          </SelectTrigger>
          <SelectContent>
            {insuranceProviders.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="insuranceNumber">Insurance Policy Number</Label>
        <Input 
          id="insuranceNumber" 
          placeholder="Your policy or member ID number"
          {...insuranceForm.register('insuranceNumber')}
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2 mb-2">
          <Check className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-green-800">Almost Done!</h4>
        </div>
        <p className="text-sm text-green-700">
          Review your information and click "Create Account" to complete your registration.
        </p>
      </div>
    </div>
  );

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await insuranceForm.trigger();
    if (isValid) {
      const finalData = { 
        ...formData, 
        ...insuranceForm.getValues(),
        allergies,
        medications,
        medicalHistory
      };
      console.log('Final form data:', finalData);
      // Handle form submission
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Patient Account</h1>
          <p className="text-gray-600">Join our healthcare platform in just a few simple steps</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isCompleted ? 'bg-green-500 text-white' : 
                    isActive ? 'bg-blue-500 text-white' : 
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 hidden sm:block">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon className="w-5 h-5 text-blue-600" />;
              })()}
              <span>{steps[currentStep].title}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            {currentStep === 0 && renderPersonalInfo()}
            {currentStep === 1 && renderMedicalInfo()}
            {currentStep === 2 && renderInsuranceInfo()}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md relative z-10"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white shadow-md relative z-10"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Account</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
