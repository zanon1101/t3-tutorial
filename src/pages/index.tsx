import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import Head from "next/head";

import { type RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <Image 
        src={user.profileImageUrl} 
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        height={56}
        width={56}
      />
      <input placeholder="Type some emojis!" className="bg-transparent grow outline-none"/>
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        className="flex h-14 w-14 rounded-full"
        alt="User profile image"
        height={56}
        width={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username}`}</span> 
          <span className="font-thin">
            {`· ${dayjs(post.createdAt).fromNow()} `}
          </span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );

}

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Something went wrong...</div>;
  
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full md:max-w-2xl  border-slate-400 border-x">
        <div className="border-b border-slate-400 p-4">
          {!user.isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {user.isSignedIn && <CreatePostWizard />}
        </div> 
        <div className="flex flex-col">
          {[...data, ...data]?.map((fullPost) => (
            <PostView {...fullPost} key={fullPost.post.id}/>
          ))}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
      </main>
    </>
  );
};

export default Home;
