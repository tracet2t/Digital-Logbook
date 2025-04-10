import { useState, useRef, useEffect } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { User, Bot, Activity, Play, SquareX, Send, Wand2, Pencil, ArrowBigRightDash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AddNewActivityProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNewActivity: React.FC<AddNewActivityProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Hello! I can help you generate detailed activity descriptions. What would you like to describe?"
  ]);
  const [showAISection, setShowAISection] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Handle click outside flyout
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        flyoutRef.current &&
        !flyoutRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowAISection(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^([1-9]|1[0-2])?$/.test(value)) {
      setHours(value);
    }
  };

  const handleAISuggestion = async () => {
    if (!aiInput.trim()) return;

    try {
      const res = await fetch("/api/generateAiResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: aiInput }),
      });

      const data = await res.json();
      if (data.aiResponse) {
        setMessages((prev) => [...prev, data.aiResponse]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
    setAiInput("");
  };

  const handleSubmit = () => {
    console.log("Activity Submitted!");
    onClose();
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value || "<p><br></p>");
  };

  const handleSendMessage = async () => {
    if (aiInput.trim() === "") return;

    if (editingIndex !== null) {
      const newMessages = [...messages];
      newMessages[editingIndex] = aiInput;
      if (newMessages[editingIndex + 1]) {
        newMessages.splice(editingIndex + 1, 1);
      }
      setMessages(newMessages);
      setEditingIndex(null);
      await handleAISuggestion();
    } else {
      setMessages((prev) => [...prev, aiInput]);
      await handleAISuggestion();
    }
    setAiInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUseThis = (message: string) => {
    setDescription(message);
  };

  const handleRegenerate = async (index: number) => {
    try {
      const userMessage = messages[index - 1];
      const res = await fetch("/api/generateAiResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: userMessage }),
      });

      const data = await res.json();
      if (data.aiResponse) {
        const newMessages = [...messages];
        newMessages[index] = data.aiResponse;
        setMessages(newMessages);
      }
    } catch (error) {
      console.error("Error regenerating response:", error);
    }
  };

  const handleEditMessage = (index: number) => {
    setAiInput(messages[index - 1]);
    setEditingIndex(index - 1);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-4 sm:p-6 w-[95vw] sm:w-[450px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg">
        {/* Main Form Section */}
        <div className="w-full mx-auto relative h-fit">
          <div className="relative pb-2 mb-4 border-b border-gray-600">
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-1 right-0 text-gray-600 hover:text-black">
              <SquareX className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-purple-800 p-1 rounded ">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-md font-semibold">Add New Activity</h2>
            </div>
          </div>
          {/* Added gray background container */}
          <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Activity Title:</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter activity title"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Description:</label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  placeholder="Describe your activity..."
                  onChange={handleDescriptionChange}
                  className=" rounded-md bg-white"
                  style={{ height: "160px", width: "100%" }}
                />
              </div>

              <div className="flex items-baseline gap-3">
                <div className="flex flex-col">
                  <label className="text-sm font-medium">
                    Number of Hours Work:
                    <span className="block text-xs text-gray-500 font-normal mt-[-2px]">
                      (Enter the number of hours you <br /> have worked today)
                    </span>
                  </label>
                </div>
                <Input
                  value={hours}
                  onChange={handleHoursChange}
                  placeholder="1-12"
                  className="w-20 h-8 bg-white"  // Compact size
                />
              </div>
            </div>


            {/* Submit, cancel Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={onClose} className="bg-black text-white">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-purple-800 text-white">
                Submit
              </Button>
            </div>
          </div>
          {/* AI Trigger Button */}
          <button
            ref={buttonRef}
            onClick={() => setShowAISection((prev) => !prev)}
            className="absolute top-1/2 right-[-35px] bg-purple-600 text-white rounded-full p-2 shadow-lg transform -translate-y-1/2 hover:bg-purple-800 transition-all z-10"
          >
            <Play className={`w-6 h-6 transform transition-transform duration-300 ${showAISection ? 'rotate-180' : ''}`} />
          </button>

          {/* AI Flyout Menu */}
          {showAISection && (
            <div
              ref={flyoutRef}
              className="absolute right-[-20px] top-1/2 transform translate-x-full -translate-y-1/2 w-[350px] bg-white border rounded-lg shadow-lg z-50 ml-4"
              style={{ height: "calc(100% + 2rem)" }}
            >
              <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-t transform rotate-45" />

              <div className="p-4 h-full flex flex-col">
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  🤖 AI Description Assistant
                </h3>
                <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col" style={{ height: "440px", minHeight: "440px", maxHeight: "440px" }}>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4 ">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-end ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                      >
                        {index % 2 === 0 && <Bot className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />}
                        <Card className={`${index % 2 === 0 ? "bg-blue-200" : "bg-green-200"} text-black max-w-[90%]`}>
                          <CardContent className="text-sm p-2 break-words">
                            {msg}
                            {index % 2 === 0 && index !== 0 && ( // Added index !== 0 condition
                              <TooltipProvider>
                                <div className="flex gap-2 mt-2">
                                  {/* Use this */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleUseThis(msg)}
                                        className="border border-blue-500 text-blue-500 hover:bg-gradient-to-r from-blue-400 to-blue-600 hover:text-white shadow-md transition-all duration-200 hover:scale-105"
                                      >
                                        <ArrowBigRightDash className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Use this message</TooltipContent>
                                  </Tooltip>

                                  {/* Regenerate */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleRegenerate(index)}
                                        className="border border-green-500 text-green-500 hover:bg-gradient-to-r from-green-400 to-green-600 hover:text-white shadow-md transition-all duration-200 hover:scale-105"
                                      >
                                        <Wand2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Regenerate</TooltipContent>
                                  </Tooltip>

                                  {/* Edit */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEditMessage(index)}
                                        className="border border-yellow-500 text-yellow-500 hover:bg-gradient-to-r from-yellow-400 to-yellow-600 hover:text-white shadow-md transition-all duration-200 hover:scale-105"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit message</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            )}
                          </CardContent>
                        </Card>
                        {index % 2 !== 0 && <User className="w-5 h-5 ml-2 text-gray-600 flex-shrink-0" />}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="relative">
                    <Input
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Describe your activity..."
                      className="pr-10" // Add right padding to prevent text underlap
                    />
                    <Button
                      onClick={handleSendMessage}
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-auto p-1.5 hover:bg-transparent"
                    >
                      <Send className="w-5 h-5 text-gray-500 hover:text-purple-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Toaster />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddNewActivity;