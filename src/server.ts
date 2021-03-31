import { validateEnv } from '@core/utils';
import 'dotenv/config'
import { IndexRoute } from '@modules/index';
import App from './app'
import UsersRoute from '@modules/users/user.route';

validateEnv();
const routes = [new IndexRoute(), new UsersRoute()];
const app = new App(routes);

app.listen();