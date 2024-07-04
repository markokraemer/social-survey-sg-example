import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Edit, Trash2, BarChart2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const mockSurveys = [
  { id: 1, title: "Community Health Assessment", responses: 150, status: "Active", createdAt: "2023-05-01" },
  { id: 2, title: "Youth Engagement Program", responses: 75, status: "Draft", createdAt: "2023-05-15" },
  { id: 3, title: "Senior Care Satisfaction", responses: 200, status: "Closed", createdAt: "2023-04-20" },
  { id: 4, title: "Mental Health Awareness", responses: 100, status: "Active", createdAt: "2023-05-10" },
  { id: 5, title: "Education Resources Survey", responses: 50, status: "Active", createdAt: "2023-05-05" },
];

export default function Surveys() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [surveysPerPage] = useState(5);
  const [previewSurvey, setPreviewSurvey] = useState(null);

  const sortedSurveys = [...mockSurveys].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredSurveys = sortedSurveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastSurvey = currentPage * surveysPerPage;
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
  const currentSurveys = filteredSurveys.slice(indexOfFirstSurvey, indexOfLastSurvey);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Surveys</h1>
        <Link href="/surveys/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Survey
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Surveys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Search surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                  Title <SortIcon field="title" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('responses')}>
                  Responses <SortIcon field="responses" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                  Status <SortIcon field="status" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                  Created At <SortIcon field="createdAt" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {currentSurveys.map((survey) => (
                  <motion.tr
                    key={survey.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="font-medium">{survey.title}</TableCell>
                    <TableCell>{survey.responses}</TableCell>
                    <TableCell>
                      <Badge variant={survey.status === 'Active' ? 'default' : survey.status === 'Draft' ? 'secondary' : 'outline'}>
                        {survey.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{survey.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <BarChart2 className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setPreviewSurvey(survey)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{survey.title} Preview</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <p><strong>Status:</strong> {survey.status}</p>
                              <p><strong>Responses:</strong> {survey.responses}</p>
                              <p><strong>Created At:</strong> {survey.createdAt}</p>
                              {/* Add more survey details here */}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <Select value={`${surveysPerPage}`} onValueChange={(value) => setCurrentPage(1)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Surveys per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(filteredSurveys.length / surveysPerPage) }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}