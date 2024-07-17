const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dependencies = require('./package.json').dependencies;

module.exports = function override(config, env) {
    config.output.publicPath = 'auto';
    config.plugins.push(
        new ModuleFederationPlugin({
            name: "auth",
            filename: "remoteEntry.js",
            remotes: {},
            exposes: {
                "./Login": "./src/components/Login.js",
                "./Register": "./src/components/Register.js",
                "./SignOut": "./src/components/SignOut.js",
                "./CurrentUserContext": "./src/context/CurrentUserContext.js",
                "./UserDataContext": "./src/context/UserDataContext.js",
                "./CheckTokenEffect": "./src/utils/CheckTokenEffect.js"
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
