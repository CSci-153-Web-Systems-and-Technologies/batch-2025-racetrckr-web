import { Github, Facebook, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t bg-muted text-muted-foreground">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <aside className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={50}
              height={50}
              className="h-10 w-10"
            />
            <p className="text-sm">
              Copyright © {new Date().getFullYear()} - All right reserved
            </p>
          </aside>

          <nav className="flex items-center gap-4">
            <a
              href="https://github.com/jaaseiadev" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#fc4c02] transition-colors"
              aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#fc4c02] transition-colors"
              aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/jaaseia" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#fc4c02] transition-colors"
              aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}