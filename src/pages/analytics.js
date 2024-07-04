import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from "framer-motion";

// Mock data for the charts
const ageData = [
  { name: '18-24', value: 400 },
  { name: '25-34', value: 300 },
  { name: '35-44', value: 200 },
  { name: '45-54', value: 278 },
  { name: '55-64', value: 189 },
  { name: '65+', value: 239 },
];

const satisfactionData = [
  { name: 'Very Satisfied', value: 30 },
  { name: 'Satisfied', value: 45 },
  { name: 'Neutral', value: 15 },
  { name: 'Dissatisfied', value: 8 },
  { name: 'Very Dissatisfied', value: 2 },
];

const responseOverTimeData = [
  { date: '2023-01', responses: 65 },
  { date: '2023-02', responses: 78 },
  { date: '2023-03', responses: 90 },
  { date: '2023-04', responses: 81 },
  { date: '2023-05', responses: 95 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [queryHistory, setQueryHistory] = useState([]);

  useEffect(() => {
    // Simulating AI-generated suggestions based on the current query
    const generateSuggestions = () => {
      const possibleSuggestions = [
        "What is the average age of respondents?",
        "Show me the distribution of satisfaction scores",
        "What's the trend in response rate over time?",
        "Identify any correlations between age and satisfaction",
        "Which questions have the highest skip rate?"
      ];
      const filteredSuggestions = possibleSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(aiQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 3)); // Limit to top 3 suggestions
    };

    if (aiQuery) {
      generateSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [aiQuery]);

  const handleAiQuery = () => {
    // Simulate AI response (replace with actual API call in production)
    setAiResponse(`Analysis for "${aiQuery}": Based on the survey data, we can observe that the age group 18-24 has the highest participation rate. This suggests that our outreach efforts have been particularly effective among younger demographics. To improve engagement across all age groups, we might consider tailoring our communication strategies for older participants and exploring channels that are more popular among different age brackets.`);
    
    // Add query to history
    setQueryHistory([...queryHistory, aiQuery]);
    
    // Clear the input
    setAiQuery('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Survey Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedSurvey} value={selectedSurvey}>
            <SelectTrigger>
              <SelectValue placeholder="Select a survey" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="community-needs">Community Needs Assessment</SelectItem>
              <SelectItem value="mental-health">Mental Health Survey</SelectItem>
              <SelectItem value="youth-programs">Youth Programs Feedback</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="charts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Responses Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="responses" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="ai-analysis">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-grow relative">
                  <Input
                    placeholder="Ask a question about your survey data"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                  />
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1"
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-accent cursor-pointer"
                          onClick={() => setAiQuery(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
                <Button onClick={handleAiQuery}>Analyze</Button>
              </div>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="mt-4">
                      <p>{aiResponse}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              {queryHistory.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Recent Queries:</h3>
                  <ul className="space-y-1">
                    {queryHistory.slice(-5).reverse().map((query, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {query}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}