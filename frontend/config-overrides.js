const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dependencies = require('./package.json').dependencies;

module.exports = function override(config, env) {
    config.output.publicPath = 'auto';
    config.plugins.push(
        new ModuleFederationPlugin({
            name: 'monolithApp',
            remotes: {
                AuthApp: 'auth@http://localhost:3001/remoteEntry.js',
                UsersApp: 'users@http://localhost:3002/remoteEntry.js',
                CardsApp: 'cards@http://localhost:3003/remoteEntry.js',
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
