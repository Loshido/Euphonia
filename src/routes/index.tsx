import { component$, createContextId, useContext, useContextProvider, type NoSerialize, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { Session } from "~/components/types/current";
import Bar from "~/components/bar";
import { seriesCtx } from "./layout";
import Options from "~/components/options";


interface AudioHandle {
	ctx: undefined | NoSerialize<AudioContext>,
    track: undefined | NoSerialize<AudioBufferSourceNode>,
    buffer: undefined | NoSerialize<AudioBuffer>
}
export const audioCtx = createContextId<AudioHandle>("audioCtx")
export const sessionCtx = createContextId<Session>("sessionCtx")

export default component$(() => {
	const series = useContext(seriesCtx)
	const session: Session = useStore({
		music: null,
		elapsed: 0,
		state: "suspended",
		historic: [],
		random: false,
		pause: 5,
		duration: 90
	})
	const audio = useStore<AudioHandle>({
        ctx: undefined,
        track: undefined,
        buffer: undefined
    })
    useContextProvider(audioCtx, audio)
	useContextProvider(sessionCtx, session)
	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(() => {
		document.addEventListener('series-uploaded', async () => {
			session.music = series[0].musics[0]
			if(session.change) await session.change();
		})
	})

	return <section 
		style="width: 100vw; height: 100vh;background-color: #e5e5f730;
		background-size: 10px 10px;background-image: repeating-linear-gradient(45deg, #444cf730 0, #444cf730 1px, #e5e5f730 0, #e5e5f730 50%);" 
		class="flex flex-col justify-between">
		<Options />
		<Bar />
	</section>
});

export const head: DocumentHead = {
	title: "Euphonia",
	meta: [
		{
			name: "description",
			content: "Une application web qui permet de jouer des playlists et configurer la façon par laquelle la musique est jouée.",
		},
	],
};
