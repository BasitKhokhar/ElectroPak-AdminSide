import 'dotenv/config';

export default () => ({
    expo: {
      name: "Electro Pak Admin",
      slug: "electropak-admin",
      version: "1.0.0",
      extra: {
        API_BASE_URL: process.env.API_BASE_URL,
      },
    },
  });
  