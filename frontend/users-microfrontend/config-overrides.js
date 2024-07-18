const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dependencies = require('./package.json').dependencies;

module.exports = function override(config, env) {
    config.output.publicPath = 'auto';
    config.plugins.push(
        new ModuleFederationPlugin({
            name: "users",
            filename: "remoteEntry.js",
            remotes: {},
            exposes: {
                "./EditAvatarPopup": "./src/components/EditAvatarPopup.js",
                "./EditProfilePopup": "./src/components/EditProfilePopup.js",
                "./ProfileInfo": "./src/components/ProfileInfo.js",
                "./CurrentUserContext": "./src/context/CurrentUserContext.js",
                "./RefreshUserEffect": "./src/utils/RefreshUserEffect.js"
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
