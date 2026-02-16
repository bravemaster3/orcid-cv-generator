function AcademicClassic({ data }) {
    const { personal, photo, employment, education, publications, funding } = data
  
    return (
      <div className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-4 border-double border-gray-800">
          <h1 className="text-5xl font-bold text-gray-900 mb-3" style={{ fontVariant: 'small-caps' }}>
            {personal?.fullName}
          </h1>
          {personal?.emails && personal.emails.length > 0 && (
            <div className="text-gray-700 text-lg">
              {personal.emails[0]}
            </div>
          )}
        </div>
  
        {photo && (
          <div className="flex justify-center mb-8">
            <img
              src={photo}
              alt="Profile"
              className="w-40 h-40 rounded object-cover border-2 border-gray-800"
            />
          </div>
        )}
  
        {/* Biography */}
        {personal?.biography && (
          <div className="mb-10">
            <p className="text-gray-800 leading-relaxed text-justify">
              {personal.biography}
            </p>
          </div>
        )}
  
        {/* Research Interests */}
        {personal?.keywords && personal.keywords.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Research Interests
            </h2>
            <p className="text-gray-800">
              {personal.keywords.join(' • ')}
            </p>
          </div>
        )}
  
        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="ml-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold text-gray-900">
                        {edu.title}
                      </div>
                      <div className="text-gray-800 italic">
                        {edu.organization}
                      </div>
                      {edu.department && (
                        <div className="text-gray-700 text-sm">
                          {edu.department}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-700 text-right">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Employment */}
        {employment && employment.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Academic Appointments
            </h2>
            <div className="space-y-4">
              {employment.map((job, idx) => (
                <div key={idx} className="ml-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold text-gray-900">
                        {job.role}
                      </div>
                      <div className="text-gray-800 italic">
                        {job.organization}
                      </div>
                      {job.department && (
                        <div className="text-gray-700 text-sm">
                          {job.department}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-700 text-right">
                      {job.startDate} - {job.endDate || 'Present'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Publications */}
        {publications && publications.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Publications
            </h2>
            <ol className="list-decimal ml-8 space-y-3">
              {publications.map((pub, idx) => (
                <li key={idx} className="text-gray-800 pl-2">
                  <span className="font-medium">{pub.title}.</span>
                  {pub.journalTitle && (
                    <span className="italic"> {pub.journalTitle}.</span>
                  )}
                  {pub.year && <span> ({pub.year}).</span>}
                </li>
              ))}
            </ol>
          </div>
        )}
  
        {/* Funding */}
        {funding && funding.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Grants & Funding
            </h2>
            <div className="space-y-4">
              {funding.map((grant, idx) => (
                <div key={idx} className="ml-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold text-gray-900">
                        {grant.title}
                      </div>
                      <div className="text-gray-800">
                        {grant.organization}
                      </div>
                    </div>
                    <div className="text-gray-700 text-right">
                      {grant.startDate}
                      {grant.endDate && ` - ${grant.endDate}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  export default AcademicClassic