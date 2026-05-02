interface Config {
  API_URL: string;
}

const config: Config = {
  API_URL: import.meta.env.PROD
    ? '/api' 
    : 'http://localhost:5000/api'
};

export default config;
