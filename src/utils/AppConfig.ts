export const AppConfig = {
  site_name: 'Zk Block',
  title: 'Zk Block - Tools for developing Zk Dapps',
  description: 'Tools and Boilerplate for Zk Dapps | Zero Knowledge Proofs',
  locale: 'en',
};

export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const endpoints = {
  getLatestTweets: `${BACKEND_BASE_URL}/project/v1-get-latest-tweets`,
  listProjects: `${BACKEND_BASE_URL}/project/v1-list-projects`,
};
