import { Link } from 'react-router-dom'
import { Github, Coffee, Shield, FileText } from 'lucide-react'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* About column */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <FileText className="w-5 h-5 text-primary-400" />
              ORCID CV Generator
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Generate beautiful, professional CVs directly from your ORCID profile.
              Free, open-source, and privacy-friendly.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Your data never leaves your browser</span>
            </div>
          </div>

          {/* Quick links column */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">CV Generator</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">Templates</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/contribute" className="hover:text-white transition-colors">Contribute a Template</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Connect column */}
          <div>
            <h3 className="text-white font-semibold mb-3">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/bravemaster3/orcid-cv-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
              <a
                href="https://buymeacoffee.com/bravemaster"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-yellow-400 transition-colors"
              >
                <Coffee className="w-4 h-4 text-yellow-500" />
                Buy Me a Coffee
              </a>
              <a
                href="https://orcid.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">O</span>
                ORCID Website
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {year} ORCID CV Generator. Open source under the MIT License.</span>
          <span>Built with React, Tailwind CSS &amp; ❤️</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
