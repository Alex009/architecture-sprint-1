const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dependencies = require('./package.json').dependencies;

module.exports = function override(config, env) {
    config.output.publicPath = 'auto';
    config.plugins.push(
        new ModuleFederationPlugin({
            name: "cards",
            filename: "remoteEntry.js",
            remotes: {
                UsersApp: 'users@http://localhost:3002/remoteEntry.js',
            },
            exposes: {
                "./AddPlacePopup": "./src/components/AddPlacePopup.js",
                "./Card": "./src/components/Card.js",
                "./ImagePopup": "./src/components/ImagePopup.js",
                "./RemoveCardPopup": "./src/components/RemoveCardPopup.js",
                "./RefreshCardsEffect": "./src/utils/RefreshCardsEffect.js",
                "./CardHandlers": "./src/handlers/cardHandlers.js"
            },
            shared: {
                "react": {
                    singleton: true,
                    requiredVersion: dependencies["react"]
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: dependencies["react-dom"]
                },
                "react-router-dom": {
                    singleton: true,
                    requiredVersion: dependencies["react-router-dom"]
                }
            }
        })
    );
    return config;
};
