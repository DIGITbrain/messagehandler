export default {
  id: "default",
  url: process.env.DB_URL || "mongodb://root:root@mongo:27017/messagehandler?authSource=admin",
  connectionOptions: { }
};
