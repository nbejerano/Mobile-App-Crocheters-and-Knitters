import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";

import Theme from "@/assets/theme";
import db from '@/database/db';

export default function Post({
  shouldNavigateOnPress = false,
  id,
  username,
  timestamp,
  text,
  score,
  vote,
  commentCount,
  userVote,
  userId,
  onPostUpdate,
}) {
  const [isLoading, setIsLoading] = useState(false);
  
  const submitVote = async (vote) => {
    setIsLoading(true);
  
    try {
      if (vote === 0) {
        const { error } = await db
          .from("likes")
          .delete()
          .eq("user_id", userId)
          .eq("post_id", id);
        if (error) throw error;
      } else {
        const { data, error } = await db
          .from("likes")
          .upsert(
            {
              user_id: userId,
              post_id: id,
              vote: vote,
            },
            { onConflict: ["user_id", "post_id"] }
          );
        if (error) throw error;
      }
      if (vote === 0) {
        onPostUpdate((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id
              ? { ...post, userVote: 0, like_count: post.like_count - userVote }
              : post
          )
        );
      } else {
        onPostUpdate((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  userVote: vote,
                  like_count: post.like_count + (vote - userVote),
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  let post = (
    <TouchableOpacity style={styles.content} disabled={!shouldNavigateOnPress}>
      <View style={styles.header}>
        <FontAwesome
          size={Theme.sizes.iconSmall}
          name="user"
          color={Theme.colors.iconSecondary}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <View style={styles.comment}>
          <FontAwesome
            size={Theme.sizes.iconSmall}
            name="comment"
            color={Theme.colors.iconSecondary}
          />
          <Text style={styles.commentCount}>{commentCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (shouldNavigateOnPress) {
    post = (
      <Link
        href={{
          pathname: "MainNav/feed/details",
          params: {
            id: id,
            username: username,
            timestamp: timestamp,
            text: text,
            score: score,
            commentCount: commentCount,
            vote: vote,
          },
        }}
        asChild={true}
        style={styles.content}
      >
        {post}
      </Link>
    );
  }

  const upvoteButton = (
    <TouchableOpacity
      onPress={() => (userVote > 0 ? submitVote(0) : submitVote(1))}
      style={styles.upvoteButton}
      disabled={isLoading}
    >
      <FontAwesome
        size={16}
        name="chevron-up"
        color={
          userVote > 0 ? Theme.colors.iconHighlighted : Theme.colors.iconSecondary
        }
      />
    </TouchableOpacity>
  );

  const downvoteButton = (
    <TouchableOpacity
      onPress={() => (userVote < 0 ? submitVote(0) : submitVote(-1))}
      style={styles.downvoteButton}
      disabled={isLoading}
    >
      <FontAwesome
        size={16}
        name="chevron-down"
        color={
          userVote < 0 ? Theme.colors.iconHighlighted : Theme.colors.iconSecondary
        }
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {post}
      <View style={styles.scoreContainer}>
        {upvoteButton}
        <Text style={styles.score}>{score}</Text>
        {downvoteButton}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    // padding: 24,
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 8,
    backgroundColor: Theme.colors.backgroundSecondary,
    flexDirection: "row",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  body: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  scoreContainer: {
    alignItems: "center",
    marginLeft: 16,
  },
  text: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    fontSize: Theme.sizes.textMedium,
  },
  username: {
    color: Theme.colors.textSecondary,
    fontWeight: "bold",
    marginLeft: 8,
  },
  timestamp: {
    color: Theme.colors.textSecondary,
    flex: 2,
  },
  comment: {
    flexDirection: "row",
    flex: 3,
  },
  commentCount: {
    color: Theme.colors.textSecondary,
    marginLeft: 8,
  },
  score: {
    color: Theme.colors.textHighlighted,
    fontWeight: "bold",
    fontSize: Theme.sizes.textLarge,
  },
});
