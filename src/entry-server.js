import {createApp} from './main';

export default context => {
  return new Promise ((resolve, reject) => {
    const beginTime = Date.now ();
    const {app, router, store} = createApp ();

    router.push (context.url);

    router.onReady (() => {
      context.rendered = () => {
        context.state = store.state;
        console.log (
          `[DATE] data pre-fetch: ${Date.now () - beginTime}ms url=${context.url}`
        );
      };
      resolve (app);
    }, reject);
  });
};
