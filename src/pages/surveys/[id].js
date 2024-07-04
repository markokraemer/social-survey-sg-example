import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

// Mock survey data
const mockSurvey = {
  id: '1',
  title: 'Community Needs Assessment',
  description: 'Help us understand the needs of our community to improve our services.',
  questions: [
    {
      id: '1',
      type: 'text',
      text: 'What is your age?',
      required: true,
    },
    {
      id: '2',
      type: 'multipleChoice',
      text: 'Which of the following services do you think our community needs the most?',
      options: ['Mental Health Support', 'Youth Programs', 'Senior Care', 'Job Training'],
      required: true,
    },
    {
      id: '3',
      type: 'checkbox',
      text: 'Which of the following community events would you be interested in attending? (Select all that apply)',
      options: ['Community Cleanup', 'Cultural Festival', 'Health Fair', 'Educational Workshops'],
      required: false,
    },
    {
      id: '4',
      type: 'scale',
      text: 'On a scale of 1-5, how satisfied are you with the current community services?',
      required: true,
    },
    {
      id: '5',
      type: 'matrix',
      text: 'Please rate the following aspects of our community services:',
      rows: ['Accessibility', 'Quality', 'Variety'],
      columns: ['Poor', 'Fair', 'Good', 'Excellent'],
      required: true,
    },
    {
      id: '6',
      type: 'ranking',
      text: 'Please rank the following community improvement projects in order of importance (1 being most important):',
      options: ['Park Renovation', 'Library Expansion', 'Community Center Upgrade', 'Public Transportation Improvement'],
      required: true,
    },
  ],
};

export default function SurveyResponse() {
  const router = useRouter();
  const { id } = router.query;
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [survey, setSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating API call to fetch survey data
    const fetchSurvey = async () => {
      try {
        // In a real application, you would fetch the survey data from an API
        // For now, we'll use the mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setSurvey(mockSurvey);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load survey. Please try again.');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSurvey();
    }
  }, [id]);

  const handleInputChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleCheckboxChange = (questionId, option, checked) => {
    const currentResponses = responses[questionId] || [];
    const updatedResponses = checked
      ? [...currentResponses, option]
      : currentResponses.filter((item) => item !== option);
    setResponses({ ...responses, [questionId]: updatedResponses });
  };

  const handleMatrixChange = (questionId, row, column) => {
    setResponses({
      ...responses,
      [questionId]: { ...(responses[questionId] || {}), [row]: column },
    });
  };

  const handleRankingChange = (questionId, option, rank) => {
    setResponses({
      ...responses,
      [questionId]: { ...(responses[questionId] || {}), [option]: rank },
    });
  };

  const isQuestionAnswered = (question) => {
    if (!question.required) return true;
    const response = responses[question.id];
    if (!response) return false;
    if (Array.isArray(response)) return response.length > 0;
    if (typeof response === 'object') return Object.keys(response).length === question.rows?.length;
    return !!response;
  };

  const canProceed = () => {
    const currentQuestion = survey?.questions[currentQuestionIndex];
    return isQuestionAnswered(currentQuestion);
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the survey responses to your backend
    console.log(responses);
    // For now, we'll just log it to the console
    alert('Survey submitted successfully!');
    router.push('/dashboard');
  };

  if (isLoading) return <div>Loading survey...</div>;
  if (error) return <div>{error}</div>;
  if (!survey) return <div>Survey not found.</div>;

  const currentQuestion = survey.questions[currentQuestionIndex];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{survey.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{survey.description}</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Question {currentQuestionIndex + 1} of {survey.questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
              {currentQuestion.type === 'text' && (
                <Input
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                  placeholder="Enter your answer"
                  required={currentQuestion.required}
                />
              )}
              {currentQuestion.type === 'multipleChoice' && (
                <RadioGroup
                  onValueChange={(value) => handleInputChange(currentQuestion.id, value)}
                  value={responses[currentQuestion.id]}
                  required={currentQuestion.required}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                      <Label htmlFor={`${currentQuestion.id}-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {currentQuestion.type === 'checkbox' && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${currentQuestion.id}-${index}`}
                        checked={(responses[currentQuestion.id] || []).includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange(currentQuestion.id, option, checked)}
                      />
                      <Label htmlFor={`${currentQuestion.id}-${index}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              )}
              {currentQuestion.type === 'scale' && (
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[responses[currentQuestion.id] || 3]}
                  onValueChange={(value) => handleInputChange(currentQuestion.id, value[0])}
                  className="w-full"
                />
              )}
              {currentQuestion.type === 'matrix' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      {currentQuestion.columns.map((column, colIndex) => (
                        <TableHead key={colIndex}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentQuestion.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell>{row}</TableCell>
                        {currentQuestion.columns.map((column, colIndex) => (
                          <TableCell key={colIndex}>
                            <RadioGroup
                              onValueChange={(value) => handleMatrixChange(currentQuestion.id, row, value)}
                              value={responses[currentQuestion.id]?.[row]}
                              required={currentQuestion.required}
                            >
                              <RadioGroupItem value={column} id={`${currentQuestion.id}-${row}-${column}`} />
                            </RadioGroup>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {currentQuestion.type === 'ranking' && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        max={currentQuestion.options.length}
                        value={responses[currentQuestion.id]?.[option] || ''}
                        onChange={(e) => handleRankingChange(currentQuestion.id, option, e.target.value)}
                        className="w-16"
                        required={currentQuestion.required}
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            {currentQuestionIndex < survey.questions.length - 1 ? (
              <Button type="button" onClick={handleNext} disabled={!canProceed()}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={!canProceed()}>
                Submit Survey
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}