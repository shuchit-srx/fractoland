import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OwnerAddLand = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Full Land Data State
  const [formData, setFormData] = useState({
    name: "",
    landType: "self_land",
    location: "",
    description: "",
    litigationDescription: "",
    // Location Details
    surveyNumber: "",
    village: "",
    hobli: "",
    mandal: "",
    district: "",
    state: "",
    country: "",
    fullAddress: "",
    // Physical & Financial
    area: "",
    pricePerSqFt: "",
    totalValue: "",
    expectedROI: "",

    // Sale Details
    sellType: "full" as "full" | "percent" | "amount",
    sellInput: "", // % or Amount to sell
    retainedArea: "", // Derived

    // Projection
    projectionYears: "",


    // Owner
    ownerName: "",
    ownerType: "Private Owner",
    ownerContact: "",
    // Dynamic Arrays
    features: [] as string[],
    exitConditions: [] as string[],
    images: [] as string[],
  });

  const [legalAnswers, setLegalAnswers] = useState<Record<string, "yes" | "no">>({
    dueDiligence: "no",
    prevAgreements: "no",
    litigations: "no",
    titleDisputes: "no",
    mortgage: "no",
  });

  // Helper Inputs
  const [newFeature, setNewFeature] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newImage, setNewImage] = useState("");

  // Derived Calculations
  const [calculatedStats, setCalculatedStats] = useState({
    soldAreaAcres: 0,
    retainedAreaAcres: 0,
    projectedRetainedValue: 0,
  });

  // Auto-Calculate Logic
  useEffect(() => {
    const areaAcres = parseFloat(formData.area) || 0;
    const priceSqFt = parseFloat(formData.pricePerSqFt.replace(/,/g, "")) || 0;
    const roi = parseFloat(formData.expectedROI) || 0;
    const years = parseFloat(formData.projectionYears) || 0;
    const sellInputVal = parseFloat(formData.sellInput) || 0;

    // 1 Acre = 43,560 SqFt
    const SQFT_PER_ACRE = 43560;

    let soldAcres = 0;

    if (formData.sellType === "full") {
      soldAcres = areaAcres;
    } else if (formData.sellType === "percent") {
      soldAcres = areaAcres * (sellInputVal / 100);
    } else if (formData.sellType === "amount") {
      soldAcres = sellInputVal;
    }

    // Cap sold acres at total acres
    if (soldAcres > areaAcres) soldAcres = areaAcres;

    // Retained
    const retainedAcres = Math.max(0, areaAcres - soldAcres);

    // Total Value (Sale Price)
    const totalSaleValue = Math.round(soldAcres * SQFT_PER_ACRE * priceSqFt);

    // Projected Value of Retained Land: Current Value * (1 + ROI/100 * Years)
    // Current retained value
    const currentRetainedValue = retainedAcres * SQFT_PER_ACRE * priceSqFt;
    const futureValue = Math.round(currentRetainedValue * (1 + (roi / 100) * years));


    if (totalSaleValue !== parseFloat(formData.totalValue)) {
      setFormData(prev => ({ ...prev, totalValue: totalSaleValue > 0 ? totalSaleValue.toString() : "" }));
    }

    setCalculatedStats({
      soldAreaAcres: parseFloat(soldAcres.toFixed(2)),
      retainedAreaAcres: parseFloat(retainedAcres.toFixed(2)),
      projectedRetainedValue: futureValue
    });

  }, [formData.area, formData.pricePerSqFt, formData.sellType, formData.sellInput, formData.projectionYears, formData.expectedROI]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ... (rest of dynamic handlers remain same, omitted for brevity in single block if possible, but replace needs context)
  const handleLegalAnswerChange = (key: string, value: "yes" | "no") => {
    setLegalAnswers(prev => ({ ...prev, [key]: value }));
  };

  const legalQuestions = [
    { key: "dueDiligence", label: "1. Legal Due Diligence Completion" },
    { key: "prevAgreements", label: "2. Previous Agreements related to this" },
    { key: "litigations", label: "3. Litigations / Boundary Disputes" },
    { key: "titleDisputes", label: "4. Title Disputes" },
    { key: "mortgage", label: "5. Mortgage" },
  ];

  // Dynamic Array Handlers
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({ ...prev, exitConditions: [...prev.exitConditions, newCondition.trim()] }));
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setFormData((prev) => ({ ...prev, exitConditions: prev.exitConditions.filter((_, i) => i !== index) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Submitted Data:", {
        ...formData,
        ...calculatedStats,
        legalAnswers
      });
      toast.success("Land submitted for verification as a draft.");
      navigate("/dashboard/owner/lands");
    }, 1000);
  };

  // ...

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Land</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Provide comprehensive details about your land.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. Basic Info */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Basic Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Land Title / Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Green Valley Farm"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Project Location / City</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Whitefield, Bangalore"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Land Type</label>
              <Select
                value={formData.landType}
                onValueChange={(val) => handleSelectChange("landType", val)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self_land">Self Land</SelectItem>
                  <SelectItem value="family_land">Family Land</SelectItem>
                  <SelectItem value="relatives_land">Relatives Land</SelectItem>
                  <SelectItem value="friends_land">Friends Land</SelectItem>
                  <SelectItem value="customers_land">Customers Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the land, potential, and surroundings..."
              className="rounded-xl min-h-[100px]"
            />
          </div>
        </section>

        {/* 2. Detailed Location */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-2">

            <h2 className="text-lg font-semibold text-foreground">Detailed Location</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Survey Number</label>
              <Input
                name="surveyNumber"
                value={formData.surveyNumber}
                onChange={handleInputChange}
                placeholder="e.g. 123/A"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Village</label>
              <Input
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                placeholder="Village Name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Mandal / Hobli</label>
              <Input
                name="hobli"
                value={formData.hobli}
                onChange={handleInputChange}
                placeholder="Mandal"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">District</label>
              <Input
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder="District"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">State</label>
              <Input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Country</label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="India"
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Full Address / Landmark</label>
            <Textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleInputChange}
              placeholder="Complete address with nearby landmarks..."
              className="rounded-xl"
            />
          </div>
        </section>

        {/* 3. Physical & Financial Details */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-foreground">Physical & Financial Details</h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              1 Acre = 43,560 Sq.ft
            </span>
          </div>

          <div className="space-y-6">
            {/* Primary Inputs */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Total Land Area (Acres)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="e.g. 5.0"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Expected Price (per Sq.ft)</label>
                <Input
                  type="number"
                  name="pricePerSqFt"
                  value={formData.pricePerSqFt}
                  onChange={handleInputChange}
                  placeholder="₹1,200"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Expected ROI (%)</label>
                <Input
                  name="expectedROI"
                  value={formData.expectedROI}
                  onChange={handleInputChange}
                  placeholder="e.g. 15"
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Sale Logic Block */}
            <div className="p-4 bg-secondary/10 rounded-xl border border-border/50 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <label className="text-sm font-semibold text-foreground min-w-[100px]">I want to sell:</label>
                <div className="flex bg-background p-1 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => handleSelectChange("sellType", "full")}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${formData.sellType === "full" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    Full Land
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectChange("sellType", "percent")}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${formData.sellType === "percent" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    Percent
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectChange("sellType", "amount")}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${formData.sellType === "amount" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    Specific Acres
                  </button>
                </div>
              </div>

              {/* Conditional Input for Partial Sale */}
              {formData.sellType !== "full" && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1 w-full max-w-[200px]">
                    <label className="text-xs text-muted-foreground">
                      {formData.sellType === "percent" ? "Percentage to Sell (%)" : "Acres to Sell"}
                    </label>
                    <Input
                      type="number"
                      name="sellInput"
                      value={formData.sellInput}
                      onChange={handleInputChange}
                      placeholder={formData.sellType === "percent" ? "50" : "2.5"}
                      className="rounded-xl bg-background"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground pt-4">
                    = <span className="font-semibold text-foreground">{calculatedStats.soldAreaAcres} Acres</span> for Sale
                  </div>
                </div>
              )}

              {/* Total Value Result */}
              <div className="pt-2 border-t border-border/50 grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary">Total Sale Value (Auto)</label>
                  <Input
                    readOnly
                    value={formData.totalValue ? `₹${Number(formData.totalValue).toLocaleString()}` : "₹0"}
                    className="rounded-xl bg-primary/5 border-primary/20 font-mono font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Retained Land Projection Block */}
            {formData.sellType !== "full" && (
              <div className="p-4 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-xl border border-indigo-500/20 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Retained Land Projection</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Retained Area</label>
                    <Input
                      readOnly
                      value={`${calculatedStats.retainedAreaAcres} Acres`}
                      className="rounded-xl bg-background/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Hold Period (Years)</label>
                    <Input
                      type="number"
                      name="projectionYears"
                      value={formData.projectionYears}
                      onChange={handleInputChange}
                      placeholder="e.g. 5"
                      className="rounded-xl bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-indigo-400">Projected Future Value</label>
                    <Input
                      readOnly
                      value={calculatedStats.projectedRetainedValue ? `₹${calculatedStats.projectedRetainedValue.toLocaleString()}` : "₹0"}
                      className="rounded-xl bg-background font-mono text-indigo-400 font-bold border-indigo-500/30"
                    />
                    <p className="text-[10px] text-muted-foreground">Based on {formData.expectedROI || 0}% annual ROI</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* 4. Owner Information */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Owner Information</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Owner / Entity Name</label>
              <Input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Listed Owner Name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Owner Type</label>
              <Select
                value={formData.ownerType}
                onValueChange={(val) => handleSelectChange("ownerType", val)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="LLP">LLP</SelectItem>
                  <SelectItem value="Private Limited">Private Limited</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Contact Person</label>
              <Input
                name="ownerContact"
                value={formData.ownerContact}
                onChange={handleInputChange}
                placeholder="Representative Name"
                className="rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* 5. Features & Amenities (Dynamic) */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Features & Amenities</h2>
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature (e.g. 'Road Access', 'Clear Title')"
              className="rounded-xl"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} variant="secondary" className="rounded-xl">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.features.map((feature, index) => (
              <span key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm">
                {feature}
                <button type="button" onClick={() => removeFeature(index)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {formData.features.length === 0 && <span className="text-sm text-muted-foreground italic">No features added yet.</span>}
          </div>
        </section>

        {/* 6. Exit Conditions (Dynamic) */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Exit Conditions</h2>
          <div className="flex gap-2">
            <Input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Add an exit condition clause..."
              className="rounded-xl"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
            />
            <Button type="button" onClick={addCondition} variant="secondary" className="rounded-xl">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {formData.exitConditions.map((condition, index) => (
              <div key={index} className="flex items-start justify-between bg-secondary/30 p-2 rounded-lg text-sm border border-border/50">
                <span>{index + 1}. {condition}</span>
                <button type="button" onClick={() => removeCondition(index)} className="text-muted-foreground hover:text-destructive p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {formData.exitConditions.length === 0 && <span className="text-sm text-muted-foreground italic">No exit conditions defined.</span>}
          </div>
        </section>

        {/* 7. Gallery Images (File Upload) */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Land Images</h2>

          <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-secondary/5"
            onClick={() => document.getElementById("image-upload-input")?.click()}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-foreground">Click to upload images</span>
              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
            <Input
              id="image-upload-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.images.map((img, index) => (
              <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-border group bg-secondary">
                <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Documents & Legal Questions */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Upload className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Legal & Documents</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Litigation Summary</label>
              <Textarea
                name="litigationDescription"
                value={formData.litigationDescription}
                onChange={handleInputChange}
                placeholder="Describe the legal status, any past disputes, or clean title confirmation..."
                className="rounded-xl min-h-[80px]"
              />
            </div>

            {legalQuestions.map((q) => (
              <div key={q.key} className="bg-secondary/20 rounded-xl p-4 border border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">{q.label}</span>
                  <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => handleLegalAnswerChange(q.key, "yes")}
                      className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${legalAnswers[q.key] === "yes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLegalAnswerChange(q.key, "no")}
                      className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${legalAnswers[q.key] === "no" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Conditional Upload */}
                <motion.div
                  initial={false}
                  animate={{
                    height: legalAnswers[q.key] === "yes" ? "auto" : 0,
                    opacity: legalAnswers[q.key] === "yes" ? 1 : 0,
                    marginTop: legalAnswers[q.key] === "yes" ? 16 : 0
                  }}
                  className="overflow-hidden"
                >
                  <div className="border border-dashed border-primary/30 bg-primary/5 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    <span className="text-xs text-muted-foreground">Upload document proof for {q.label}</span>
                    <Input
                      type="file"
                      className="w-full max-w-xs text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:cursor-pointer"
                    />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full px-6"
            onClick={() => navigate("/dashboard/owner/lands")}
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              size="lg"
              className="rounded-full px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Land Draft"}
            </Button>
          </motion.div>
        </div>
      </form>
    </div >
  );
};

export default OwnerAddLand;
