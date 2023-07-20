import 'virtual:uno.css'
import type { Component } from 'vue'
import { createApp as _createApp, createSSRApp } from 'vue'

export function createApp(RootComponent: Component, _props: any = {}) {
  const app = typeof window !== 'undefined' ? _createApp(RootComponent, _props) : createSSRApp(RootComponent, _props)

  return app
}
