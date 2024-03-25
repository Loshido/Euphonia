import type { QRL } from "@builder.io/qwik"
import type { Music } from "./music"
export interface Session {
    music: Music | null,
    elapsed: number,
    state: "playing" | "suspended" | "paused",
    historic: {
        id_title: number,
        id_serie: number
    }[],
    random: boolean,
    change?: QRL<() => void>,
    pause: number,
    duration: number | false
}