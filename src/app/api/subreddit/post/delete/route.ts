import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { deletePostValidator } from "@/lib/validators/deletePost";
import { z } from "zod";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { postId, authorId } = deletePostValidator.parse(
      Object.fromEntries(searchParams)
    );

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });
    if (post.authorId !== authorId)
      return new Response("Unauthorized", { status: 401 });

    // await db.vote.deleteMany({
    //   where: {
    //     postId,
    //   },
    // });

    // await db.comment.deleteMany({
    //   where: {
    //     postId,
    //   },
    // });

    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      include: {
        replies: true,
      },
    });

    for (const comment of comments) {
      await db.comment.deleteMany({
        where: {
          id: {
            in: comment.replies.map((reply) => reply.id),
          },
        },
      });
    }
    await db.comment.deleteMany({
      where: {
        postId,
      },
    });
    await db.post.delete({
      where: {
        id: postId,
      },
    });

    // Delete post from redis cache
    // const cachedPost = await redis.hgetall(`post:${postId}`);
    // if (cachedPost) await redis.del(`post:${postId}`);

    return new Response("Post deleted", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Invalid post request data passed", { status: 422 });

    return new Response("Could not create post" + error, { status: 500 });
  }
}
