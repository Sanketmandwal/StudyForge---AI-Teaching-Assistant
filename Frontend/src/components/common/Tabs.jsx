import React from 'react'

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <nav className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`relative px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.name
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>{tab.label || tab.name}</span>
            
            {/* Active Tab Indicator */}
            {activeTab === tab.name && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={activeTab === tab.name ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabs
