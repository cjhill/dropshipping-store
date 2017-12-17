import path from 'path';

const webpackConfig = {
    context: path.resolve(__dirname, './html/js'),
    entry: {
        main: [
            './main.js',
        ],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    resolve: {
        modules: [
            path.resolve(__dirname, './html/js'),
            'node_modules',
            'bower_components',
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            }
        ]
    }
}

export default webpackConfig;
