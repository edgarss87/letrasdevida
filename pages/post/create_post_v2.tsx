import { GetStaticPaths, GetStaticProps } from "next";
// import { connectToDatabase } from "../../util/mongodb";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  ContentType,
  IAutor,
  IPost,
  IText,
  ITextImage,
} from "../../interfaces/post";
import Button from "@material-ui/core/Button";
import { useState } from "react";
import CreateContentItem from "../../components/CreateContentItem/CreateContentItem";
import AddContent from "../../components/AddContent/AddContent";
import { useStyles } from "../../Styles/create_post_v2.styles";
import TextContentItem from "../../components/ContentItem/TextContentItem";
import TextImageContentItem from "../../components/ContentItem/TextImageContentItem";

export default function CreatePostV2() {
  const [contentItems, setContentItems] = useState<Array<IText | ITextImage>>(
    []
  );
  const classes = useStyles();

  const addContentItem = (newContentItem: IText | ITextImage) => {
    setContentItems([...contentItems, newContentItem]);
  };

  const renderContentItem = (contentItem: IText | ITextImage) => {
    switch (contentItem.type) {
      case ContentType.text:
        return <TextContentItem contentItem={contentItem} />;
        break;
      case ContentType.textImage:
        // return <TextImageContentItem contentItem={contentItem} />;
        break;

      default:
        return <></>;
        break;
    }
  };

  const renderContentItems = () => {
    return contentItems.map((contentItem, index) => {
      return (
        <div key={`content-item${index}`}>
          <div className={classes.contentItemContainer}>
            {renderContentItem(contentItem)}
          </div>
          <AddContent addContentItem={addContentItem} />
        </div>
      );
    });
  };

  const insertPost = async (newPost) => {
    const response = await fetch("/api/post", {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        post: newPost,
      }),
    });
    return await response.json();
  };

  return (
    <>
      <Head>
        <title>Letras de Vida - Create Post V2 </title>
      </Head>

      <AddContent addContentItem={addContentItem} />
      {renderContentItems()}
    </>
  );
}
