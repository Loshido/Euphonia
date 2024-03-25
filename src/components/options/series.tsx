import { component$, useContext } from "@builder.io/qwik";
import { sessionCtx } from "~/routes";
import { seriesCtx } from "~/routes/layout";

export default component$(() => {
    const series = useContext(seriesCtx)
    const session = useContext(sessionCtx)

    return <dialog 
        id="series"
        class="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex flex-row flex-wrap p-10 gap-4 z-40"
        onClick$={(event) => {
            const target = event.target as HTMLElement
            // @ts-ignore
            if(target.tagName === "DIALOG") target.close()
        }}>
        {
            series.map(serie => <div 
                key={serie.title}
                class={[
                    "px-8 py-2 h-fit",
                    "font-semibold text-2xl",
                    "cursor-pointer select-none",
                    "bg-white rounded w-86 hover:bg-blue-200",
                    "transition-colors duration-300",
                    serie.title === session.music?.serie ? 'active blue' : 'null'
                ]}
                onClick$={async () => {
                    session.music = serie.musics[0]

                    const d = document.getElementById("series") as HTMLDialogElement
                    d.close()
                    if(session.change) {
                        await session.change()
                    }
                }}>
                {serie.title}
            </div>)
        }
    </dialog>
})