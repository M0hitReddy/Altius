// // Example API response for a single user
// const userApiResponse: ApiResponse<User> = {
//     data: {
//       id: '1',
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//     },
//     error: null,
//     loading: false,
//   };
  
//   // Example API response for a list of posts
//   const postsApiResponse: ApiResponse<Post[]> = {
//     data: [
//       {
//         id: '1',
//         title: 'First Post',
//         content: 'This is the first post.',
//         authorId: '1',
//       },
//       {
//         id: '2',
//         title: 'Second Post',
//         content: 'This is the second post.',
//         authorId: '1',
//       },
//     ],
//     error: null,
//     loading: false,
//   };


export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    url?: string; // Add the optional url property
    error: string | null;
    // loading: boolean;


}