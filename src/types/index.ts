export interface Image {
  thumb: string
  fullsize: string
  alt: string
}

export interface Author {
  avatar: string
  displayName: string
  handle: string
}

export interface Media {
  images?: Image[]
}

export interface Embed {
  $type: string
  record?: {
    record?: {
      cid: string
    }
  }
  media?: Media
  images?: Image[]
}

export interface Record {
  author?: Author
  value?: {
    text: string
  }
  embeds?: Embed[]
}
