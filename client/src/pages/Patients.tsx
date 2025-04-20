import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
  Search,
  BarChart,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Patient } from "@shared/schema";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch patients for the therapist
  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/therapists/1/patients'],
    staleTime: 60000 // 1 minute
  });
  
  // Fetch alerts
  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts'],
    staleTime: 30000 // 30 seconds
  });
  
  // Filter and search patients
  const filteredPatients = patients?.filter((patient: Patient) => {
    const matchesSearch = searchQuery === '' || 
      (patient.condition?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  // Get alerts for a specific patient
  const getPatientAlerts = (patientId: number) => {
    return alerts?.filter((alert: any) => alert.patientId === patientId) || [];
  };
  
  // Status badge colors
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800'
  };
  
  // Generate initials from patient name
  const getInitials = (fullName: string) => {
    return fullName?.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase() || 'P';
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Patients</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage and monitor your patients' progress
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button className="inline-flex items-center">
            <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
            Add New Patient
          </Button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Input 
            type="text" 
            placeholder="Search by name or condition..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-500">Status:</span>
          <select 
            className="bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>
      
      {/* Patients Table */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading patients...
                    </TableCell>
                  </TableRow>
                ) : filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No patients found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient: any) => {
                    const patientAlerts = getPatientAlerts(patient.id);
                    const criticalAlerts = patientAlerts.filter((a: any) => a.priority === 'critical' || a.priority === 'high');
                    
                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(patient.fullName || 'John Doe')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{patient.fullName || 'John Doe'}</div>
                              <div className="text-sm text-neutral-500">
                                Started {new Date(patient.startDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.condition}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[patient.status]}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>Dr. Sarah Reynolds</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm">
                              Score: <span className="font-medium">{patient.engagementScore}/100</span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${patient.engagementScore}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {patientAlerts.length > 0 ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className={criticalAlerts.length > 0 ? "text-red-600" : ""}
                                >
                                  <AlertCircle className={`h-4 w-4 mr-1 ${criticalAlerts.length > 0 ? "text-red-600" : ""}`} />
                                  {patientAlerts.length} alert{patientAlerts.length !== 1 ? 's' : ''}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Alerts for {patient.fullName || 'Patient'}</DialogTitle>
                                  <DialogDescription>
                                    Review and address patient alerts
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  {patientAlerts.map((alert: any) => (
                                    <div key={alert.id} className="p-3 border rounded-md">
                                      <div className="flex items-start">
                                        <AlertCircle className={`h-5 w-5 mr-2 ${
                                          alert.priority === 'critical' || alert.priority === 'high' 
                                            ? 'text-red-600' 
                                            : alert.priority === 'medium' 
                                              ? 'text-yellow-600' 
                                              : 'text-blue-600'
                                        }`} />
                                        <div>
                                          <h4 className="font-medium">{alert.type.split('_').map((word: string) => 
                                            word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                          </h4>
                                          <p className="text-sm text-neutral-600">{alert.message}</p>
                                          <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs">
                                              {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                                            </Badge>
                                            <span className="text-xs text-neutral-500">
                                              {new Date(alert.date).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-sm text-neutral-500">No alerts</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/session?patient=${patient.id}`}>
                              <a>
                                <Button variant="outline" size="sm">
                                  <BarChart className="h-4 w-4 mr-1" />
                                  Session
                                </Button>
                              </a>
                            </Link>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Plan
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Treatment Plan</DialogTitle>
                                  <DialogDescription>
                                    Schedule and manage treatment for {patient.fullName || 'Patient'}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <h4 className="font-medium">Current Plan</h4>
                                  <p className="text-sm mt-2">Treatment for {patient.condition}</p>
                                  <div className="mt-4 space-y-2">
                                    <div className="flex justify-between p-2 bg-neutral-50 rounded">
                                      <span>Target end date:</span>
                                      <span className="font-medium">
                                        {patient.targetEndDate 
                                          ? new Date(patient.targetEndDate).toLocaleDateString() 
                                          : 'Not set'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-neutral-50 rounded">
                                      <span>Sessions per week:</span>
                                      <span className="font-medium">3</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-neutral-50 rounded">
                                      <span>Current phase:</span>
                                      <span className="font-medium">Strength Building</span>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-neutral-500">
              Showing <span className="font-medium">{filteredPatients.length}</span> of{" "}
              <span className="font-medium">{patients?.length || 0}</span> patients
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Patients;
