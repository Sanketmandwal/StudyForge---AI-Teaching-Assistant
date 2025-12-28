import React from 'react'

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  )
}

export default PageHeader
