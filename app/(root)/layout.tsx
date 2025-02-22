import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';


type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = async ({ children }) => {
    const session = await auth();

    if (!session) redirect("/login");

    return (
        <main>
            {/* <Head>
                <title>AI Resume Analyzer</title>
                <meta name="description" content="Analyze your resume using AI" />
                <link rel="icon" href="/favicon.ico" />
            </Head> */}
            <div>
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
            </div>
        </main>
    );
};

export default Layout;