import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  Building, 
  DollarSign, 
  Package, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Truck,
  FileText,
  Camera,
  TrendingUp,
  Wrench
} from 'lucide-react';

interface ProjectData {
  name: string;
  location: string;
  progress: number;
  startDate: string;
  expectedCompletion: string;
  type: string;
  client: string;
  budget: {
    total: number;
    spent: number;
    remaining: number;
    pending: number;
  };
  materials: Array<{
    name: string;
    quantity: string;
    cost: number;
    supplier: string;
    status: 'delivered' | 'pending' | 'ordered';
  }>;
  updates: Array<{
    date: string;
    title: string;
    description: string;
    images?: string[];
    status: 'completed' | 'in-progress' | 'issue';
  }>;
  team: {
    contractors: string[];
    supervisors: string[];
    laborCount: number;
  };
  approvals: Array<{
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
  }>;
}

interface ProjectDashboardProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  const progressColor = project.progress >= 75 ? 'bg-green-500' : project.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Building className="h-6 w-6 text-primary" />
            {project.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-base">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {project.location}
            </span>
            <Badge variant="outline">{project.type}</Badge>
            <Badge variant="secondary">Client: {project.client}</Badge>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Project Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Started</p>
                          <p className="font-medium">{project.startDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Expected</p>
                          <p className="font-medium">{project.expectedCompletion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Budget</span>
                      <span className="font-semibold">₹{project.budget.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount Spent</span>
                      <span className="font-semibold text-red-600">₹{project.budget.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="font-semibold text-green-600">₹{project.budget.remaining.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm text-muted-foreground">Pending Approvals</span>
                      <span className="font-semibold text-yellow-600">₹{project.budget.pending.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{project.materials.length}</div>
                    <div className="text-sm text-muted-foreground">Materials</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{project.team.laborCount}</div>
                    <div className="text-sm text-muted-foreground">Workers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{project.updates.length}</div>
                    <div className="text-sm text-muted-foreground">Updates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{project.approvals.filter(a => a.status === 'pending').length}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Materials & Products Used
                </CardTitle>
                <CardDescription>
                  Complete breakdown of materials used in this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.materials.map((material, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>{material.quantity}</TableCell>
                        <TableCell>₹{material.cost.toLocaleString()}</TableCell>
                        <TableCell>{material.supplier}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={material.status === 'delivered' ? 'default' : material.status === 'ordered' ? 'secondary' : 'outline'}
                            className={
                              material.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              material.status === 'ordered' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {material.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-square bg-steel rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">75%</div>
                        <div className="text-sm text-muted-foreground">Budget Used</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Materials</span>
                      <span className="font-semibold">₹{(project.budget.spent * 0.6).toLocaleString()}</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Labor</span>
                      <span className="font-semibold">₹{(project.budget.spent * 0.3).toLocaleString()}</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Equipment</span>
                      <span className="font-semibold">₹{(project.budget.spent * 0.1).toLocaleString()}</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Latest Project Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.updates.map((update, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{update.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={update.status === 'completed' ? 'default' : update.status === 'in-progress' ? 'secondary' : 'destructive'}>
                            {update.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {update.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                            {update.status === 'issue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {update.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                      {update.images && (
                        <div className="flex gap-2">
                          {update.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="w-16 h-16 bg-steel rounded border flex items-center justify-center">
                              <Camera className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Project Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Supervisors</h4>
                    <div className="space-y-1">
                      {project.team.supervisors.map((supervisor, index) => (
                        <div key={index} className="text-sm text-muted-foreground">{supervisor}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Contractors</h4>
                    <div className="space-y-1">
                      {project.team.contractors.map((contractor, index) => (
                        <div key={index} className="text-sm text-muted-foreground">{contractor}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Labor Force</h4>
                    <div className="text-2xl font-bold text-primary">{project.team.laborCount} Workers</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Pending Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.approvals.map((approval, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{approval.type}</span>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={approval.status === 'approved' ? 'default' : approval.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {approval.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{approval.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="hero-gradient">
            <Wrench className="h-4 w-4 mr-2" />
            Manage Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDashboard;