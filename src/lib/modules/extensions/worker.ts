import { finalizer } from 'abslink'
import { expose } from 'abslink/w3c'

import SUPPORTS from '../settings/supports'

import type { NZBQuery, SearchOptions, AnimeQuery, TorrentResult, TorrentSource, NZBSource, SubtitleSource } from './types'

const _fetch = SUPPORTS.isIOS
  ? (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string') {
        input = input.replace(/^https?:\/\//, 'cors://')
      } else if (input instanceof URL) {
        input = new URL(input.toString().replace(/^https?:\/\//, 'cors://'))
      } else if (input instanceof Request) {
        input = new Request(input.url.replace(/^https?:\/\//, 'cors://'), input)
      }
      return fetch(input, init)
    }
  : fetch

// this entire file is a shitstorm, this needs to be written better
type LoadedExtension<TSource extends TorrentSource | NZBSource | SubtitleSource> = TSource & { url: string }

export class ExtensionWorker<TSource extends TorrentSource | NZBSource | SubtitleSource = TorrentSource | NZBSource | SubtitleSource> {
  mod = null as unknown as Promise<LoadedExtension<TSource>>

  construct (code: string) {
    this.mod = this.load(code)
  }

  async load (code: string): Promise<LoadedExtension<TSource>> {
    // WARN: unsafe eval
    const url = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }))
    const module = await import(/* @vite-ignore */url)
    URL.revokeObjectURL(url)
    return module.default
  }

  async loaded () {
    await this.mod
  }

  [finalizer] () {
    console.log('destroyed worker', self.name)
    self.close()
  }

  async url () {
    return (await this.mod).url
  }

  async single (
    query: TSource extends NZBSource ? NZBQuery<{ file: string }> : Omit<AnimeQuery, 'resolution' | 'exclusions'>,
    options?: SearchOptions
  ): Promise<TSource extends NZBSource ? string : TSource extends SubtitleSource ? Array<{url: string, language: string}> : TorrentResult[]> {
    const queryWithFetch = { ...query, fetch: _fetch }

    // @ts-expect-error w/e cba
    return await (await this.mod).single(queryWithFetch, options)
  }

  async batch (
    query: TSource extends NZBSource ? NZBQuery<{ files: string[], name: string }> : AnimeQuery,
    options?: SearchOptions
  ): Promise<TSource extends NZBSource ? string : TSource extends SubtitleSource ? never : TorrentResult[]> {
    const queryWithFetch = { ...query, fetch: _fetch }

    // @ts-expect-error w/e cba
    return await (await this.mod).batch(queryWithFetch, options)
  }

  async movie (query: AnimeQuery, options?: SearchOptions) {
    const queryWithFetch = { ...query, fetch: _fetch }
    return await (await this.mod as unknown as TorrentSource).movie(queryWithFetch, options)
  }

  async test () {
    return await (await this.mod).test()
  }
}

export default expose(new ExtensionWorker())
