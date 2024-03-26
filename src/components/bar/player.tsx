import { $, component$, noSerialize, useContext, useOnDocument } from "@builder.io/qwik";
import { sessionCtx } from "~/routes";
import { seriesCtx } from "~/routes/layout";
import { audioCtx } from "~/routes";

export default component$(() => {
    const series = useContext(seriesCtx)
    const session = useContext(sessionCtx)
    const s = useContext(audioCtx)
    
    useOnDocument("DOMContentLoaded", $(() => {
        session.change = $(async () => {
            if(s.ctx === undefined) {
                s.ctx = noSerialize(new AudioContext())
            }
            if(s.track && s.ctx !== undefined) {
                s.track.stop()
                s.track.disconnect(s.ctx.destination)
            }
            if(session.music === null || session.music.file === undefined) {
                console.error("⚠️ session.music.file is undefined!")
                return
            }
            (s.ctx as AudioContext).decodeAudioData(await session.music.file.arrayBuffer(), cb => {
                s.buffer = noSerialize(cb)
                if(s.ctx === undefined) return
                s.track = noSerialize(s.ctx.createBufferSource())
                if(s.track === undefined || s.buffer === undefined) console.error("⚠️ track or buffer is undefined")
                else {
                    s.track.buffer = s.buffer
                    s.track.connect(s.ctx.destination)
                    s.track.start(0)
                    if(session.duration && s.buffer.duration > session.duration) s.track.stop(s.ctx.currentTime + session.duration)
                    const id = session.music?.file?.name
                    s.track.addEventListener("ended", () => {
                        if(session.state === "suspended") return
                        session.state = "paused"
                        setTimeout(() => {
                            const new_id = session.music?.file?.name
                            if(new_id === id) {
                                const next = document.getElementById("player-next") as HTMLElement
                                next.dispatchEvent(new Event("click"))
                            }
                        }, session.pause * 1000)
                        
                    })
                    session.state = "playing"
                }
            })

        })
    }))

    return <section 
        id="player"
        class="grid grid-cols-3 w-fit border border-opacity-25 border-white rounded-md p-2 justify-items-center gap-2">
        <svg 
            id="player-previous"
            class="rotate-180 hover:bg-white hover:bg-opacity-25 cursor-pointer rounded-lg p-2 transition-all duration-300"
            viewBox="0 0 512 512" 
            width="56" 
            height="56"
            onClick$={async () => {
                if(session.historic.length === 0) return 
                const previous = session.historic.pop()
                if(previous && session.change) {
                    session.music = series[previous.id_serie].musics[previous.id_title]
                    await session.change()
                    session.state = "playing"
                }
                return undefined
            }}>
            <path
                d="M283.797 480C274.938 480.004 266.277 477.379 258.91 472.456C251.543 467.534 245.8 460.536 242.41 452.347C239.019 444.159 238.132 435.148 239.862 426.455C241.591 417.762 245.859 409.777 252.125 403.512L389.023 266.575C390.413 265.187 391.516 263.539 392.268 261.725C393.02 259.911 393.408 257.966 393.408 256.002C393.408 254.038 393.02 252.093 392.268 250.278C391.516 248.464 390.413 246.816 389.023 245.429L252.244 108.492C243.844 100.091 239.124 88.6966 239.121 76.8139C239.118 64.9313 243.833 53.5343 252.229 45.1301C260.625 36.7258 272.015 32.0028 283.891 32C295.768 31.9972 307.159 36.7149 315.559 45.1151L452.457 182.082C472.016 201.706 483 228.288 483 256.002C483 283.715 472.016 310.298 452.457 329.921L315.559 466.889C311.388 471.059 306.436 474.363 300.985 476.613C295.534 478.863 289.693 480.014 283.797 480Z"
                fill="white" />
            <path
                d="M72.9986 480C64.0998 480.004 55.3998 477.379 47.9994 472.456C40.599 467.534 34.8309 460.536 31.4249 452.347C28.0189 444.159 27.1282 435.148 28.8654 426.455C30.6026 417.762 34.8896 409.777 41.184 403.512L189.402 256.002L41.304 108.492C32.8662 100.091 28.1244 88.6966 28.1215 76.8139C28.1187 64.9313 32.8552 53.5343 41.289 45.1301C49.7228 36.7258 61.163 32.0028 73.093 32C85.0229 31.9972 96.4654 36.7149 104.903 45.1151L284.816 224.314C288.996 228.474 292.311 233.414 294.574 238.851C296.836 244.288 298 250.116 298 256.002C298 261.887 296.836 267.715 294.574 273.153C292.311 278.59 288.996 283.53 284.816 287.69L104.903 466.889C100.714 471.059 95.7388 474.363 90.2637 476.613C84.7887 478.863 78.9214 480.014 72.9986 480Z"
                fill="white" />
        </svg>
        {
            session.state === "suspended"
            ? <svg 
                class="hover:bg-white hover:bg-opacity-25 cursor-pointer rounded-lg p-2 transition-all duration-300"
                viewBox="0 0 512 512" 
                width="56" 
                height="56"
                onClick$={() => {
                    if(s.ctx === undefined) return
                    s.track = noSerialize(s.ctx.createBufferSource())
                    if(s.track === undefined || s.buffer === undefined) console.error("⚠️ track or buffer is undefined")
                    else {
                        s.track.buffer = s.buffer
                        s.track.connect(s.ctx.destination)
                        s.track.start(s.ctx.currentTime)
                        if(session.duration) s.track.stop(s.ctx.currentTime + session.duration)
                    }
                    session.state = "playing"
                }}>
                <path
                    d="M434.885 312.534L140.788 473.566C97.4823 497.919 44 466.617 44 417.007V95C44 45.3343 97.4823 14.0884 140.788 38.441L434.885 199.473C479.039 224.278 479.039 287.73 434.885 312.534Z"
                    fill="white" />
            </svg>
            : <svg 
                class="hover:bg-white hover:bg-opacity-25 cursor-pointer rounded-lg p-2 transition-all duration-300"
                onClick$={() => {
                    if(s.track && s.ctx) {
                        s.track.stop()
                        s.track.disconnect(s.ctx.destination)
                    }
                    session.state = "suspended"
                    console.log(session.state)
                }}
                viewBox="0 0 24 24" 
                width="56" 
                height="56">
                <path fill="white" d="M6.5,0A3.5,3.5,0,0,0,3,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,6.5,0Z" />
                <path fill="white" d="M17.5,0A3.5,3.5,0,0,0,14,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,17.5,0Z" />
            </svg>
        }        
        <svg 
            id="player-next"
            class="hover:bg-white hover:bg-opacity-25 cursor-pointer rounded-lg p-2 transition-all duration-300"
            width="56" 
            height="56" 
            viewBox="0 0 512 512"
            onClick$={async () => {
                let id_music;
                if(session.music === null) return 
                if(session.random) {
                    id_music = Math.floor(Math.random() * series[session.music.id_serie].musics.length)
                } else {
                    id_music = (session.music.id_music + 1) % series[session.music.id_serie].musics.length
                }
                session.historic.push({
                    id_serie: session.music.id_serie,
                    id_title: session.music.id_music
                })
                session.music = series[session.music.id_serie].musics[id_music]
                if(session.change) {
                    await session.change()
                    session.state = "playing"
                }
            }}>
            <path
                d="M283.797 480C274.938 480.004 266.277 477.379 258.91 472.456C251.543 467.534 245.8 460.536 242.41 452.347C239.019 444.159 238.132 435.148 239.862 426.455C241.591 417.762 245.859 409.777 252.125 403.512L389.023 266.575C390.413 265.187 391.516 263.539 392.268 261.725C393.02 259.911 393.408 257.966 393.408 256.002C393.408 254.038 393.02 252.093 392.268 250.278C391.516 248.464 390.413 246.816 389.023 245.429L252.244 108.492C243.844 100.091 239.124 88.6966 239.121 76.8139C239.118 64.9313 243.833 53.5343 252.229 45.1301C260.625 36.7258 272.015 32.0028 283.891 32C295.768 31.9972 307.159 36.7149 315.559 45.1151L452.457 182.082C472.016 201.706 483 228.288 483 256.002C483 283.715 472.016 310.298 452.457 329.921L315.559 466.889C311.388 471.059 306.436 474.363 300.985 476.613C295.534 478.863 289.693 480.014 283.797 480Z"
                fill="white" />
            <path
                d="M72.9986 480C64.0998 480.004 55.3998 477.379 47.9994 472.456C40.599 467.534 34.8309 460.536 31.4249 452.347C28.0189 444.159 27.1282 435.148 28.8654 426.455C30.6026 417.762 34.8896 409.777 41.184 403.512L189.402 256.002L41.304 108.492C32.8662 100.091 28.1244 88.6966 28.1215 76.8139C28.1187 64.9313 32.8552 53.5343 41.289 45.1301C49.7228 36.7258 61.163 32.0028 73.093 32C85.0229 31.9972 96.4654 36.7149 104.903 45.1151L284.816 224.314C288.996 228.474 292.311 233.414 294.574 238.851C296.836 244.288 298 250.116 298 256.002C298 261.887 296.836 267.715 294.574 273.153C292.311 278.59 288.996 283.53 284.816 287.69L104.903 466.889C100.714 471.059 95.7388 474.363 90.2637 476.613C84.7887 478.863 78.9214 480.014 72.9986 480Z"
                fill="white" />
        </svg>
    </section>
})