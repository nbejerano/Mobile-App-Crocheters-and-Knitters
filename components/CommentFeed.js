import { useState, useEffect } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";

import Theme from "@/assets/theme";
import Comment from "./Comment";
import Loading from "./Loading";

import timeAgo from "@/utils/timeAgo";
import db from "@/database/db";

export default function CommentFeed({ postId, addCommentToFeed }) {
  const [comments, setComments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data: commentsData, error: commentsError } = await db
        .from("comments")
        .select("*")
        .eq("post_id", postId);
  
      if (commentsError) throw commentsError;

      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComments();

    if (addCommentToFeed) {
      addCommentToFeed.current = (newComment) => {
        setComments((prevComments) => [newComment, ...prevComments]);
      };
    }
  }, [postId, addCommentToFeed]);

  if (isLoading && !isRefreshing) {
    return <Loading />;
  }

  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => (
        <Comment
          username={item.username}
          timestamp={timeAgo(item.timestamp)}
          text={item.text}
        />
      )}
      contentContainerStyle={styles.posts}
      style={styles.postsContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            fetchComments();
          }}
          tintColor={Theme.colors.textPrimary} // only applies to iOS
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  postsContainer: {
    marginTop: 24,
  },
  posts: {
    gap: 8,
  },
});
