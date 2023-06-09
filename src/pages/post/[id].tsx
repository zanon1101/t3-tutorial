import { type NextPage } from "next";

import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post History</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>Posts</div>
      </main>
    </>
  );
};

export default SinglePostPage;
