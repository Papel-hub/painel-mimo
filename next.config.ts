/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 👇 Google (login com Google / Firebase)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      },

      // 👇 Gravatar (usado por e-mails / perfis genéricos)
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },

      // 👇 Facebook
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
      },

      // 👇 GitHub
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },

      // 👇 Apple ID (alguns logins)
      {
        protocol: 'https',
        hostname: 'appleid.apple.com',
      },

      // 👇 Twitter / X
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },

      // 👇 Discord
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },

      // 👇 LinkedIn
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },

      // 👇 Cloudinary (caso hospede imagens)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },

      // 👇 Imgur (caso use links externos)
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
};

module.exports = nextConfig;


