/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  env: {
   // apiws: 'ws://192.168.11.27:6060',// ..prueba manuel
   // apiurl: "http://192.168.11.27:6060",// ..prueba manuel
     apiws: 'ws://192.168.210.215:6060', // ..produccion manuel
      apiurl: 'http://192.168.210.215:6070',//  .. produccion manuel,
    apimanuel: 'http://192.168.11.242:4500',
    apiauditoriosis: 'http://192.168.210.215:8081',
    apijimmynew: "http://192.168.20.20:9797",
   // apijimmynew: "http://192.168.210.215:6062",
    AUTH_SECRET: 'J8Jt9JPwxJGObxxbFXda/ncOyYi9RigtqTZts5NS/Aw=',
    apireportespatologia:"http://localhost:8081/",
    apiWebOrigenNodeJs:'http://192.168.250.10:8081/'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailus.io'
      }
    ]
  }
};

export default nextConfig;
