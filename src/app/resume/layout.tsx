import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>{children}</div>
    );
};

export default Layout;