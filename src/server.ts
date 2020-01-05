import app from './app';

/**
 * Start Express server
 */
const server = app.listen(app.get('port'), () => {
  console.log(
    `Server is listening on ${app.get('port')}, env: ${app.get('env')}`,
  );
});

export default server;
