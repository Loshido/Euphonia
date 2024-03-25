import { component$, useContext } from "@builder.io/qwik";
import Player from "./player";
import { sessionCtx } from "~/routes";

export default component$(() => {
    const session = useContext(sessionCtx)

    return <div 
        class="text-white w-full h-32 overflow-hidden grid grid-cols-3 justify-items-center items-center"
        style="background: linear-gradient(45deg, rgb(37,141,235) 0%, rgb(56,37,235) 100%);">
        <div class="truncate w-full md:px-12 sm:px-6">
            <h1 class="text-4xl font-semibold capitalize">{
                session.state === "paused" ? 'Pause' : session.music?.title || "Indisponible"
            }</h1>
            <p class="font-light text-lg">{
                session.music?.serie || "Indisponible"
            }</p>
        </div>
        <Player/>
        <div class="flex flex-row gap-2">
            <svg 
                class={[
                    "rounded-full cursor-pointer p-2 hover:bg-white hover:bg-opacity-50",
                    "transition-colors duration-300",
                    session.random ? 'active' : ''
                ]}
                onClick$={() => {
                    session.random = !session.random
                }}
                viewBox="0 0 24 24" 
                width="56" 
                height="56">
                <path
                    fill="white"
                    d="M18.414,7.9V9.586a1,1,0,0,0,1.707.707l3.586-3.586a1,1,0,0,0,0-1.414L20.121,1.707a1,1,0,0,0-1.707.707v2.4c-3.35.732-5.6,2.781-7.51,4.911C8.718,7.316,6.08,5.021,1.83,4.586c-.046-.01-.311-.039-.33-.039a1.5,1.5,0,0,0-.131,2.994h0c3.464.3,5.5,2.159,7.549,4.458-2.046,2.3-4.087,4.166-7.552,4.462h0A1.5,1.5,0,0,0,1.5,19.453c.038,0,.073,0,.111-.008h0C6.84,19,9.649,15.753,12.148,12.86,14.059,10.65,15.792,8.7,18.414,7.9Z" />
                <path
                    fill="white"
                    d="M20.121,13.707a1,1,0,0,0-1.707.707v1.7a9.186,9.186,0,0,1-3.452-2,1.466,1.466,0,0,0-2.062.157l-.025.028a1.49,1.49,0,0,0,.165,2.111A11.977,11.977,0,0,0,18.414,19.2v2.391a1,1,0,0,0,1.707.707l3.586-3.586a1,1,0,0,0,0-1.414Z" />
            </svg>
        </div>
    </div>
})