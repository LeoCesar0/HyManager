import {
  GetAllSongsQuery,
  GetAllStoriesQuery,
  GetSongBySlugQuery,
  GetStoryBySlugQuery,
  Locale
} from "../graphql/generated"

const languages = ["pt", "en"] as const

// extract type from languages above

export type LanguageType = typeof languages[number]

export type Localizer<Type> = {
  [lang in Locale]: Type
}


// export type StoryType = GetAllStoriesQuery["stories"][0]["localizations"][0]

// export type SongType = GetAllSongsQuery["songs"][0]["localizations"][0]

// export type StoryType = GetStoryBySlugQuery['story']

// export type SongType = GetSongBySlugQuery["song"]

export type SongType = {
  __typename?: "Song"
  featured?: boolean | null
  description?: string | null
  title: string
  locale: Locale
  updatedAt: any
  scheduleDate?: any | null
  createdAt: any
  image: { __typename?: "Asset"; url: string }
  lyrics?: { __typename?: "RichText"; html: string } | null
  authors: Array<{
    __typename?: "Author"
    name: string
    alias: Array<string>
    slug?: string | null
    image: { __typename?: "Asset"; url: string }
  }>
  stories: Array<{ __typename?: "Story"; title: string; slug?: string | null }>
}

export type LocalizedSongType = Localizer<SongType>


export type StoryType = {
  __typename?: "Story"
  featured?: boolean | null
  description?: string | null
  title: string
  locale: Locale
  updatedAt: any
  scheduleDate?: any | null
  createdAt: any
  image: { __typename?: "Asset"; url: string }
  images: Array<{ __typename?: "Asset"; url: string }>
  text?: { __typename?: "StoryTextRichText"; html: string } | null
  authors: Array<{
    __typename?: "Author"
    name: string
    alias: Array<string>
    slug?: string | null
    image: { __typename?: "Asset"; url: string }
  }>
  songs: Array<{ __typename?: "Song"; title: string; slug?: string | null }>
}

export type LocalizedStoryTyoe = Localizer<StoryType>