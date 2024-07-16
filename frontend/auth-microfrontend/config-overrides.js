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
                "./CurrentUserContext": "./src/context/CurrentUserContext.js"
            },
            shared: {
                "react": {
                    singleton: true,
                    requiredVersion: dependencies["react"]
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: dependencies["react-dom"]
                }
            }
        })
    );
    return config;
}
