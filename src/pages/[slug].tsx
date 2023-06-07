import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import Image from "next/image";

import Head from "next/head";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import { PageLayout } from "~/components/layout";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUserName.useQuery({
    username,
  });

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="h-36 border-slate-400 bg-slate-600 relative">
          <Image 
            className="-mb-[64px] absolute bottom-0 left-0 ml-4 rounded-full border-4 border-black bg-black"
            src={data.profileImageUrl}
            alt="user profile image"
            height={128}
            width={128}
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl">{`@${data.username ?? ""}`}</div>
        <div className="w-full border-b border-slate-400"></div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug as string;

  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUserName.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
