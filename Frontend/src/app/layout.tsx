import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <Head>
                <title>AI Resume Analyzer</title>
                <meta name="description" content="Analyze your resume using AI" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
                <header>
                    <nav>
                        <ul>
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/resume">About</Link>
                            </li>
                        </ul>
                    </nav>
                </header>
                <main>{children}</main>
                <footer>
                    <p>&copy; {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
                </footer>
            </body>
        </html>
    );
};

export default Layout;