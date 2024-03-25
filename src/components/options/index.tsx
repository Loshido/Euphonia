import { $, component$, Slot, useContext, useSignal, type QRL } from "@builder.io/qwik";
import Series from "./series";
import { audioCtx, sessionCtx } from "~/routes";

const Pause = component$(() => <div
    class={[
        "bg-blue-500 bg-opacity-75",
        "text-xl font-semibold",
        "p-3 rounded h-fit"
    ]}>
    <label class="pr-4">Pause</label>
    <Slot/>
    <span>s</span>
</div>)

const Pitch = component$(() => <div
    class={[
        "bg-blue-500 bg-opacity-75",
        "text-xl font-semibold",
        "p-3 rounded h-fit"
    ]}>
    <label class="pr-4">Pitch</label>
    <Slot/>
</div>)

const Durée = component$(({active, activate} : {active: boolean, activate: QRL<() => void>}) => <div
    class={[
        "bg-blue-500 bg-opacity-75",
        "text-xl font-semibold",
        "p-3 rounded h-fit",
        "flex flex-row items-center"
    ]}>
    <div 
        onClick$={activate}
        style={active ? 'background: black;' : ''}
        class={[
        "w-7 h-7 inline-block rounded cursor-pointer",
        "bg-gray-700 bg-opacity-50 hover:bg-opacity-75",
        "transition-all duration-300"
        ]}></div>
    <label class="mx-2">Durée</label>
    <Slot/>
    <span>s</span>
</div>)

export default component$(() => {
    const audio = useContext(audioCtx)
    const session = useContext(sessionCtx)
    const durée = useSignal<boolean>(true)
    const duration = useSignal<number>(90)
    
    return <>
        <section 
            class="p-5 m-5 border-2 rounded-lg border-blue-500 flex flex-wrap flex-row gap-2 content-start" 
            style="width: calc(100% - 40px); height: calc(100% - 40px);">

            <div 
                class={[
                    "bg-blue-500 bg-opacity-75 hover:bg-opacity-50",
                    "text-xl font-semibold",
                    "p-3 rounded h-fit select-none cursor-pointer",
                    "transition-all duration-300"
                ]}
                onClick$={() => {
                    const d= document.getElementById("series") as HTMLDialogElement
                    d.open = true
                }}
            >Choix série</div>
            <Pitch>
                <input 
                    class="outline-none pl-1 bg-transparent w-16"
                    type="number" 
                    name="pitch" 
                    onInput$={(event) => {
                        const t = event.target as HTMLInputElement
                        const v = parseFloat(t.value)
                        if(audio.track && typeof v === "number" && v > 0) {
                            audio.track.playbackRate.value = v
                        }
                    }}
                    min={-2} max={2} step={0.25} value={1} />
            </Pitch>
            <Pause>
                <input 
                    class="outline-none pl-1 bg-transparent w-12"
                    type="number" 
                    name="pitch" 
                    onInput$={(event) => {
                        const t = event.target as HTMLInputElement
                        const v = parseInt(t.value)
                        if(v >= 0 && v <= 30) {
                            session.pause = v
                        }
                    }}
                    min={0} max={30} value={5} />
            </Pause>
            <Durée
                active={durée.value}
                activate={$(() => {
                    durée.value = !durée.value
                    if(durée.value) {
                        session.duration = duration.value
                    } else {
                        session.duration = false
                    }
                })}>
                <input 
                    class="outline-none pl-1 bg-transparent w-12"
                    type="number" 
                    name="duration" 
                    onInput$={(event) => {
                        const t = event.target as HTMLInputElement
                        const v = parseInt(t.value)
                        if(v > 5 && v < 1800) {
                            duration.value = v
                            if(session.duration !== false) {
                                session.duration = v
                            }
                        }
                    }}
                    min={5} value={90} />
            </Durée>
        </section>
        <Series/>
    </>
})