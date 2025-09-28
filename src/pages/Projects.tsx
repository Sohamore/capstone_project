import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Building, CheckCircle } from 'lucide-react';
import ProjectDashboard from '@/components/ProjectDashboard';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const ongoingProjects = [
    {
      id: 1,
      name: 'Mumbai Commercial Complex',
      location: 'Mumbai, Maharashtra',
      progress: 75,
      startDate: 'Jan 2024',
      expectedCompletion: 'Mar 2024',
      type: 'Commercial',
      client: 'Reliance Industries Ltd.',
      budget: {
        total: 5000000,
        spent: 3750000,
        remaining: 1250000,
        pending: 500000,
      },
      materials: [
        { name: 'Steel Beams (I-Section)', quantity: '50 tons', cost: 2500000, supplier: 'Tata Steel', status: 'delivered' },
        { name: 'Reinforcement Bars', quantity: '25 tons', cost: 1000000, supplier: 'JSW Steel', status: 'delivered' },
        { name: 'Steel Plates', quantity: '15 tons', cost: 750000, supplier: 'SAIL', status: 'pending' },
        { name: 'Welding Electrodes', quantity: '200 kg', cost: 50000, supplier: 'ESAB', status: 'ordered' },
      ],
      updates: [
        {
          date: '2024-09-01',
          title: 'Foundation Work Completed',
          description: 'All foundation steel work has been completed ahead of schedule. Quality inspection passed.',
          status: 'completed',
          images: ['img1.jpg', 'img2.jpg']
        },
        {
          date: '2024-08-25',
          title: 'Structural Steel Installation',
          description: 'Main structural steel installation is 80% complete. Expected completion by end of week.',
          status: 'in-progress'
        }
      ],
      team: {
        contractors: ['Mumbai Steel Contractors Pvt Ltd', 'Precision Welding Services'],
        supervisors: ['Rajesh Kumar (Site Engineer)', 'Suresh Patil (Quality Manager)'],
        laborCount: 24
      },
      approvals: [
        { type: 'Material Purchase Order', status: 'pending', date: '2024-09-05' },
        { type: 'Safety Compliance Certificate', status: 'approved', date: '2024-08-30' },
        { type: 'Progress Payment Release', status: 'pending', date: '2024-09-02' }
      ]
    },
    {
      id: 2,
      name: 'Pune Industrial Warehouse',
      location: 'Pune, Maharashtra',
      progress: 40,
      startDate: 'Feb 2024',
      expectedCompletion: 'May 2024',
      type: 'Industrial',
      client: 'Bajaj Auto Limited',
      budget: {
        total: 3200000,
        spent: 1280000,
        remaining: 1920000,
        pending: 320000,
      },
      materials: [
        { name: 'Steel Trusses', quantity: '32 units', cost: 1600000, supplier: 'Tata Steel', status: 'ordered' },
        { name: 'Roofing Sheets', quantity: '500 sqm', cost: 400000, supplier: 'Jindal Steel', status: 'pending' },
        { name: 'Column Brackets', quantity: '48 units', cost: 192000, supplier: 'Local Fabricator', status: 'delivered' },
      ],
      updates: [
        {
          date: '2024-08-30',
          title: 'Site Preparation Complete',
          description: 'Ground leveling and foundation marking completed. Ready for steel installation.',
          status: 'completed'
        }
      ],
      team: {
        contractors: ['Pune Industrial Solutions', 'Maharashtra Steel Works'],
        supervisors: ['Amit Sharma (Project Manager)', 'Deepak Joshi (Site Supervisor)'],
        laborCount: 18
      },
      approvals: [
        { type: 'Environmental Clearance', status: 'approved', date: '2024-08-20' },
        { type: 'Steel Quality Certificate', status: 'pending', date: '2024-09-01' }
      ]
    },
    {
      id: 3,
      name: 'Nashik Residential Complex',
      location: 'Nashik, Maharashtra',
      progress: 60,
      startDate: 'Dec 2023',
      expectedCompletion: 'Apr 2024',
      type: 'Residential',
      client: 'Godrej Properties',
      budget: {
        total: 4500000,
        spent: 2700000,
        remaining: 1800000,
        pending: 450000,
      },
      materials: [
        { name: 'TMT Bars', quantity: '75 tons', cost: 3000000, supplier: 'Kamdhenu Steel', status: 'delivered' },
        { name: 'Structural Angles', quantity: '20 tons', cost: 600000, supplier: 'SAIL', status: 'delivered' },
        { name: 'Steel Mesh', quantity: '1000 sqm', cost: 300000, supplier: 'JSW Steel', status: 'ordered' },
      ],
      updates: [
        {
          date: '2024-09-02',
          title: 'Balcony Steel Work',
          description: 'Installation of balcony railings and structural supports in progress.',
          status: 'in-progress'
        },
        {
          date: '2024-08-28',
          title: 'Floor Structure Complete',
          description: 'Steel structure for floors 1-5 completed successfully.',
          status: 'completed'
        }
      ],
      team: {
        contractors: ['Nashik Construction Co.', 'Elite Steel Fabricators'],
        supervisors: ['Prakash Desai (Chief Engineer)', 'Ravi Kulkarni (Safety Officer)'],
        laborCount: 30
      },
      approvals: [
        { type: 'Building Plan Approval', status: 'approved', date: '2024-08-15' },
        { type: 'Fire Safety Clearance', status: 'approved', date: '2024-08-22' }
      ]
    }
  ];

  const completedProjects = [
    {
      id: 4,
      name: 'Aurangabad Steel Plant',
      location: 'Aurangabad, Maharashtra',
      completionDate: 'Dec 2023',
      type: 'Industrial',
      image: '/photos/aunranbad.jpg',
      client: 'Tata Steel Limited'
    },
    {
      id: 5,
      name: 'Kolhapur Shopping Mall',
      location: 'Kolhapur, Maharashtra',
      completionDate: 'Nov 2023',
      type: 'Commercial',
      image: '/photos/kolhapur.jpg',
      client: 'Phoenix Mills Limited'
    },
    {
      id: 6,
      name: 'Nagpur Office Building',
      location: 'Nagpur, Maharashtra',
      completionDate: 'Oct 2023',
      type: 'Commercial',
      image: '/photos/nagpur.jpg',
      client: 'Infosys Technologies'
    },
    {
      id: 7,
      name: 'Solapur Residential Towers',
      location: 'Solapur, Maharashtra',
      completionDate: 'Sep 2023',
      type: 'Residential',
      image: '/photos/solapur.jpg',
      client: 'Mahindra Lifespace'
    }
  ];

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-background/20 text-primary-foreground border-primary-foreground/20">
            Our Projects
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Building Maharashtra's
            <br />
            <span className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Steel Infrastructure</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Explore our portfolio of successfully completed projects and ongoing developments 
            across Maharashtra.
          </p>
        </div>
      </section>

      {/* Maharashtra Map */}
      <section className="py-20 bg-steel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Project Locations</h2>
            <p className="text-lg text-muted-foreground">
              Click on the markers to view detailed project information
            </p>
          </div>
          <div className="bg-background rounded-lg shadow-medium overflow-hidden">
            <div className="aspect-[16/10] w-full relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121059.04711156064!2d73.856255!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x554d27bb36991563!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1694000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Maharashtra Project Locations Map"
                className="rounded-lg border-0"
              ></iframe>
              
              {/* Interactive Markers */}
              <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-primary rounded-full cursor-pointer hover:scale-125 transition-transform duration-200 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                   onClick={() => handleProjectClick(ongoingProjects[0])}
                   title="Mumbai Commercial Complex">
                M
              </div>
              <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-green-500 rounded-full cursor-pointer hover:scale-125 transition-transform duration-200 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                   onClick={() => handleProjectClick(ongoingProjects[1])}
                   title="Pune Industrial Warehouse">
                P
              </div>
              <div className="absolute bottom-1/3 left-1/2 w-6 h-6 bg-blue-500 rounded-full cursor-pointer hover:scale-125 transition-transform duration-200 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                   onClick={() => handleProjectClick(ongoingProjects[2])}
                   title="Nashik Residential Complex">
                N
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center cursor-pointer hover:text-primary transition-colors"
                     onClick={() => handleProjectClick(ongoingProjects[0])}>
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span>Mumbai - Commercial Complex (Click for details)</span>
                </div>
                <div className="flex items-center cursor-pointer hover:text-green-600 transition-colors"
                     onClick={() => handleProjectClick(ongoingProjects[1])}>
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Pune - Industrial Warehouse (Click for details)</span>
                </div>
                <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
                     onClick={() => handleProjectClick(ongoingProjects[2])}>
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Nashik - Residential Complex (Click for details)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ongoing Projects</h2>
            <p className="text-lg text-muted-foreground">
              Track the progress of our current construction projects
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ongoingProjects.map((project, index) => (
              <Card 
                key={index} 
                className="hover:shadow-medium transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleProjectClick(project)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{project.type}</Badge>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Started: {project.startDate}
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Expected: {project.expectedCompletion}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Projects */}
      <section className="py-20 bg-steel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Completed Projects</h2>
            <p className="text-lg text-muted-foreground">
              Showcasing our successful project deliveries across Maharashtra
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {completedProjects.map((project, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-steel-dark/10">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                    <Badge variant="outline">{project.type}</Badge>
                  </div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {project.location}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Completed: {project.completionDate}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Status CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-15 space-y-6">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Track Your Project Status
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Are you our client? Login to your project portal to get real-time updates 
            on your project's progress.
          </p>
          {/*
            <Button 
              size="lg" 
              className="hero-gradient"
              onClick={() => navigate('/contact')}
            >
              Client Portal Login
            </Button>
          */}
        </div>
      </section>

      {/* Project Dashboard Modal */}
      <ProjectDashboard 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

export default Projects;