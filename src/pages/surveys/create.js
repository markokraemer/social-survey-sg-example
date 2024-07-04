import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, ArrowRight, GripVertical } from 'lucide-react';
import { motion, Reorder } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'multipleChoice', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'scale', label: 'Scale' },
  { value: 'matrix', label: 'Matrix' },
  { value: 'ranking', label: 'Ranking' },
];

export default function CreateSurvey() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'text', text: '', options: [], required: false, branching: {} }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const toggleRequired = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].required = !newQuestions[index].required;
    setQuestions(newQuestions);
  };

  const updateBranching = (questionIndex, option, targetQuestion) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].branching[option] = targetQuestion;
    setQuestions(newQuestions);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newQuestions = Array.from(questions);
    const [reorderedItem] = newQuestions.splice(result.source.index, 1);
    newQuestions.splice(result.destination.index, 0, reorderedItem);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, questions });
    alert('Survey created successfully!');
  };

  const renderQuestionPreview = (question, index) => {
    switch (question.type) {
      case 'text':
        return <Input placeholder="Enter your answer" disabled />;
      case 'multipleChoice':
        return (
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <input type="radio" id={`q${index}-o${optionIndex}`} name={`q${index}`} disabled />
                <label htmlFor={`q${index}-o${optionIndex}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <input type="checkbox" id={`q${index}-o${optionIndex}`} disabled />
                <label htmlFor={`q${index}-o${optionIndex}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'scale':
        return (
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex flex-col items-center">
                <input type="radio" id={`q${index}-s${value}`} name={`q${index}`} value={value} disabled />
                <label htmlFor={`q${index}-s${value}`}>{value}</label>
              </div>
            ))}
          </div>
        );
      case 'matrix':
        return (
          <table className="w-full">
            <thead>
              <tr>
                <th></th>
                {['Option 1', 'Option 2', 'Option 3'].map((option, i) => (
                  <th key={i}>{option}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Row 1', 'Row 2', 'Row 3'].map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row}</td>
                  {['Option 1', 'Option 2', 'Option 3'].map((_, colIndex) => (
                    <td key={colIndex}>
                      <input type="radio" name={`q${index}-r${rowIndex}`} disabled />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'ranking':
        return (
          <div className="space-y-2">
            {['Item 1', 'Item 2', 'Item 3'].map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-2">
                <Input type="number" min="1" max="3" className="w-16" disabled />
                <span>{item}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Survey</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Survey Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Survey Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter survey title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter survey description"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {questions.map((question, index) => (
                      <Draggable key={index} draggableId={`question-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Card className="mb-4">
                                <CardContent className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label>Question {index + 1}</Label>
                                    <div className="flex items-center space-x-2">
                                      <GripVertical className="h-5 w-5 text-gray-500 cursor-move" />
                                      <Button variant="ghost" size="icon" onClick={() => removeQuestion(index)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <Select
                                    value={question.type}
                                    onValueChange={(value) => updateQuestion(index, 'type', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select question type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {questionTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    value={question.text}
                                    onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                                    placeholder="Enter question text"
                                  />
                                  {(question.type === 'multipleChoice' || question.type === 'checkbox' || question.type === 'ranking') && (
                                    <div className="space-y-2">
                                      {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center space-x-2">
                                          <Input
                                            value={option}
                                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                            placeholder={`Option ${optionIndex + 1}`}
                                          />
                                          <Button variant="ghost" size="icon" onClick={() => removeOption(index, optionIndex)}>
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                          <Select
                                            value={question.branching[option] || ''}
                                            onValueChange={(value) => updateBranching(index, option, value)}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Branch to" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {questions.map((q, qIndex) => (
                                                <SelectItem key={qIndex} value={qIndex.toString()}>
                                                  Question {qIndex + 1}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      ))}
                                      <Button type="button" variant="outline" onClick={() => addOption(index)}>
                                        Add Option
                                      </Button>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id={`required-${index}`}
                                      checked={question.required}
                                      onCheckedChange={() => toggleRequired(index)}
                                    />
                                    <Label htmlFor={`required-${index}`}>Required</Label>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button type="button" variant="outline" onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Survey Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Button type="button" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            {showPreview && (
              <div className="mt-4 space-y-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p>{description}</p>
                {questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {index + 1}. {question.text}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    {renderQuestionPreview(question, index)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end">
          <Button type="submit">Create Survey</Button>
        </CardFooter>
      </form>
    </div>
  );
}