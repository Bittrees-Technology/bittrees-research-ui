# bittrees-nft-deployer-ui-for-bag

NFT Deployer for Builders Advocacy Group (BAG)

Includes:

- React via [Create React App](https://github.com/facebook/create-react-app) plus TypeScript
- [RainbowKit](https://www.rainbowkit.com/)
- [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/)

## Scripts

### Run site locally

Run `REACT_APP_ENABLE_TESTNETS=true yarn start`

Make sure you bring in latest ABI!

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Build app

Run `yarn build`.

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## To deploy app to Azure

Create a PR that merges `main` to `azcontainerdeploy-prod` to deploy to production at <https://bag-website-caddy.eastus.azurecontainer.io>

Or merge to `azcontainerdeploy-dev` to deploy to dev at <http://bag-website-dev.eastus.azurecontainer.io>.
