/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  env: {
    apiws: 'ws://192.168.210.225:6060', // ..produccion manuel
    //    apiurl: 'http://192.168.13.7:6060',//  .. PRUEBA manuel,
    apiurl: 'http://192.168.210.225:6060',//  .. produccion manuel,
    apifms: 'http://192.168.210.18:8001', // ..produccion fms
    apimanuel: 'http://192.168.11.242:4500',
    apiauditoriosis: 'http://192.168.210.225:8081',
   // apijimmynew: "http://192.168.20.162:9797",//prueba
      apijimmynew: "http://192.168.210.225:9797",  //produccion
    apifirma: "http://192.168.13.7:8080",
    apivalidacionsis: "http://192.168.210.69:9095",
    AUTH_SECRET: 'J8Jt9JPwxJGObxxbFXda/ncOyYi9RigtqTZts5NS/Aw=',
    apireportespatologia: "http://192.168.250.10:8083/",
    apiWebOrigenNodeJs: 'http://192.168.250.10:8081/',
    apiServiciosRefcon: 'https://dservicios.minsa.gob.pe'
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
