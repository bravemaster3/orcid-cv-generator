import { formatAuthors } from './shared/cvData'

function TechStartup({ data }) {
    const { personal, photo, employment, education, publications, funding } = data
  
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Header with photo */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center gap-6">
            {photo && (
              <img
                src={photo}
                alt="Profile"
                className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {personal?.fullName}
              </h1>
              {personal?.emails && personal.emails.length > 0 && (
                <div className="text-blue-100 text-lg mb-3">
                  {personal.emails[0]}
                </div>
              )}
              {personal?.keywords && personal.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {personal.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/20 backdrop-blur text-white text-sm rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* About */}
        {personal?.biography && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">💡</span> About
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personal.biography}
            </p>
          </div>
        )}
  
        {/* Experience */}
        {employment && employment.length > 0 && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">💼</span> Experience
            </h2>
            <div className="space-y-5">
              {employment.map((job, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {job.role}
                    </h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {job.startDate} - {job.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-blue-600 font-semibold">
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
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">🎓</span> Education
            </h2>
            <div className="space-y-5">
              {education.map((edu, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.title}
                    </h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-purple-600 font-semibold">
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
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">📚</span> Publications
            </h2>
            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div key={idx} className="pb-3 border-b border-gray-100 last:border-0 text-sm text-gray-700">
                  {pub.authors && pub.authors.length > 0 && <>{formatAuthors(pub.authors, personal?.fullName).map((seg, i) =>
                  seg.bold ? <strong key={i}>{seg.text}</strong> : <span key={i}>{seg.text}</span>
                )}{' '}</>}
                  {pub.year && `(${pub.year}): `}
                  <span className="font-semibold text-gray-900">{pub.title}</span>
                  {pub.journalTitle && <span className="italic text-blue-600">. {pub.journalTitle}</span>}
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
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">💰</span> Funding & Grants
            </h2>
            <div className="space-y-4">
              {funding.map((grant, idx) => (
                <div key={idx} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">
                      {grant.title}
                    </h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                      {grant.startDate}
                      {grant.endDate && ` - ${grant.endDate}`}
                    </span>
                  </div>
                  <div className="text-green-600 font-medium">
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
  
  export default TechStartup