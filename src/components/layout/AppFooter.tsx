import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter: React.FC = () => {
  console.log('AppFooter loaded');
  const currentYear = new Date().getFullYear();
  const appVersion = "0.1.0-beta"; // Example version

  return (
    <footer className="border-t bg-muted/40 text-muted-foreground">
      <div className="container flex h-12 items-center justify-between px-4 md:px-6 text-xs">
        <p>&copy; {currentYear} WhatsApp Web Clone. Version {appVersion}</p>
        <div className="flex items-center gap-4">
          {/* These routes are not defined in App.tsx, will lead to NotFoundPage or need to be added */}
          <Link to="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
        <p id="connection-status">Status: <span className="text-green-600 font-medium">Connected</span></p>
      </div>
    </footer>
  );
};

export default AppFooter;