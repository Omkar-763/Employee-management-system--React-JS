// Full Feed.tsx with all form types and Create Document toggle implemented
import React, { useState } from 'react';
import {
  ChevronDown,
  Paperclip,
  FileText,
  AtSign,
  Quote,
  Send,
  ThumbsUp,
  CheckSquare,
  ListPlus
} from 'lucide-react';

const tabs = ['Message', 'Task', 'Event', 'Poll'];
const moreOptions = ['File', 'Appreciation'];

function Feed() {
  const [activeTab, setActiveTab] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [moreLabel, setMoreLabel] = useState('More');
  const [formVisible, setFormVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [message, setMessage] = useState('');
  const [showCreatedBy, setShowCreatedBy] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showObservers, setShowObservers] = useState(false);
  const [showCreateDocOptions, setShowCreateDocOptions] = useState(false);

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
    setFormVisible(true);
    setMoreLabel('More');
    setShowDropdown(false);
    setShowCreateDocOptions(false);
  };

  const handleMoreClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownSelect = (option: React.SetStateAction<string>) => {
    setActiveTab(option);
    setFormVisible(true);
    setMoreLabel(option);
    setShowDropdown(false);
    setShowCreateDocOptions(false);
  };

  const handlePlaceholderClick = () => {
    setActiveTab('Message');
    setFormVisible(true);
  };

  const renderCreateDocOptions = () => (
    <div className="mt-4 flex gap-4">
      <button className="border px-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-800">Document</button>
      <button className="border px-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-800">Spreadsheet</button>
      <button className="border px-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-800">Presentation</button>
    </div>
  );

  const renderToolbar = () => (
    <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mt-4">
      <Paperclip size={18} /> File
      <div onClick={() => setShowCreateDocOptions(!showCreateDocOptions)} className="flex items-center gap-2 cursor-pointer">
        <FileText size={18} /> Create document
      </div>
      <AtSign size={18} /> Mention
      <Quote size={18} /> Quote
      <CheckSquare size={18} /> Checklist
      <ListPlus size={18} /> Add to checklist
    </div>
  );

  const renderTags = () => (
    <div className="mt-4">
      <label className="text-sm text-gray-700 dark:text-gray-300 mr-2">Tags:</label>
      <span className="text-blue-500 cursor-pointer text-sm">+ Add more</span>
    </div>
  );

  const renderRecipients = () => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-4">
      <label className="text-sm text-gray-700 dark:text-gray-300 w-12 sm:w-auto">To:</label>
      <div className="flex-1 border px-3 py-2 rounded-md dark:border-gray-600 bg-gray-100 dark:bg-gray-900 flex items-center gap-2">
        <span className="bg-lime-200 px-2 py-1 rounded text-sm">All employees</span>
        <span className="text-blue-500 cursor-pointer text-sm">+ Add more</span>
      </div>
    </div>
  );

  const renderMessageForm = () => (
    <>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="w-full h-40 p-4 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600 text-gray-700 dark:text-white resize-none"
      />
      {renderToolbar()}
      {showCreateDocOptions && renderCreateDocOptions()}
      {renderTags()}
      {renderRecipients()}
    </>
  );

  const renderFileForm = () => (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {["Upload", "My Drive", "Google Docs", "Office 365", "Dropbox"].map((label) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center border p-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <div className="text-2xl">📁</div>
            <div className="mt-2 text-sm">{label}</div>
          </div>
        ))}
      </div>
      <div className="col-span-full border border-dashed px-4 py-8 text-center rounded-md text-gray-500 dark:text-gray-300 mt-4">
        Drop your files here
      </div>
      {renderTags()}
      {renderRecipients()}
    </>
  );

  const renderAppreciationForm = () => (
    <>
      <textarea
        placeholder="Type @ to mention someone, or Space to use CoPilot"
        className="w-full h-32 p-4 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600 text-gray-700 dark:text-white resize-none"
      />
      {renderToolbar()}
      {showCreateDocOptions && renderCreateDocOptions()}
      {renderTags()}
      {renderRecipients()}
      <div className="flex items-center mt-4 gap-3">
        <ThumbsUp size={24} className="text-purple-500" />
        <span className="text-gray-700 dark:text-gray-200 text-sm">Recipient: <span className="text-blue-500 cursor-pointer">+ Add employees</span></span>
      </div>
    </>
  );

  const renderTaskForm = () => (
    <>
      <input
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter task name"
        className="w-full border-b-2 border-gray-300 dark:border-gray-600 p-2 text-lg font-medium bg-transparent dark:text-white"
      />
      
      <textarea
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Type @ to mention someone, or Space to use CoPilot"
        className="w-full h-28 mt-4 p-4 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600 text-gray-700 dark:text-white resize-none"
      />
      {renderToolbar()}
      {showCreateDocOptions && renderCreateDocOptions()}
      
      <div className="flex items-center mt-4">
        <label className="text-sm mr-2 text-gray-700 dark:text-gray-300">Assignee:</label>
        <div className="flex gap-2 border px-2 py-1 rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Priyanka pawar</span>
          <span className="text-blue-500 cursor-pointer text-sm">+ Add more</span>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="flex gap-6 text-sm text-blue-500 cursor-pointer">
          <span onClick={() => setShowCreatedBy(!showCreatedBy)}>Created by</span>
          <span onClick={() => setShowParticipants(!showParticipants)}>Participants</span>
          <span onClick={() => setShowObservers(!showObservers)}>Observers</span>
        </div>
        {showCreatedBy && (
          <div className="flex items-center gap-4 mt-2 border px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Created by:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Priyanka pawar</span>
            <span className="text-blue-500 ml-2 cursor-pointer">Change</span>
          </div>
        )}
        {showParticipants && (
          <div className="flex items-center gap-4 mt-2 border px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Participants:</span>
            <span className="text-blue-500 cursor-pointer">+ Add</span>
          </div>
        )}
        {showObservers && (
          <div className="flex items-center gap-4 mt-2 border px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Observers:</span>
            <span className="text-blue-500 cursor-pointer">+ Add</span>
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <label className="text-sm text-gray-700 dark:text-gray-300">Deadline:</label>
        <input type="date" className="border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
        <span className="text-blue-500 text-sm cursor-pointer">Time planning</span>
        <span className="text-blue-500 text-sm cursor-pointer">Options</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
        <label className="text-sm text-gray-700 dark:text-gray-300">Task status summary is required</label>
      </div>
    </>
  );

  const renderFormContent = () => {
    switch (activeTab) {
      case 'Message': return renderMessageForm();
      case 'Task': return renderTaskForm();
      case 'File': return renderFileForm();
      case 'Appreciation': return renderAppreciationForm();
      default: return null;
    }
  };

  return (
    <div className="ml-5 mt-6 w-[75%] max-w-[1100px] rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
      <div className="flex border-b dark:border-gray-600 relative">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 font-medium text-sm ${activeTab === tab && formVisible ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
        <div className="relative">
          <button
            onClick={handleMoreClick}
            className={`flex items-center px-4 py-2 font-medium text-sm ${moreOptions.includes(activeTab) && formVisible ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400'}`}
          >
            {moreLabel.toUpperCase()}
            <ChevronDown size={16} className="ml-1" />
          </button>
          {showDropdown && (
            <div className="absolute left-0 top-[42px] bg-white dark:bg-gray-700 shadow-lg rounded-md z-10 w-48">
              {moreOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => handleDropdownSelect(option)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {!formVisible && (
        <div
          onClick={handlePlaceholderClick}
          className="mt-4 border rounded-md px-4 py-3 text-gray-400 cursor-text bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-gray-400"
        >
          Send message...
        </div>
      )}
      {formVisible && (
        <div className="mt-6 space-y-4">
          {renderFormContent()}
          <div className="flex gap-4 pt-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm flex items-center gap-2">
              <Send size={16} /> SEND
            </button>
            <button
              className="text-gray-500 dark:text-gray-300 text-sm"
              onClick={() => {
                setFormVisible(false);
                setActiveTab('');
                setMoreLabel('More');
                setShowCreateDocOptions(false);
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;