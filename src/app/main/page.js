"use client";

import { Menu, Send, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set state only after the component mounts on the client side
  }, []);


  const handleSelectFile = (event) => {
    setSelectedFile(event.target.value); // Update selected file
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      setError("Please type a query.");
      return;
    }
  
    if (uploadedFiles.length === 0) {
      setError("Please upload a file first.");
      return;
    }
  
    setError(""); // Clear any previous errors
  
    const newMessage = { id: crypto.randomUUID(), text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
  

    
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputMessage, doc_name: selectedFile}),
      });
  
      const data = await response.json();
  
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: data.response || "No response", sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  useEffect(() => {
    fetchUploadedFiles();
  }, []);  // Empty array ensures this runs only once on mount

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/uploaded_files");
      const data = await response.json();
     
      console.log(data)
      setUploadedFiles(data); // Update the state with the fetched files
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadedFiles((prev) => [...prev, file.name]); // Store filenames as strings

      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const removeFile = async (fileName) => {
    // Update the frontend state to remove the file
    setUploadedFiles((prev) => prev.filter((file) => file !== fileName));
  console.log(fileName)
    try {
      // Send a request to the backend to delete the file and associated vector store data
      const response = await fetch(`http://127.0.0.1:8000/delete_file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: fileName }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("File and related data deleted successfully.");
      } else {
        console.error("Failed to delete file:", data.error);
      }
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };
  
  return isClient ? (

    <div className="flex h-screen w-screen"  suppressHydrationWarning={true}>
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex-col md:block hidden">
        <div className="p-4">
          <h2 className="text-sm font-semibold mb-2 text-gray-400">FILES</h2>
          <div className="space-y-2">
          {uploadedFiles.length > 0 && (
  <select
    value={selectedFile}
    onChange={handleSelectFile}
    className="w-full bg-gray-800 text-white rounded-lg p-2"
  >
    <option value="" disabled className="text-gray-200">
      Select a file
    </option>
    {uploadedFiles.map((file, index) => (
      <option key={index} value={file} className="text-white">
        {file}
      </option>
    ))}
  </select>
)}

          {uploadedFiles.length === 0 && <p className="text-gray-400">No files uploaded</p>}
        </div>

        {/* Display remove button */}
        {selectedFile && (
          <div className="mt-2">
            <button
              onClick={() => removeFile(selectedFile)}
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Trash2 className="w-4 h-4 inline-block mr-2" />
              Remove Selected File
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white p-4 z-40">
          <button className="text-white text-lg" onClick={() => setIsMobileMenuOpen(false)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-purple-500 text-white shadow-md" : "bg-white text-gray-800 shadow-md"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-end gap-2">
            <label className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              <input type="file" onChange={handleFileUpload} className="hidden" />
              <Upload className="w-5 h-5 text-gray-600" />
            </label>

            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-2 pr-10 resize-none text-black"
                rows={1}
              />
              <div className="text-red-500">{error}</div> {/* Display error message */}
              <button onClick={handleSendMessage} className="absolute right-2 bottom-4 text-purple-500 hover:text-purple-700">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div> // You can display a loading state here until the component is ready on the client
  );
};

export default Chat;
