import { resolve } from 'path'

export const pathResolve = dir => resolve(__dirname, '..', '../', dir)
