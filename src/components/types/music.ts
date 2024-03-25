import type { NoSerialize } from "@builder.io/qwik"

export interface Music {
    id_music: number,
    id_serie: number,
    title: string,
    serie: string,
    file: NoSerialize<File>
}

export interface Serie {
    title: string,
    musics: Music[]
}