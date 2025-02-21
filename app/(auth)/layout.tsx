import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <header>
                <h1>AI Resume Analyzer</h1>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <p>&copy; 2023 AI Resume Analyzer. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;