import { envs } from './config/envs';
import { MongoDatabase } from './data';
import { AppRoutes } from './presentation/http/routes';
import { Server } from './presentation/http/server';


(async () => {
  main();
})();


async function main() {

  await MongoDatabase.connect({ mongoUri: envs.MONGO_URI, dbName: envs.MONGO_DB_NAME });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}