import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { AlertCircle, Building2, CheckCircle, Clock, FileText, MapPin, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const projects = [
  {
    id: 1,
    name: "Green Valley Residential Complex",
    land: "Green Valley E",
    location: "Bangalore, Karnataka",
    status: "in_progress",
    startDate: "Dec 1, 2024",
    expectedCompletion: "Jun 2026",
    progress: 15,
    totalValue: "₹2,10,00,000",
    documents: 3,
    updates: [
      { date: "Dec 10, 2024", text: "Foundation work started" },
      { date: "Dec 5, 2024", text: "Site clearance completed" },
      { date: "Dec 1, 2024", text: "Project initiated" },
    ],
  },
  {
    id: 2,
    name: "Tech Hub Office Complex",
    land: "Tech Park Zone D",
    location: "Hyderabad, Telangana",
    status: "planning",
    startDate: "-",
    expectedCompletion: "Dec 2026",
    progress: 0,
    totalValue: "₹3,50,00,000",
    documents: 1,
    updates: [
      { date: "Dec 12, 2024", text: "Architectural plans submitted for approval" },
    ],
  },
];

const statusConfig = {
  planning: { color: "bg-blue-50 text-blue-600", icon: FileText, label: "Planning" },
  in_progress: { color: "bg-amber-50 text-amber-600", icon: Clock, label: "In Progress" },
  completed: { color: "bg-green-50 text-green-600", icon: CheckCircle, label: "Completed" },
  on_hold: { color: "bg-red-50 text-red-600", icon: AlertCircle, label: "On Hold" },
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateText, setUpdateText] = useState("");

  const handleAddUpdate = () => {
    if (!updateText.trim()) {
      toast.error("Please enter an update");
      return;
    }
    toast.success("Project update added successfully!");
    setShowUpdateModal(false);
    setUpdateText("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
        <p className="text-muted-foreground mt-1">Manage your approved land development projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{projects.length}</p>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === "in_progress").length}</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === "planning").length}</p>
          <p className="text-sm text-muted-foreground">Planning</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === "completed").length}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, index) => {
          const config = statusConfig[project.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </span>
                      <span>•</span>
                      <span>{project.land}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedProject(project);
                      setShowUpdateModal(true);
                    }}>
                      <Upload className="w-4 h-4 mr-2" />
                      Add Update
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                {project.status === "in_progress" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-medium text-foreground">{project.startDate}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Expected Completion</p>
                    <p className="font-medium text-foreground">{project.expectedCompletion}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="font-medium text-foreground">{project.totalValue}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Documents</p>
                    <p className="font-medium text-foreground">{project.documents} uploaded</p>
                  </div>
                </div>

                {/* Recent Updates */}
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Recent Updates</h4>
                  <div className="space-y-2">
                    {project.updates.slice(0, 2).map((update, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">{update.date}</span>
                        <span className="text-foreground">{update.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Update Modal */}
      {showUpdateModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">Add Project Update</h2>
            <p className="text-sm text-muted-foreground mb-6">{selectedProject.name}</p>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Update Details</label>
              <Input
                placeholder="Enter project update..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Attach Documents (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleAddUpdate}>
                Add Update
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Projects;
