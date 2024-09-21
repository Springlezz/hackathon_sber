import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'client/index.jsx',
    output: {
        file: 'public/bundle.js',
        format: 'iife'
    },
    plugins: [
        resolve(),
        commonjs({ sourceMap: false }),
        babel({
            babelHelpers: 'bundled',
            presets: [
                ['@babel/preset-env', {
                    useBuiltIns: 'usage',
                    corejs: 3
                }]
            ],
            plugins: ['./compiler.js'],
            exclude: ['node_modules/core-js/**'],
        }),
        terser({
            compress: {
                unsafe: true
            },
            format: {
                comments: false
            }
        }),
        postcss({
            modules: {
                localsConvention: 'camelCaseOnly',
                generateScopedName: '[hash:base64:3]'
            },
            autoModules: false,
            minimize: {
                preset: ['cssnano-preset-advanced']
            },
            extract: 'styles.css'
        })
    ]
};