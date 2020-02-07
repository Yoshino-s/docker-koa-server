const ServerConfig = {
  server: {
    port: 3000,
    server: 'localhost',
  },
  redis: {
    port: 6379,
    server: 'redis',
  },
  mySQL: {
    //set in ormconfig.json
  }
};

export default ServerConfig;