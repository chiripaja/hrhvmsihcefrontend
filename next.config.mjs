/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  env: {
    apiws: 'ws://192.168.210.225:6060', // ..produccion manuel
    //  apiurl: 'http://192.168.210.225:6060',//  .. produccion manuel,
    apiurl: 'http://192.168.210.225:6060',//  .. produccion manuel,
    apimanuel: 'http://192.168.11.242:4500',
    apiauditoriosis: 'http://192.168.210.225:8081',
    apijimmynew: "http://192.168.13.14:9797",//prueba
   //  apijimmynew: "http://192.168.210.225:9797",  //produccion
    AUTH_SECRET: 'J8Jt9JPwxJGObxxbFXda/ncOyYi9RigtqTZts5NS/Aw=',
    apireportespatologia: "http://localhost:8081/",
    apiWebOrigenNodeJs: 'http://192.168.250.10:8081/'
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
