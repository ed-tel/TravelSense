import { useState, useEffect } from "react";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download, MapPin, CreditCard, Calendar, Heart, User, Filter, FileSpreadsheet, FileJson, FileImage, Archive, FileCode, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface DataCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  examples: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "success" | "processing" | "error";
  recordsCount?: number;
  category: string;
  fileType?: string;
}

export function UploadDataPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [uploadError, setUploadError] = useState<string>("");
  const [newFileId, setNewFileId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const dataCategories: DataCategory[] = [
    {
      id: "location",
      name: "Location Data",
      description: "GPS coordinates, check-ins, travel routes, and frequently visited places",
      icon: MapPin,
      color: "text-blue-600 bg-blue-100",
      examples: ["GPS tracking data", "Check-in history", "Travel routes", "Location timestamps"]
    },
    {
      id: "spending",
      name: "Spending Data",
      description: "Transaction history, spending patterns, and budget information",
      icon: CreditCard,
      color: "text-green-600 bg-green-100",
      examples: ["Transaction receipts", "Spending categories", "Budget reports", "Payment history"]
    },
    {
      id: "booking",
      name: "Booking History",
      description: "Hotel bookings, flight reservations, and activity confirmations",
      icon: Calendar,
      color: "text-purple-600 bg-purple-100",
      examples: ["Hotel confirmations", "Flight tickets", "Activity bookings", "Rental reservations"]
    },
    {
      id: "preferences",
      name: "Travel Preferences",
      description: "Interests, dietary requirements, accessibility needs, and travel style",
      icon: Heart,
      color: "text-pink-600 bg-pink-100",
      examples: ["Preference surveys", "Interest profiles", "Dietary requirements", "Accessibility needs"]
    },
    {
      id: "contact",
      name: "Contact Information",
      description: "Communication preferences and notification settings",
      icon: User,
      color: "text-orange-600 bg-orange-100",
      examples: ["Email addresses", "Phone numbers", "Communication preferences", "Emergency contacts"]
    }
  ];

  // Load uploaded files from localStorage on mount
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('travelsense_uploaded_files');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  // Persist uploaded files to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('travelsense_uploaded_files', JSON.stringify(uploadedFiles));
    }
  }, [uploadedFiles]);

  // Clear animation flag after animation completes
  useEffect(() => {
    if (newFileId) {
      const timer = setTimeout(() => {
        setNewFileId(null);
      }, 400); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [newFileId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    setUploadError("");
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setUploadError("");
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    // Clear previous errors
    setUploadError("");
    
    // Check if category is selected
    if (!selectedCategory) {
      toast.error("Please select a data category first.");
      return;
    }

    // Validate file type
    const allowedTypes = ['.csv', '.json', '.xlsx', '.xls', '.pdf', '.txt', '.xml', '.docx', '.zip'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      const errorMsg = "Unsupported file type. Please upload in one of the accepted formats.";
      setUploadError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Simulate upload process
    setIsUploading(true);
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          
          // Add to uploaded files
          const newFile: UploadedFile = {
            id: Date.now().toString(),
            name: file.name,
            size: formatFileSize(file.size),
            uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: "success",
            recordsCount: Math.floor(Math.random() * 5000) + 100,
            category: selectedCategory,
            fileType: fileExtension.replace('.', '')
          };
          
          setNewFileId(newFile.id); // Trigger animation
          setUploadedFiles((prev) => [newFile, ...prev]);
          const categoryName = dataCategories.find(c => c.id === selectedCategory)?.name;
          toast.success(`${file.name} uploaded successfully to ${categoryName}!`);
          
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getCategoryById = (categoryId: string) => {
    return dataCategories.find(c => c.id === categoryId);
  };

  const filteredFiles = filterCategory === "all" 
    ? uploadedFiles 
    : uploadedFiles.filter(file => file.category === filterCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory]);

  const selectedCategoryData = selectedCategory ? getCategoryById(selectedCategory) : null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "processing":
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Complete</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getFileTypeIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="w-5 h-5" />;
    
    switch (fileType.toLowerCase()) {
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'json':
        return <FileJson className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'xml':
        return <FileCode className="w-5 h-5" />;
      case 'zip':
        return <Archive className="w-5 h-5" />;
      case 'txt':
      case 'docx':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getFileTypeBadge = (fileType?: string) => {
    if (!fileType) return null;
    return (
      <Badge variant="outline" className="text-xs uppercase">
        {fileType}
      </Badge>
    );
  };

  const handleDeleteFile = (fileId: string) => {
    const fileToDelete = uploadedFiles.find(f => f.id === fileId);
    setUploadedFiles((prev) => prev.filter(file => file.id !== fileId));
    toast.success(`${fileToDelete?.name || 'File'} deleted from upload history.`);
  };

  return (
    <main className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1>Upload Data</h1>
          <p className="text-muted-foreground">
            Upload your travel data files to share with tourism partners and earn rewards
          </p>
        </div>

        {/* Information Alert */}
        <Alert className="border-blue-200 bg-blue-50/50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Supported formats:</strong> CSV, JSON, Excel (.xlsx, .xls), PDF, TXT, XML, DOCX, ZIP. 
            Maximum file size: 50MB. Your data will be encrypted and processed securely.
          </AlertDescription>
        </Alert>

        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Data Category</CardTitle>
            <CardDescription>
              Choose the category that best matches your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="grid gap-4">
                {dataCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={category.id} id={category.id} className="mt-1" />
                      <Label 
                        htmlFor={category.id} 
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4>{category.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {category.examples.slice(0, 3).map((example, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Category-Specific Information */}
        {selectedCategoryData && (
          <Card className={`border-2 ${selectedCategoryData.color.replace('text-', 'border-').replace('bg-', 'border-')}`}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedCategoryData.color}`}>
                  {(() => {
                    const IconComponent = selectedCategoryData.icon;
                    return <IconComponent className="w-5 h-5" />;
                  })()}
                </div>
                <div className="flex-1 space-y-2">
                  <h4>Ready to upload {selectedCategoryData.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    This category includes: {selectedCategoryData.examples.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Upload Your File</CardTitle>
            <CardDescription>
              {selectedCategory 
                ? "Drag and drop your file here or click to browse"
                : "Please select a category first"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                      !selectedCategory
                        ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                        : isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        selectedCategory ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <Upload className={`w-8 h-8 ${selectedCategory ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="space-y-2">
                        <h3>
                          {!selectedCategory 
                            ? "Select a category to upload" 
                            : isDragging 
                            ? "Drop your file here" 
                            : "Upload your travel data"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedCategory ? "Upload anonymised data files (.csv, .json, .xlsx, .pdf, .txt, .xml, .docx, .zip)" : "Category selection required"}
                        </p>
                        
                        {/* File type badges */}
                        {selectedCategory && (
                          <div className="flex flex-wrap justify-center gap-2 pt-2">
                            <Badge variant="secondary" className="text-xs">
                              <FileSpreadsheet className="w-3 h-3 mr-1" />
                              CSV
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <FileJson className="w-3 h-3 mr-1" />
                              JSON
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <FileSpreadsheet className="w-3 h-3 mr-1" />
                              Excel
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              PDF
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              TXT
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <FileCode className="w-3 h-3 mr-1" />
                              XML
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              DOCX
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Archive className="w-3 h-3 mr-1" />
                              ZIP
                            </Badge>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".csv,.json,.xlsx,.xls,.pdf,.txt,.xml,.docx,.zip"
                        onChange={handleFileSelect}
                        disabled={!selectedCategory}
                      />
                      <label htmlFor="file-upload">
                        <Button asChild className="cursor-pointer" disabled={!selectedCategory}>
                          <span>Browse Files</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Accepted file types: CSV, JSON, Excel, PDF, TXT, XML, DOCX, ZIP</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Error Alert */}
            {uploadError && (
              <Alert className="mt-4 border-red-200 bg-red-50/50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-900">
                  {uploadError}
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upload History</CardTitle>
                <CardDescription>
                  View your previously uploaded data files
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {dataCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <h4>No datasets uploaded yet</h4>
                  <p className="text-sm mt-1">
                    Upload your first file to get started
                  </p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No files found in this category</p>
                </div>
              ) : (
                paginatedFiles.map((file) => {
                  const category = getCategoryById(file.category);
                  const IconComponent = category?.icon || FileText;
                  const isNewFile = file.id === newFileId;
                  
                  return (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between p-4 border rounded-2xl hover:bg-muted/30 transition-all duration-300 ${
                        isNewFile ? 'animate-slide-in-up shadow-md' : 'shadow-sm hover:shadow-md'
                      }`}
                      style={{
                        boxShadow: isNewFile ? '0 4px 12px rgba(0,0,0,0.1)' : undefined
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color || 'bg-gray-100'}`}>
                          {getFileTypeIcon(file.fileType) || <IconComponent className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4>{file.name}</h4>
                            {getStatusIcon(file.status)}
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {category?.name || 'Unknown'}
                            </Badge>
                            {file.fileType && (
                              <>
                                <span>•</span>
                                {getFileTypeBadge(file.fileType)}
                              </>
                            )}
                            <span>•</span>
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>{file.uploadDate}</span>
                            {file.recordsCount && (
                              <>
                                <span>•</span>
                                <span>{file.recordsCount.toLocaleString()} records</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(file.status)}
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteFile(file.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Pagination */}
            {filteredFiles.length > 0 && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredFiles.length)} of {filteredFiles.length} files
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Data Upload Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>What to Include</span>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Travel booking confirmations</li>
                  <li>Location check-ins</li>
                  <li>Spending transactions</li>
                  <li>Preference surveys</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>What Not to Include</span>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Credit card numbers</li>
                  <li>Passport information</li>
                  <li>Personal ID numbers</li>
                  <li>Unrelated personal data</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
