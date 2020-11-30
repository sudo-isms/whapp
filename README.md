# Front-end Code Assignment

## Get started

Run `npm install`, then start up in dev-mode with `npm start`. the app will be available on <http://localhost:3000>. It assumes that the API-server is running on <http://localhost:7000>, but that's configurable via the `.env`-file in the root.

When running in dev mode, I left in react-query's dev tools (the little flowery thing in the lower left part of the screen). It's not part of the built version. (`npm build`)

I also left in some debugging endpoints in the UI — Products, Sales and Inventory headlines are clickable and they refetch their respective data. Sales entries are deleteable (which might be a bit crazy for a warehouse-app), and there's also a button for restoring article inventory to its original state.
