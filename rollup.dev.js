import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
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
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            plugins: ['./compiler.js']
        }),
        postcss({
            modules: {
                localsConvention: 'camelCaseOnly',
                generateScopedName: '[local]_[name]_[hash:base64:3]'
            },
            autoModules: false,
            extract: 'styles.css'
        })
    ]
};