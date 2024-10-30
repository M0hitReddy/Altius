/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
      // {
      //   protocol: "https",
      //   hostname: "picsum.photos",
      //   port: "",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "res.cloudinary.com",
      //   port: "",
      //   pathname: "/**",
      // },
      
      // {
      //   protocol: "https",
      //   hostname: "miro.medium.com",
      //   port: "",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "lh3.googleusercontent.com",
      //   port: "",
      //   pathname: "/**",
      // },
      
    ],
  },
};

export default nextConfig;