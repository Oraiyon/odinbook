import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import { unlink } from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// dest starts from root directory
const upload = multer({ dest: "./src/server/public/uploads" });

cloudinary.config({
  // Put in Railway
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const post_post = [
  upload.single("file"),
  expressAsyncHandler(async (req, res, next) => {
    const post = await prisma.post.create({
      data: {
        authorId: req.body.author,
        text: req.body.text
      }
    });
    if (post) {
      const imageURL = await cloudinary.uploader.upload(req.file.path, {
        folder: "odinbook_posts",
        public_id: post.id
      });
      await unlink(req.file.path);
      const finalPost = await prisma.post.update({
        where: {
          id: post.id
        },
        data: {
          image: imageURL.secure_url
        }
      });
      res.status(200).json(finalPost);
    } else {
      await unlink(req.file.path);
      res.status(200).json(false);
    }
  })
];

export const get_posts = expressAsyncHandler(async (req, res, next) => {
  const postList = await prisma.post.findMany({
    skip: Number(req.params.skip),
    take: Number(req.params.take),
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      Comments: {
        include: {
          author: {
            omit: {
              password: true
            }
          }
        }
      },
      author: true
    }
  });
  res.status(200).json(postList);
});

export const get_post = expressAsyncHandler(async (req, res, next) => {
  const post = await prisma.post.findFirst({
    where: {
      id: req.params.postId
    },
    include: {
      Likes: {
        include: {
          likedBy: {
            omit: {
              password: true
            }
          }
        }
      },
      Comments: {
        include: {
          author: {
            omit: {
              password: true
            }
          }
        },
        orderBy: {
          commentDate: "desc"
        }
      },
      author: {
        omit: {
          password: true
        }
      }
    }
  });
  res.status(200).json(post);
});

export const get_user_posts = expressAsyncHandler(async (req, res, next) => {
  const postList = await prisma.post.findMany({
    skip: Number(req.params.skip),
    take: Number(req.params.take),
    where: {
      authorId: req.params.id
    },
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      Comments: {
        include: {
          author: {
            omit: {
              password: true
            }
          }
        }
      },
      author: true
    }
  });
  res.status(200).json(postList);
});

export const get_following_posts = expressAsyncHandler(async (req, res, next) => {
  const followList = await prisma.follow.findMany({
    where: {
      senderId: req.params.id
    }
  });
  if (!followList.length) {
    res.status(200).json(false);
    return;
  }
  const followIds = [];
  for (const follow of followList) {
    followIds.push(follow.receiverId);
  }
  const postList = await prisma.post.findMany({
    skip: Number(req.params.skip),
    take: Number(req.params.take),
    where: {
      authorId: {
        in: followIds
      }
    },
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      Comments: {
        include: {
          author: {
            omit: {
              password: true
            }
          }
        }
      },
      author: true
    }
  });
  if (!postList.length) {
    res.status(200).json(false);
    return;
  } else {
    res.status(200).json(postList);
    return;
  }
});

export const delete_post = expressAsyncHandler(async (req, res, next) => {
  const [deletedLikes, deletedComments, deletePost] = await prisma.$transaction([
    prisma.likes.deleteMany({
      where: {
        postId: req.params.postId
      }
    }),
    prisma.comment.deleteMany({
      where: {
        postId: req.params.postId
      }
    }),
    prisma.post.delete({
      where: {
        id: req.params.postId
      }
    })
  ]);
  await cloudinary.uploader.destroy(`odinbook_posts/${req.params.postId}`);
  const path = req.path.split("/");
  let postList;
  if (path[path.length - 1] === "user") {
    postList = await prisma.post.findMany({
      where: {
        authorId: req.params.id
      },
      orderBy: {
        postDate: "desc"
      },
      include: {
        Likes: {
          include: {
            likedBy: true
          }
        },
        Comments: {
          include: {
            author: {
              omit: {
                password: true
              }
            }
          }
        },
        author: true
      }
    });
  } else {
    postList = await prisma.post.findMany({
      orderBy: {
        postDate: "desc"
      },
      include: {
        Likes: {
          include: {
            likedBy: true
          }
        },
        Comments: {
          include: {
            author: {
              omit: {
                password: true
              }
            }
          }
        },
        author: true
      }
    });
  }
  res.status(200).json(postList);
});

export const put_update_post = expressAsyncHandler(async (req, res, next) => {
  const updatedPost = await prisma.post.update({
    where: {
      id: req.body.id
    },
    data: {
      text: req.body.text
    }
  });
  res.status(200).json(updatedPost);
});

export const get_search_post = expressAsyncHandler(async (req, res, next) => {
  const postList = await prisma.post.findMany({
    where: {
      authorId: req.params.id,
      text: {
        contains: req.params.postText
      }
    },
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      Comments: {
        where: {
          deletedText: {
            not: null
          }
        },
        include: {
          author: {
            omit: {
              password: true
            }
          }
        }
      },
      author: true
    }
  });
  res.status(200).json(postList);
});

export const get_search_post_text = expressAsyncHandler(async (req, res, next) => {
  const postList = await prisma.post.findMany({
    where: {
      text: {
        contains: req.params.text
      }
    },
    orderBy: {
      postDate: "desc"
    },
    include: {
      author: true
    }
  });
  res.status(200).json(postList);
});

export const admin_get_user_posts = expressAsyncHandler(async (req, res, next) => {
  const postList = await prisma.post.findMany({
    where: {
      authorId: req.params.id
    },
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      Comments: {
        include: {
          author: {
            omit: {
              password: true
            }
          }
        }
      },
      author: true
    }
  });
  res.status(200).json(postList);
});

export const admin_get_all_posts = expressAsyncHandler(async (req, res, next) => {
  const postList = await prisma.post.findMany({
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      Comments: {
        include: {
          author: {
            omit: {
              password: true
            }
          }
        }
      },
      author: true
    }
  });
  res.status(200).json(postList);
});

export default post_post;
