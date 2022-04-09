/* pages/_app.js */
// import '../styles/globals.css'
import React from 'react';
import {Link} from "react-router-dom";
// import Link from 'next/link'

// { Component, pageProps }
export default function HeaderPage() {
    return (
        <div>
            <nav className="border-b p-6">
                <p className="text-4xl font-bold">Metaverse Marketplace</p>
                <div className="flex mt-4">
                    <div className="mr-4 text-pink-500">
                        <Link to="/">
                        Home
                        </Link>
                    </div>
                    <div className="mr-6 text-pink-500">
                        <Link to="/create-nft">
                        Sell NFT
                        </Link>
                    </div>
                    <div className="mr-6 text-pink-500">
                        <Link to="/my-nfts">
                        My NFTs
                        </Link>
                    </div>
                    <div className="mr-6 text-pink-500">
                        <Link to="/dashboard">
                        Dashboard
                        </Link>
                    </div>
                </div>
            </nav>
            {/*<Component {...pageProps} />*/}
        </div>
    )
}
