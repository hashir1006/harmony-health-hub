import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Activity, AlertTriangle, CheckCircle, ArrowRight, Stethoscope } from 'lucide-react';
import { symptomCategories } from '@/data/mockData';
import { SymptomAnalysis } from '@/types';

export default function SymptomCheckerPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
    setAnalysis(null);
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const criticalSymptoms = ['Chest pain', 'Difficulty breathing', 'Seizures', 'Severe headache', 'Coughing blood'];
      const hasCritical = selectedSymptoms.some(s => criticalSymptoms.includes(s));
      const matchedCategory = symptomCategories.find(cat =>
        cat.symptoms.some(s => selectedSymptoms.includes(s))
      );

      setAnalysis({
        suggestedDepartment: matchedCategory?.department || 'General Medicine',
        urgencyLevel: hasCritical ? 'emergency' : selectedSymptoms.length > 3 ? 'high' : 'medium',
        possibleConditions: ['Requires professional evaluation'],
        recommendations: [
          hasCritical ? 'Seek immediate medical attention' : 'Schedule an appointment soon',
          'Prepare a list of all medications',
          'Note when symptoms started',
        ],
        shouldSeekImmediate: hasCritical,
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <Header title="AI Symptom Checker" subtitle="Get guidance on your symptoms" />
      <div className="p-6 space-y-6">
        <Card className="border-l-4 border-l-warning bg-warning/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <p className="text-sm">This is for guidance only. Always consult a healthcare professional.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Your Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {symptomCategories.map((category) => (
                <div key={category.category}>
                  <h4 className="font-semibold mb-3 text-primary">{category.category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.symptoms.map((symptom) => (
                      <label key={symptom} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                        <Checkbox
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <span className="text-sm">{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                variant="gradient"
                className="w-full"
                onClick={analyzeSymptoms}
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
                <Activity className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-6 animate-fade-in">
                  <div className={`p-4 rounded-xl ${analysis.shouldSeekImmediate ? 'bg-critical/10 border border-critical' : 'bg-primary/10'}`}>
                    <p className="font-semibold mb-1">Suggested Department</p>
                    <p className="text-2xl font-bold">{analysis.suggestedDepartment}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Urgency Level</p>
                    <Badge variant={analysis.urgencyLevel === 'emergency' ? 'critical' : analysis.urgencyLevel === 'high' ? 'warning' : 'success'} className="text-base px-4 py-1">
                      {analysis.urgencyLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Recommendations</p>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="gradient" className="w-full">
                    Book Appointment <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select symptoms and click analyze</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
