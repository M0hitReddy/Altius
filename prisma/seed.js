import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const topics = [
  { name: "Technology" },
  { name: "Science" },
  { name: "Health" },
  { name: "Lifestyle" },
  { name: "Education" },
  { name: "Travel" },
  { name: "Food" },
  { name: "Finance" },
  { name: "Fitness" },
  { name: "Fashion" },
];

const CATEGORIES = [
  ...new Set([
    "Technology",
    "Programming",
    "Web Development",
    "Exercise",
    "Movies",
    "Animation",
    "Music",
    "Pop Culture",
    "Science Fiction",
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Mobile Development",
    "UI/UX Design",
    "Business",
    "Entrepreneurship",
    "Marketing",
    "Productivity",
    "Personal Development",
    "Health",
    "Fitness",
    "Travel",
    "Food",
    "Photography",
    "Art",
    "Literature",
    "Education",
    "Flowers",
  ])
];

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: "mohitreddydadireddy@gmail.com",
      password: "110847934411023806810",
      name: "Mohit Reddy Dadireddy",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "learner1930@gmail.com",
      password: "117915998545006749920",
      name: "learning",
    },
  });
  const users = await prisma.user.findMany();
  // const user1 = users[0];
  // const user2 = users[1];

  // Create dummy posts with more content
  await prisma.post.createMany({
    data: [
      {
        title: "Exploring JavaScript Features",
        content:
          "In this post, we dive deep into the advanced features of JavaScript, including closures, promises, async/await, and modern ES6+ features. We also cover tips and tricks for optimizing performance in web applications.",
        published: true,
        authorId: user1.id,
      },
      {
        title: "The Future of Web Development",
        content:
          "Web development is an ever-changing field with new technologies emerging constantly. In this post, we discuss the future of web development, including frameworks like React, Next.js, and new trends such as serverless architecture and edge computing.",
        published: true,
        authorId: user2.id,
      },
      {
        title: "Understanding Databases",
        content:
          "This post covers the essentials of databases, including relational vs. non-relational databases, indexing strategies, and optimizing queries. We also look at different database technologies such as MySQL, PostgreSQL, and MongoDB.",
        published: false,
        authorId: user1.id,
      },
      {
        title: "Scaling Applications",
        content:
          "When it comes to scaling web applications, understanding load balancing, caching, and distributed systems is key. This post explains the best practices for ensuring your application scales efficiently to handle large amounts of traffic.",
        published: true,
        authorId: user2.id,
      },
      {
        title: "Mastering CSS",
        content:
          "CSS is more than just styling. In this post, we delve into advanced CSS concepts like Flexbox, Grid, animations, and how to write maintainable, scalable styles using preprocessors like Sass and CSS-in-JS libraries.",
        published: true,
        authorId: user1.id,
      },
      {
        title: "Building REST APIs with Node.js",
        content:
          "This post guides you through building RESTful APIs using Node.js, Express, and MongoDB. We also cover topics such as authentication, request validation, and optimizing API performance.",
        published: false,
        authorId: user2.id,
      },
      {
        title: "Security Best Practices",
        content:
          "Security is critical in web development. In this post, we cover the best practices for securing web applications, including preventing SQL injection, securing APIs, and implementing strong authentication protocols.",
        published: true,
        authorId: user1.id,
      },
      {
        title: "Introduction to TypeScript",
        content:
          "This post introduces TypeScript and explains how it helps catch bugs early, improves developer productivity, and makes code more maintainable. We also explore advanced TypeScript features like generics and decorators.",
        published: true,
        authorId: user2.id,
      },
    ],
  });

  console.log("Database has been seeded successfully!");
}

async function seedTopics() {
  topics.forEach(async (topic) => {
    await prisma.topic.create({
      data: topic,
    });
  });
  
}

async function seedCategories() {
  for (const category of CATEGORIES) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: { name: category },
      });
    }
  }
}

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


seedTopics()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// seedCategories()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });