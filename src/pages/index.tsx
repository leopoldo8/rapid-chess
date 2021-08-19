import Head from "next/head";

import Chessboard from "../components/atoms/Chessboard";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Rapid Chess</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Chessboard />
      </main>

      <style jsx>{`
        .container {
          width: 100%;
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #000;
        }
        main {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
