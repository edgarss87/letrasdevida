import { GetStaticPaths, GetStaticProps } from "next";
import { connectToDatabase } from "../../util/mongodb";
import Head from "next/head";
import { useRouter } from "next/router";
import { IPost } from "../../interfaces/post";

interface IPostProps {
  post:IPost
}

export default function Post({ post }:IPostProps) {
  const router = useRouter();
  const { slug } = router.query;

  const generateContent = (content) => {

    return content.map((contentItem)=> {
      switch (contentItem.type){
        case 'text': {
          return (<p>{contentItem.text}</p>)
        }
        case 'text-image': {
          return (<>
            <img src={contentItem.image} alt="" />
            <p>{contentItem.text}</p>
          </>)
        }
      }
    });


  }

  return (
    <>
      <Head>
        <title>Letras de Vida - Post: {slug}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>{post.title}</h1>
      <p>{post.headline}</p>

      <div>
        Author: {post.author.name} - {post.author.email}
      </div>
      <small>{post.publish_date}</small>

      <br/><br/><br/>
      <div>
      {generateContent(post.content)}
      </div>
    </>
   
  );
}

export const getStaticProps: GetStaticProps<IPostProps> = async (context) => {
  const { db } = await connectToDatabase();

  const post:IPost = await db
    .collection("posts")
    .findOne({ slug: context.params.slug });

  const postProps:IPostProps = {
    post: JSON.parse(JSON.stringify(post)),
  }
  return {
    props: postProps
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: ["/post/my-first-post"], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
