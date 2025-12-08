import { useState, useCallback } from 'react';
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle, Leaf, Bug, Droplets, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

interface DiseaseAnalysis {
  isHealthy: boolean;
  diseaseName: string;
  confidence: number;
  affectedPart: string;
  cause: string;
  symptoms: string[];
  prevention: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  urgency: string;
  additionalNotes: string;
}

const CropDiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 10MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-crop-disease', {
        body: { imageBase64: selectedImage }
      });

      if (error) throw error;

      if (data.analysis) {
        setAnalysis(data.analysis);
        toast({
          title: 'Analysis Complete',
          description: `Detected: ${data.analysis.diseaseName}`,
        });
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysis(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-green-500 bg-green-500/10 border-green-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
              <Bug className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold">
                AI Crop <span className="gradient-text">Disease Detection</span>
              </h1>
              <p className="text-muted-foreground">
                Upload a photo of your crop and get instant disease diagnosis
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Upload Crop Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedImage ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-xl p-12 text-center
                      transition-all duration-300 cursor-pointer
                      ${dragActive 
                        ? 'border-primary bg-primary/5 scale-[1.02]' 
                        : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">
                          Drag & drop your image here
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          or click to browse files
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supports: JPG, PNG, WebP (Max 10MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-secondary/30">
                      <img
                        src={selectedImage}
                        alt="Selected crop"
                        className="w-full h-64 object-contain"
                      />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                            <p className="text-sm font-medium">Analyzing your crop...</p>
                            <p className="text-xs text-muted-foreground">AI is detecting diseases</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="flex-1 shimmer"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Leaf className="w-4 h-4 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetAnalysis}
                        disabled={isAnalyzing}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="w-4 h-4 text-accent" />
                  Tips for Best Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Take clear, well-lit photos of affected areas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Include close-ups of leaves, stems, or fruits showing symptoms
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Avoid blurry or overexposed images
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Show both healthy and affected parts for comparison
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Main Result Card */}
                <Card className={`bg-card/50 backdrop-blur border-2 ${analysis.isHealthy ? 'border-green-500/30' : 'border-orange-500/30'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        analysis.isHealthy 
                          ? 'bg-green-500/10' 
                          : 'bg-orange-500/10'
                      }`}>
                        {analysis.isHealthy ? (
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-8 h-8 text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(analysis.urgency)}`}>
                            {analysis.urgency.toUpperCase()} URGENCY
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{analysis.diseaseName}</h3>
                        <p className="text-muted-foreground text-sm">
                          Affected: {analysis.affectedPart} • Confidence: {analysis.confidence}%
                        </p>
                        <div className="mt-3 w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cause Card */}
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bug className="w-4 h-4 text-primary" />
                      Cause
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{analysis.cause}</p>
                  </CardContent>
                </Card>

                {/* Symptoms Card */}
                {analysis.symptoms.length > 0 && (
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Symptoms Detected
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Prevention Card */}
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-500" />
                      Prevention Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.prevention.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Treatment Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-500" />
                        Organic Treatment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.organicTreatment.map((treatment, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        Chemical Treatment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.chemicalTreatment.map((treatment, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Notes */}
                {analysis.additionalNotes && (
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="w-4 h-4 text-accent" />
                        Additional Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{analysis.additionalNotes}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-card/50 backdrop-blur border-border/50 h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 mx-auto rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                    <Leaf className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Upload a photo of your crop to get instant AI-powered disease detection and treatment recommendations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDiseasePrediction;
