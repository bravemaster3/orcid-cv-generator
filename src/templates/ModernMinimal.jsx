function ModernMinimal({ data }) {
    const { personal, photo, employment, education, publications, funding } = data
  
    return (
      <div className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'system-ui, sans-serif' }}>
        {/* Header */}
        <div className="flex items-start gap-8 mb-12 pb-8 border-b-2 border-gray-900">
          {photo && (
            <img
              src={photo}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {personal?.fullName}
            </h1>
            {personal?.biography && (
              <p className="text-gray-700 mb-4 leading-relaxed">
                {personal.biography}
              </p>
            )}
            {personal?.emails && personal.emails.length > 0 && (
              <div className="text-gray-600">
                {personal.emails[0]}
              </div>
            )}
            {personal?.keywords && personal.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {personal.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
  
        {/* Employment */}
        {employment && employment.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
              Experience
            </h2>
            <div className="space-y-6">
              {employment.map((job, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.role}
                    </h3>
                    <span className="text-gray-600 text-sm">
                      {job.startDate} - {job.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-gray-700 font-medium">
                    {job.organization}
                  </div>
                  {job.department && (
                    <div className="text-gray-600 text-sm">
                      {job.department}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {edu.title}
                    </h3>
                    <span className="text-gray-600 text-sm">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-gray-700 font-medium">
                    {edu.organization}
                  </div>
                  {edu.department && (
                    <div className="text-gray-600 text-sm">
                      {edu.department}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Publications */}
        {publications && publications.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
              Publications
            </h2>
            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div key={idx} className="text-sm text-gray-800">
                  {pub.authors && pub.authors.length > 0 && `${pub.authors.join(', ')} `}
                  {pub.year && `(${pub.year}): `}
                  <span className="font-medium text-gray-900">{pub.title}</span>
                  {pub.journalTitle && <span className="italic text-gray-700">. {pub.journalTitle}</span>}
                  {pub.volume && `, ${pub.volume}`}
                  {pub.issue && `(${pub.issue})`}
                  {pub.pages && `, ${pub.pages}`}
                  {pub.doi && <>. DOI: <a href={`https://doi.org/${pub.doi}`} className="underline text-gray-500">{pub.doi}</a></>}
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Funding */}
        {funding && funding.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
              Funding & Grants
            </h2>
            <div className="space-y-4">
              {funding.map((grant, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {grant.title}
                    </h3>
                    <span className="text-gray-600 text-sm">
                      {grant.startDate}
                      {grant.endDate && ` - ${grant.endDate}`}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    {grant.organization}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  export default ModernMinimal