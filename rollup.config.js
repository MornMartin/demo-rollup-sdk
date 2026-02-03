import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import clear from 'rollup-plugin-clear';
import pkg from './package.json' with { type: 'json' };
import { resolve as pathResolve } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export default [
	{
		input: 'src/index.ts',
		output: [
			{ // browser-friendly UMD build.
				name: 'MetaAssistantSdk',
				file: pathResolve('dist', pkg.browser),
				format: 'umd'
			},
			{ // CommonJS build.
				file: pathResolve('dist', pkg.main),
				format: 'cjs'
			},
			{ // ES module build.
				file: pathResolve('dist', pkg.module),
				format: 'es'
			}
		],
		plugins: [
			clear({ targets: ['dist'] }),
			resolve({
				browser: true,
				preferBuiltins: false,
				mainFields: ['browser', 'module', 'main'] // 优先使用 browser 字段
			}),   // so Rollup can find `xx`
			commonjs(),  // so Rollup can convert `xx` to an ES module
			typescript(), // so Rollup can convert TypeScript to JavaScript
			copy({
				targets: [
					{ src: 'package.json', dest: 'dist' },
				],
				copyOnce: isProduction // 确保在 watch 模式下每次构建都尝试复制
			}),
			{
				name: 'watch-public',
				buildStart() {
					// 显式告诉 Rollup 监听此文件，变更时触发重新构建
					this.addWatchFile(pathResolve('package.json'));
				}
			},
		]
	},
];