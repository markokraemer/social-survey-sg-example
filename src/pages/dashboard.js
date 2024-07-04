import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart as BarChartIcon, Users, FileText, MessageSquare, TrendingUp, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

const mockSurveyData = [
  { name: 'Survey A', responses: 120 },
  { name: 'Survey B', responses: 80 },
  { name: 'Survey C', responses: 200 },
  { name: 'Survey D', responses: 150 },
];

const mockPieData = [
  { name: 'Completed', value: 400 },
  { name: 'In Progress', value: 300 },
  { name: 'Not Started', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [stats, setStats] = useState([
    { title: "Total Surveys", value: "25", icon: FileText },
    { title: "Total Responses", value: "1,234", icon: Users },
    { title: "Completion Rate", value: "78%", icon: BarChartIcon },
    { title: "New Messages", value: "18", icon: MessageSquare },
  ]);

  const [recentSurveys, setRecentSurveys] = useState([
    { id: 1, title: "Community Health Assessment", responses: 150, status: "Active" },
    { id: 2, title: "Employee Satisfaction Survey", responses: 75, status: "Draft" },
    { id: 3, title: "Customer Feedback", responses: 200, status: "Closed" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New response received for 'Community Health Assessment'", time: "5 minutes ago" },
    { id: 2, message: "Survey 'Employee Satisfaction' is ready for review", time: "1 hour ago" },
    { id: 3, message: "Reminder: 'Customer Feedback' survey closes tomorrow", time: "3 hours ago" },
  ]);

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      setStats(prevStats => prevStats.map(stat => ({
        ...stat,
        value: stat.title === "New Messages" ? 
          (parseInt(stat.value) + Math.floor(Math.random() * 3)).toString() :
          stat.value
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, Jane Doe</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSurveyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="responses" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Survey Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentSurveys.map((survey) => (
                <li key={survey.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{survey.title}</p>
                    <p className="text-sm text-muted-foreground">{survey.responses} responses</p>
                  </div>
                  <Badge variant={survey.status === 'Active' ? 'default' : survey.status === 'Draft' ? 'secondary' : 'outline'}>
                    {survey.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li key={notification.id} className="flex items-start space-x-2">
                  <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Link href="/surveys/create">
            <Button>Create New Survey</Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline">View Analytics</Button>
          </Link>
          <Link href="/messages">
            <Button variant="outline">Check Messages</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}